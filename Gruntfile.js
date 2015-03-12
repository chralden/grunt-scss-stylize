/*
 * grunt-contrib-concat
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    
    sassStylize: { 
      target: {
        files: [{
          src: ['tests/*.scss']
        }]
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['sassStylize']);

};
