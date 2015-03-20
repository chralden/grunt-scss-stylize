/*
 * grunt-scss-stylize
 * https://github.com/chralden/grunt-scss-stylize
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */


'use strict';

//Check if declaration string contains comment indicators
var containsComment = function(declaration) {
    return (declaration.indexOf("//") !== -1 || declaration.indexOf("*/") !== -1);
};

//Add flags around comment string
var flag = function(comment) {
    return '{*'+comment.replace(/\n/g, '|n')+'|n*}';
};

//Search declaration string for comment indicators and flag them if present
var flagComments = function(declaration) {
    var temporarydeclaration = "",
        commentTerminated = (declaration.indexOf("/*") === -1);

    //Remove leading comments
    if(containsComment(declaration)){
        
        declaration = declaration.split('\n');
        for(var i = 0; i < declaration.length; i++){
            
            if(commentTerminated){
                if(declaration[i].indexOf("//") !== -1){
                    declaration[i] = declaration[i].trim();
                    temporarydeclaration += flag(declaration[i]);
                }else{
                    temporarydeclaration += declaration[i].trim();
                }
            }else{
                temporarydeclaration += flag(declaration[i]);

                if(declaration[i].indexOf('*/') !== -1) commentTerminated = true;
            }

        }
        return temporarydeclaration;
    }else{
        return declaration;
    }

};

/*
 * Naive sass parser
 * Converts sass string to JSON object
 * Assumes file has already been checked as valid with sass binary
 */
var Parser = function(string){

    //Array to hold selectors
    this.parents = [{}];

    //Track indeces as we walk the string
    this.lastIndex = 0;
    this.currentIndex = 0;

    //Hold the current character and the full string to parse
    this.currentCharacter = '';
    this.parseString = string || '';
};

Parser.prototype = {
    constructor: Parser,

    //Add a parent selector
    addParent: function() {
        var currentparent = this.parents[this.parents.length-1],
            parent = this.parseString.substring(this.lastIndex, this.currentIndex).trim(),
            endofQuery;

        //Account for #{} declarations
        if(parent[parent.length-1] === '#'){
            endofQuery = this.parseString.substring(this.currentIndex+1).indexOf('{')+1;
            parent = this.parseString.substring(this.lastIndex, this.currentIndex + endofQuery).trim();
            this.currentIndex = this.currentIndex + endofQuery;
        }

        parent = flagComments(parent);
        
        //Add new sub-parent to parent, and add reference in list
        if(!currentparent[parent]) currentparent[parent] = {};
        this.parents.push(currentparent[parent]);
    },

    //Add a style declaration to parent selector
    addStyle: function() {
        var currentparent = this.parents[this.parents.length-1],
            declaration = this.parseString.substring(this.lastIndex, this.currentIndex).trim(),
            property, value, splitindex;

        //If not @ declaration, split based on :
        if(declaration.indexOf("@") === -1){
            declaration = declaration.split(":");

        //Else calculate the index of the @ property
        }else{
            splitindex = declaration.indexOf("@") + declaration.split("@")[1].indexOf(" ") + 1;
            declaration = [declaration.substring(0, splitindex), declaration.substring(splitindex)];
        }

        property = flagComments(declaration.shift().trim());
        value = declaration.join(':').trim();

        //If property does not already exist, add it
        if(!currentparent[property]){
            currentparent[property] = value;

        //If property does exist, add new value to array of values
        }else{

            if(Array.isArray(currentparent[property])){
                currentparent[property].push(value);
            }else{
                currentparent[property] = [currentparent[property], value];
            }
        }
        
    },

    //Walk through parse string character by character
    walkString: function() {

        for(this.currentIndex = 0; this.currentIndex < this.parseString.length; this.currentIndex++){
            
            //Set current character
            this.currentCharacter = this.parseString.charAt(this.currentIndex);

            //Ignore whitespace
            if(this.currentCharacter === " "){
                continue;

            //If character is opening bracket, create new sub-parent
            }else if(this.currentCharacter === "{"){
                this.addParent();
                this.lastIndex = this.currentIndex+1;

            //If character is semicolon, preceding substring is style declaration, add to parent
            }else if(this.currentCharacter === ";"){
                this.addStyle();
                this.lastIndex = this.currentIndex+1;

            //If character is end bracket, remove parent from stack
            }else if(this.currentCharacter === "}"){
                this.parents.pop();
                this.lastIndex = this.currentIndex+1;
            }
        }

        return this.parents.pop();
    }
};

module.exports = function(string) {
    var parser = new Parser(string);
    return parser.walkString();
};
