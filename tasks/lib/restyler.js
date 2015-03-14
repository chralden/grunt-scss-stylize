/*
 * grunt-sass-stylize
 * https://github.com/chralden/grunt-sass-stylize
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */

'use strict';

var order = require('../lib/order');
var indent = "";

function writeComment(comment) {
    var commentLines = comment.replace('{*', '').split("|n"),
        finalcomment = "";

    for(var i = 0; i < commentLines.length-1; i++){
        finalcomment += indent + commentLines[i] + "\n";
    }

    return finalcomment;
};

module.exports = function(sassObject, options) {
    
    var tabSize = options.tabSize;
    var extraLine = options.extraLine;

    function reorder(object) {
        var sassString = "";

        object.forEach(function(element){
            if(element.property === "child" || element.property === "query"){

                if(element.comment) sassString += writeComment(element.comment);

                //Indentation, property name and open bracket
                sassString += indent + element.selector + " {\n";
                
                //Increase indentation by tab size
                for(var i = 0; i < tabSize; i++){ indent += " "; }
                
                //Recurse through children
                sassString += reorder(element.value);

                //Reduce indentation by tab size
                indent = indent.slice(0, indent.length-tabSize);

                //Indentation and closeing bracket
                sassString += indent + "}\n";
                if(extraLine) sassString += "\n";

                
            }else{

                if(element.comment) sassString += writeComment(element.comment);

                sassString += indent + element.property;

                if(element.property !== "@import" && element.property !== "@include" && element.property !== "@extend") sassString += ":";
                
                sassString += " " + element.value + ";\n";
            }
        });

        return sassString;
    }

    console.log(reorder(order(sassObject, true)));

    return reorder(order(sassObject, true));
    
};
