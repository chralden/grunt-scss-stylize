/*
 * grunt-scss-stylize
 * https://github.com/chralden/grunt-scss-stylize
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */


'use strict';

var grunt = require('grunt');

/*Recess Style property ordering*/
var baseProps = [
    
    /* Positioning */
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'z-index',

    /* Box-model */
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

    /* Typography */
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

    /* Cursor */
    'pointer-events',
    'cursor',

    /* Visual */
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

    /* Misc */
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
];

var leadProps = ['fontface','@extend','@include','@import'];
var tailProps = ['query','child'];

var clean = function(prop){
    var property = {
            cleanproperty: '',
            comment: false
        },
        splitprop;
    
    //Check property for comments
    if(prop.indexOf('*}') !== -1){
        property.comment = '';
        splitprop = prop.split('*}');
        for(var i = 0; i < splitprop.length-1; i++) property.comment += splitprop[i];
        property.cleanproperty = splitprop[splitprop.length-1];
    }else{
        property.cleanproperty = prop;
    }

    return property;
};

var addPrefixPadding = function(styles) {
    var vendorPrefixes = [
            '-webkit-',
            '-khtml-',
            '-epub-',
            '-moz-',
            '-ms-',
            '-o-'
        ],
        VENDOR_PREFIX = new RegExp('^(' + vendorPrefixes.join('|').replace(/[-[\]{}()*+?.,\\^$#\s]/g, "\\$&") + ')'),
        prefixRoots = [];

    //Find prefix roots first
    styles.forEach(function(style) {
        var property = style.property;
        if(property.match(VENDOR_PREFIX) && prefixRoots.indexOf(property.replace(VENDOR_PREFIX,'')) === -1){
            prefixRoots.push(property.replace(VENDOR_PREFIX,''));
        }
    });

    //If there are prefix roots, pad out the prefixes
    if(prefixRoots.length > 0){
        styles.map(function(style) {
            var property = style.property,
                prefix = property.match(VENDOR_PREFIX),
                paddedProperty = '';

            if(prefix){
                for(var i = 0; i < vendorPrefixes.indexOf(prefix[0]); i++)  paddedProperty += ' ';
                style.property = paddedProperty+property;
            }else{
                if(prefixRoots.indexOf(property) !== -1) style.property = '        '+property;
            }
        });
    }
    
    return styles;
};

exports.sortProps = function(unorderedObject, options) {

    //Iterate over numeric ID to maintain object order when properties have equal precedence
    var objectID = 0,
        order;

    //If custom property order specified apply that order
    if(options.order){
        if(Array.isArray(options.order)){
            order = leadProps.concat(options.order).concat(tailProps);
        }else{
            grunt.log.warn('User order not applied, order option must be an array.');
        }

    //Alphabetize if set
    }else if(options.alphabetizeProps){
        order = leadProps.concat(baseProps.slice().sort()).concat(tailProps);
    
    //Otherwise apply default ordering
    }else{
        order = leadProps.concat(baseProps).concat(tailProps);
    }

    var compareProperties = function(a, b){
        var aVal = (order.indexOf(a.property) !== -1 || a.property.indexOf('$') === 0) ? order.indexOf(a.property) : order.length,
            bVal = (order.indexOf(b.property) !== -1 || b.property.indexOf('$') === 0) ? order.indexOf(b.property) : order.length,
            
            //If styles alter same root style, maintain order
            sharestyle = ((b.property.indexOf(a.property) !== -1) || (a.property.indexOf(b.property) !== -1));


        if(aVal !== bVal && !sharestyle){
            return  aVal - bVal;
        }else{
            return parseInt(a.id, 10) - parseInt(b.id, 10);
        }
        
    };
    
    var traverse = function traverse(object){

        var ordered = [],
            property,
            proptype,
            style;

        for (var prop in object) {

            property = clean(prop);

            if (object[prop] !== null && typeof(object[prop]) == "object" && !Array.isArray(object[prop])) {
                
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
                    value: (options.padPrefixes) ? addPrefixPadding(traverse(object[prop])) : traverse(object[prop]),
                    comment: property.comment,
                    id: objectID
                };

                ordered.push(style);

            }else if(Array.isArray(object[prop])){

                for(var i = 0; i < object[prop].length; i++){
                    style = {
                        property: property.cleanproperty,
                        selector: 'style',
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

    };

    return traverse(unorderedObject);

};
