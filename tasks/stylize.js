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

//Keep running count of processed files for async execution
var processCount = 0;
var processLength = 0;
var cb;

var processFiles = function(grunt, filePair, options) {

	var dest = filePair.dest,
		isExpandedPair = filePair.orig.expand || false;

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

	//Check for file, run sass validation, and execute callback if file passes
	var validate = function(src, callback) {
		
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

		//Do not run sass validation on partials
		if (path.basename(src)[0] !== '_') {

			//Use sass process to check that file is valid 
			var cp = spawn('sass', ['-c', '--scss', src], {stdio: 'inherit'});

			//Check for process error
			cp.on('error', function (err) {
				grunt.warn(err);
			});


			cp.on('close', function (code) {
				//If sass check fails, show error
				if (code > 0) {
					return grunt.warn('Sass validation check failed with error code ' + code);
				}

				callback();
			});
		}else{
			callback();
		}
	};

	//Parse the file, reorder, then write to destination
	var stylize = function(file, dest) {
		var parse = require('./lib/parse'),
			restyle = require('./lib/restyle'),
			parsed, styled;

		grunt.log.writeln('Stylizing '+ file);

		parsed = parse(grunt.file.read(file));
		styled = restyle(parsed, options);
		
		grunt.file.write(dest, styled);
		
		//Tick the count of successfully processed files
		processCount++;

		//If all files have been processed, execute task callback
		if(processCount >= processLength) cb();
	};

	//For each source in the filepair, validate and style
	async.eachLimit(filePair.src, numCPUs, function (src) {
		
		var result;

		src = unixifyPath(src);
		dest = unixifyPath(dest);

		if (detectDestType(dest) === 'directory') {
			dest = (isExpandedPair) ? dest : path.join(dest, src);
		}

		validate(src, function(){
			try {
				result = stylize(src, dest);
			} catch(e) {
				grunt.log.warn(e);
			}

		});
				
	});
};

module.exports = function(grunt) {

	grunt.registerMultiTask('stylizeSCSS', 'Compile sass files to conform to RECESS styleguide.', function() {
			
		var options = this.options({
				tabSize: 4,
				extraLine: true,
				oneLine: true,
				padPrefixes: false,
				cleanDecimals: false,
				cleanZeros: false,
				alphabetizeProps: false,
				order: null
			});

		//Create task callback
		cb = this.async();

		//Store total number of files that need to be processed
		processLength = this.files.length;

		//For each src/dest pair validate then stylize
		this.files.forEach(function(filePair){
			processFiles(grunt, filePair, options);
		});
	});
};
