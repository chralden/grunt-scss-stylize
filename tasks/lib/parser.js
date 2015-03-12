/*
 * 
 * 
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(string) {

    var string = string.replace(/\n/g, ""),
        parents = [{}],
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
            var parent = string.substring(lastEnd, i).trim();
            
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
            property = declaration[0].trim();
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
