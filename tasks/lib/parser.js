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

function flagComments(declaration) {
    var temporarydeclaration = "";

    //Remove leading comments
    if(containsComment(declaration)){
        
        declaration = declaration.split('\n');
        for(var i = 0; i < declaration.length-1; i++){
            if(declaration[i].indexOf("//") !== -1){ declaration[i] = declaration[i].trim(); }
            temporarydeclaration += '{*'+declaration[i].replace(/\n/g, '|n')+'|n*}';
        }
        temporarydeclaration += declaration[declaration.length-1].trim();

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
            currentparent[parent] = {};
            parents.push(currentparent[parent]); 

            lastEnd = i+1;

        //If character is semicolon, preceding substring is style declaration, add to parent
        }else if(ch === ";"){
            var currentparent = parents[parents.length-1];
            var declaration = string.substring(lastEnd, i).trim();
            var property, value;

            declaration = (declaration.indexOf(":") !== -1) ? declaration.split(":") : declaration.split(" ");
            
            property = flagComments(declaration[0].trim());
            value = declaration[1].trim();
            
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
