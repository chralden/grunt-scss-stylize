/*
 * grunt-scss-stylize
 * https://github.com/chralden/grunt-scss-stylize
 *
 * Copyright (c) 2014 Chris Alden, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    
    stylizeSCSS: { 
      target: {
        files: [{
          expand: true,
          src: ['tests/*.scss'], 
          dest: 'build/scss/'
        }]
      }
    },

    // Run JS Linter
    jshint: {
      options: {
        jshintrc: 'jshintrc.json'
      },
      all: ['tasks/**/*.js']
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['stylizeSCSS']);
  grunt.registerTask('lint', ['jshint']);

};
