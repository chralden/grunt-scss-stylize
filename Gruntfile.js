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
      basic_order: {
        files: [{src: ['tests/input/test.scss'], dest: 'tests/output/basic-order.scss', filter: 'isFile'}]
      },

      custom_order: {
        options: {
          order: ['background','opacity','float','font-size','padding','border-radius','position']
        },
        files: [{src: ['tests/input/test.scss'], dest: 'tests/output/custom-order.scss', filter: 'isFile'}]
      },

      spacing_options: {
        options: {
          tabSize: 2,
          extraLine: false,
          oneLine: false
        },
        files: [{src: ['tests/input/test.scss'], dest: 'tests/output/spacing-options.scss', filter: 'isFile'}]
      },

      numeric_options: {
        options: {
          cleanDecimals: true,
          cleanZeros: true
        },
        files: [{src: ['tests/input/test.scss'], dest: 'tests/output/numeric-options.scss', filter: 'isFile'}]
      },

      alphabetical_order: {
        options: {
          alphabetizeProps: true
        },
        files: [{src: ['tests/input/test.scss'], dest: 'tests/output/alphabetical-order.scss', filter: 'isFile'}]
      }
    },

    // Run JS Linter
    jshint: {
      options: {
        jshintrc: 'jshintrc.json'
      },
      all: ['tasks/**/*.js']
    },

    // Unit tests.
    nodeunit: {
      tests: ['tests/*_test.js'],
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['stylizeSCSS', 'nodeunit']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('default', ['lint','test']);
  

};
