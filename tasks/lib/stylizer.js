/*
 * grunt-scss-stylize
 * https://github.com/chralden/grunt-scss-stylize
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var fs = require('fs');
var parser = require('../lib/parser');
var restyler = require('../lib/restyler');

exports.init = function(grunt) {

    var exports = {};

    exports.stylize = function(file, dest, options) {
        var output = '',
            dest, parsed, styled;

        options = options || {};

        grunt.log.writeln('Stylizing '+ file);

        parsed = parser(grunt.file.read(file));
        styled = restyler(parsed, options);
        
        grunt.file.write(dest, styled);

    };

    return exports;

};
