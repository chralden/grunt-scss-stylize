/*
 * grunt-sass-stylize
 * https://github.com/chralden/grunt-sass-stylize
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var numCPUs = require('os').cpus().length || 1;
var async = require('async');
var spawn = require('win-spawn');
var which = require('which');

module.exports = function(grunt) {

    var stylizer = require('./lib/stylizer').init(grunt);

    grunt.registerMultiTask('sassStylize', 'Compile sass files to conform to RECESS styleguide.', function() {
        
        var options = this.options({
            tabSize: 4,
            extraLine: false
        });

        var cb = this.async();

        async.eachLimit(this.filesSrc, numCPUs, function (src, next) { 
            var result;

            //If file does not exist show warning
            if (!grunt.file.exists(src)) {
              grunt.log.warn('Source file ' + src + ' not found.');
              return false;
            } 

            //If file is empty show warning
            if (src.length === 0) {
                grunt.log.warn('Source file ' + src + 'is empty, nothing to do.');
                return;
            }

            //Check if sass is installed
            try {
              which.sync('sass');
            } catch (err) {
              return grunt.log.warn('You need to have Ruby and Sass installed and in your PATH for this task to work.');
            }

            //Use sass process to check that file is valid 
            var cp = spawn('sass', ['-c', src], {stdio: 'inherit'});

            //Check for process error
            cp.on('error', function (err) {
              grunt.warn(err);
            });


            cp.on('close', function (code) { 
                //If sass check fails, show error
                if (code > 0) {
                  return grunt.warn('Sass validation check failed with error code ' + code);
                }

                try {
                    result = stylizer.stylize(src, options);
                } catch(e) {
                    grunt.log.warn(e);
                }

                next();
                
            });

        }, cb);

    });
};
