/*
 * grunt-sass-stylize
 * https://github.com/chralden/grunt-sass-stylize
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */


'use strict';

/*
 * Naive sass parser
 * Converts sass string to JSON object
 * Assumes file has already been checked as valid with sass binary
 */

function containsComment(declaration) {
    return (declaration.indexOf("//") !== -1 || declaration.indexOf("*/") !== -1);
};

function flag(comment) {
    return '{*'+comment.replace(/\n/g, '|n')+'|n*}';
};

function flagComments(declaration) {
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

module.exports = function(string) {

    var parents = [{}],
        lastEnd = 0,
        ch, i;

    for(i = 0; i < string.length; i++){

        ch = string.charAt(i);
        
        //Ignore whitespace
        if(ch === " "){
            continue;

        //If character is opening bracket, create new sub-parent
        }else if(ch === "{"){
            var currentparent = parents[parents.length-1];
            var parent = flagComments(string.substring(lastEnd, i).trim());
            
            //Add new sub-parent to parent, and add reference in list
            if(!currentparent[parent]) currentparent[parent] = {};
            parents.push(currentparent[parent]); 

            lastEnd = i+1;

        //If character is semicolon, preceding substring is style declaration, add to parent
        }else if(ch === ";"){
            var currentparent = parents[parents.length-1];
            var declaration = string.substring(lastEnd, i).trim();
            var property, value;

            //If not @ declaration, split based on :
            if(declaration.indexOf("@") === -1){
                declaration = declaration.split(":");

            //Else calculate the index of the @ property
            }else{
                var splitindex = declaration.indexOf("@") + declaration.split("@")[1].indexOf(" ") + 1;
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
            
            lastEnd = i+1;

        //If character is end bracket, remove parent from stack
        }else if(ch === "}"){
            parents.pop();
            lastEnd = i+1;
        }

    }

    return parents.pop();
};
