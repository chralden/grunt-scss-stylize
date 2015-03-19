/*
 * grunt-scss-stylize
 * https://github.com/chralden/grunt-scss-stylize
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var spawn = require('win-spawn');
var which = require('which');
var numCPUs = require('os').cpus().length || 1;
var async = require('async');
var order = require('./lib/order');

module.exports = function(grunt) {

		var stylizer = require('./lib/stylizer').init(grunt);

		var unixifyPath = function(filepath) {
				if (process.platform === 'win32') {
					return filepath.replace(/\\/g, '/');
				} else {
					return filepath;
				}
		};

		var detectDestType = function(dest) {
			 if (grunt.util._.endsWith(dest, '/')) {
				 return 'directory';
			 } else {
				 return 'file';
			 }
		 };

		grunt.registerMultiTask('stylizeSCSS', 'Compile sass files to conform to RECESS styleguide.', function() {
				
				var options = this.options({
								tabSize: 4,
								extraLine: true
						}),
						src;

				if(options.order){
						if(Array.isArray(options.order)){
								order.applyUserOrder(options.order);
						}else{
								grunt.log.warn('User order not applied, order option must be an array.');
						}
				} 

				var cb = this.async();

				//Loop through files and map to destination
				this.files.forEach(function(filePair) {
					
					var dest = filePair.dest;
					var isExpandedPair = filePair.orig.expand || false;

					async.eachLimit(filePair.src, numCPUs, function (src) {
						
						var result;

						src = unixifyPath(src);
						dest = unixifyPath(dest);

						if (detectDestType(dest) === 'directory') {
							dest = (isExpandedPair) ? dest : path.join(dest, src);
						}

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

						//Do not validate partials
						if (path.basename(src)[0] === '_') { 
								try {
										result = stylizer.stylize(src, dest, options);
								} catch(e) {
										grunt.log.warn(e);
								}
						}else{

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
												result = stylizer.stylize(src, dest, options);
										} catch(e) {
												grunt.log.warn(e);
										}
								});
						}

					}, cb);
				});

		});
};
