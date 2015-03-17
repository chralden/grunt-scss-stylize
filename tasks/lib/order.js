/*
 * grunt-sass-stylize
 * https://github.com/chralden/grunt-sass-stylize
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */


'use strict';

/*Recess Style property ordering*/
var order = [
    'fontface',
    '/* Positioning */',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'z-index',
    '/* Box-model */',
    'display',
    'float',
    'width',
    'height',
    'max-width',
    'max-height',
    'min-width',
    'min-height',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'margin-collapse',
    'margin-top-collapse',
    'margin-right-collapse',
    'margin-bottom-collapse',
    'margin-left-collapse',
    'overflow',
    'overflow-x',
    'overflow-y',
    'clip',
    'clear',
    '/* Typography */',
    'font',
    'font-family',
    'font-size',
    'font-smoothing',
    'osx-font-smoothing',
    'font-style',
    'font-weight',
    'hyphens',
    'src',
    'line-height',
    'letter-spacing',
    'word-spacing',
    'color',
    'text-align',
    'text-decoration',
    'text-indent',
    'text-overflow',
    'text-rendering',
    'text-size-adjust',
    'text-shadow',
    'text-transform',
    'word-break',
    'word-wrap',
    'white-space',
    'vertical-align',
    'list-style',
    'list-style-type',
    'list-style-position',
    'list-style-image',
    '/* Cursor */',
    'pointer-events',
    'cursor',
    '/* Visual */',
    'background',
    'background-attachment',
    'background-color',
    'background-image',
    'background-position',
    'background-repeat',
    'background-size',
    'border',
    'border-collapse',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'border-color',
    'border-image',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'border-spacing',
    'border-style',
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
    'border-width',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
    'border-top-left-radius',
    'border-radius-topright',
    'border-radius-bottomright',
    'border-radius-bottomleft',
    'border-radius-topleft',
    '/* Misc */',
    'content',
    'quotes',
    'outline',
    'outline-offset',
    'opacity',
    'filter',
    'visibility',
    'size',
    'zoom',
    'transform',
    'box-align',
    'box-flex',
    'box-orient',
    'box-pack',
    'box-shadow',
    'box-sizing',
    'table-layout',
    'animation',
    'animation-delay',
    'animation-duration',
    'animation-iteration-count',
    'animation-name',
    'animation-play-state',
    'animation-timing-function',
    'animation-fill-mode',
    'transition',
    'transition-delay',
    'transition-duration',
    'transition-property',
    'transition-timing-function',
    'background-clip',
    'backface-visibility',
    'resize',
    'appearance',
    'user-select',
    'interpolation-mode',
    'direction',
    'marks',
    'page',
    'set-link-source',
    'unicode-bidi',
    'speak',
    '@extend',
    '@include',
    '@import',
    'query',
    'child'
    ],

    typeIndeces = {
        positioning: 0,
        boxmodel: 7,
        typography: 36,
        cursor: 66,
        visual: 69,
        misc: 109
    };

function clean(prop){
    var property = {
            cleanproperty: '',
            comment: false
        },
        splitprop;
    
    //Check property for comments
    if(prop.indexOf('*}') !== -1){
        property.comment = '';
        splitprop = prop.split('*}');
        for(var i = 0; i < splitprop.length-1; i++){ property.comment += splitprop[i]; }
        property.cleanproperty = splitprop[splitprop.length-1];
    }else{
        property.cleanproperty = prop;
    }

    return property;
};

module.exports = function(sassObject, comments) {
    
    //Iterate over numeric ID to maintain object order when properties have equal precedence
    var objectID = 0;

    function compareProperties(a, b){
        var aVal = (order.indexOf(a.property) !== -1 || a.property.indexOf('$') === 0) ? order.indexOf(a.property) : order.length;
        var bVal = (order.indexOf(b.property) !== -1 || b.property.indexOf('$') === 0) ? order.indexOf(b.property) : order.length;

        if(aVal !== bVal){
            return  aVal - bVal;
        }else{
            return parseInt(a.id) - parseInt(b.id);
        }
        
    };
    
    function traverse(object){

        var ordered = [],
            property,
            proptype,
            style; 

        for (var prop in object) {

            property = clean(prop);

            if (object[prop] !== null && typeof(object[prop])=="object" && !Array.isArray(object[prop])) {
                
                if(prop.indexOf('@media') !== -1){
                    proptype = 'query';
                }else if(prop.indexOf('@font-face') !== -1){
                    proptype = 'fontface';
                }else{
                    proptype = 'child';
                }

                style = { 
                    property: proptype,
                    selector: property.cleanproperty,
                    value: traverse(object[prop]),
                    comment: property.comment,
                    id: objectID
                };
                ordered.push(style);
            }else if(Array.isArray(object[prop])){

                for(var i = 0; i < object[prop].length; i++){
                    style = { 
                        property: property.cleanproperty,
                        value: object[prop][i],
                        comment: property.comment,
                        id: objectID
                    };
                    ordered.push(style);
                }

            }else{

                style = { 
                    property: property.cleanproperty,
                    selector: 'style',
                    value: object[prop],
                    comment: property.comment,
                    id: objectID
                };
                ordered.push(style);
            }

            objectID++;
        }

        return ordered.sort(compareProperties);

    }

    return traverse(sassObject);

};
