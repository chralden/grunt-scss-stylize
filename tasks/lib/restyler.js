/*
 * grunt-scss-stylize
 * https://github.com/chralden/grunt-scss-stylize
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */

'use strict';

var order = require('../lib/order');
var indent = '';

var isOneLine = function(element) {
    var oneline = false,
        children = element.value;

    if(!formatter.oneLine) return false;

    //Declaration should be one line if single child that has no children of its own and is not comment
    if(children.length === 1 && children[0].property !== 'child' && children[0].property !== 'query' && !children[0].comment){
        oneline = true;
    }

    return oneline;
};

var isBasicProperty = function(string) {
    var isBasic = true,
        sassDeclarations = ['@import', '@include', '@extend', '@function', '@return'];

    sassDeclarations.map(function(declaration){
        if(string === declaration || string.indexOf(declaration) !== -1) isBasic = false;
    });

    return isBasic;
};

var formatter = {
    tabSize: 4,
    extraLine: false,

    //Format comment string
    writeComment: function(element, oneline) {
        var commentLines = element.comment.replace(/\{\*/g, '').split('|n'),
            finalcomment = '';

        for(var i = 0; i < commentLines.length-1; i++){
            finalcomment += indent + commentLines[i];
            if(!element.property && isBasicProperty(commentLines[i])) finalcomment += ':';
            if(element.property && element.selector){ finalcomment += '\n'; }
        }

        return finalcomment;
    },

    //Format end bracket
    closeBracket: function(selector, oneline) {
        var closing = '';
        
        if(selector){
            if(selector.indexOf('//') !== -1){
                if(!oneline) closing += '//';
                closing += '}\n';
            }else if(selector.indexOf('/*') !== -1){
                closing += '}*/\n';
            }else{
                closing += '}\n';
            }  
        }else{
            if(!oneline) closing += '//';
            closing += '}\n';
        }
          
        if(this.extraLine && !oneline) closing += '\n';
        return closing;
    },

    //Format selector string
    formatSelector: function(element, oneline) {
        var selectorString = '',
            startIndent = indent,
            selectorLines;

        if(element.comment) selectorString += this.writeComment(element, oneline);

        //Indentation, property name and open bracket
        selectorLines = element.selector.split('\n');
        for(var i = 0; i < selectorLines.length; i++){
            selectorString += indent + selectorLines[i].trim();
            if(i < selectorLines.length-1) selectorString += '\n';
        }

        selectorString += ' {';

        if(!oneline) selectorString += '\n';
        
        //Increase indentation by tab size if selector present and not multiline comment
        if(element.selector) for(var i = 0; i < this.tabSize; i++){ indent += ' '; }
        
        //Recurse through children
        selectorString += reorder(element.value, oneline);

        //Reduce indentation by tab size
        indent = indent.slice(0, indent.length-this.tabSize);

        //Indentation and closeing bracket
        if(!oneline) selectorString += startIndent;
        selectorString += this.closeBracket(element.selector, oneline);

        return selectorString;
    },

    //Format style property string
    formatProperty: function(element, oneline) {
        var propertyString = '';

        if(element.comment) propertyString += this.writeComment(element, oneline);

        if(!oneline && element.property){
            propertyString += indent;
        }else if(element.property){
            propertyString += ' ';
        }
        propertyString += element.property;

        if(element.property && isBasicProperty(element.property)) propertyString += ':';
        return propertyString;
    },

    //Format value string
    formatValue: function(value, oneline) {
        var values = value.split('\n'),
            valueString = ' ',
            valindent = indent + ' ';

        for(var i = 0; i < values.length; i++){
            if(i !== 0){ valueString += valindent; }

            valueString += values[i];
            
            if(i === values.length-1){ valueString += ';'; }
            
            if(!oneline){
                valueString += '\n';
            }else{
                valueString += ' ';
            }
        }

        return valueString;
    }
};

//Traverse ordered sass object and return formatted string
var reorder = function(object, oneline) {
    var sassString = '';

    object.forEach(function(element) {

        if(element.property === 'child' || element.property === 'query' || element.property === 'fontface'){
            sassString += formatter.formatSelector(element, isOneLine(element));
        }else{

            sassString += formatter.formatProperty(element, oneline);
            sassString += formatter.formatValue(element.value, oneline);
        }
    });

    return sassString;
};

module.exports = function(sassObject, options) {
    
    var ordered = order.sortProps(sassObject);

    
    formatter.tabSize = options.tabSize;
    formatter.extraLine = options.extraLine;
    formatter.oneLine = options.oneline;

    return reorder(ordered);
    
};
