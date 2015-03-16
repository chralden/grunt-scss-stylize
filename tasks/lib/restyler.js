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
    var commentLines = comment.replace(/\{\*/g, '').split("|n"),
        finalcomment = "";

    for(var i = 0; i < commentLines.length-1; i++){
        finalcomment += indent + commentLines[i] + "\n";
    }

    return finalcomment;
};

function formatValue(value) {
    var values = value.split('\n'),
        valueString = " ",
        valindent = indent + " ";

    for(var i = 0; i < values.length; i++){
        if(i !== 0){ valueString += valindent; }
        valueString += values[i];
        if(i === values.length-1){ valueString += ';'; }
        valueString += '\n';
    }

    return valueString;
};

module.exports = function(sassObject, options) {
    
    var tabSize = options.tabSize;
    var extraLine = options.extraLine;

    function reorder(object) {
        var sassString = "";

        object.forEach(function(element){
            if(element.property === "child" || element.property === "query" || element.property === "fontface"){

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
                
                sassString += formatValue(element.value);
                
            }
        });

        return sassString;
    }

    //console.log(order(sassObject, true));

    return reorder(order(sassObject, true));
    
};
