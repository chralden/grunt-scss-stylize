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
        splitprop = prop.split('*}');
        property.comment = splitprop[0];
        property.cleanproperty = splitprop[1];
    }else{
        property.cleanproperty = prop;
    }

    return property;
};

module.exports = function(sassObject, comments) {

    function compareProperties(a, b){
        var aVal = (order.indexOf(a.property) !== -1 || a.property.indexOf('$') === 0) ? order.indexOf(a.property) : order.length;
        var bVal = (order.indexOf(b.property) !== -1 || b.property.indexOf('$') === 0) ? order.indexOf(b.property) : order.length;
        return  aVal - bVal;
    };
    
    function traverse(object){

        var ordered = [],
            property,
            proptype,
            style; 

        for (var prop in object) {

            property = clean(prop);

            if (object[prop] !== null && typeof(object[prop])=="object") {
                
                if(prop.indexOf('@media') !== -1){
                    proptype = 'query';
                }else{
                    proptype = 'child';
                }

                style = { 
                    property: proptype,
                    selector: property.cleanproperty,
                    value: traverse(object[prop]),
                    comment: property.comment
                };
                ordered.push(style);
            }else{

                style = { 
                    property: property.cleanproperty,
                    value: object[prop],
                    comment: property.comment
                };
                ordered.push(style);
            }
        }

        return ordered.sort(compareProperties);

    }

    return traverse(sassObject);

};
