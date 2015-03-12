/*
 * 
 * 
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var fs = require('fs');
var parser = require('../lib/parser');
var compiler = require('../lib/compiler');

exports.init = function(grunt) {

    var exports = {};

    exports.stylize = function(file, options) {
        var output = '',
            styled;

        options = options || {};

        grunt.log.writeln('Stylizing '+ file);

        console.log(parser(grunt.file.read(file)));
        //styled = writer(parser(grunt.file.read(file)));
    
        //grunt.file.write('./tmp/test.scss', styled);
    };

    return exports;

};
