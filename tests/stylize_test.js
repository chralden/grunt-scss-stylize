'use strict';

var grunt = require('grunt');

function getNormalizedFile(filepath) {
  return grunt.util.normalizelf(grunt.file.read(filepath));
}

exports.stylize = {
  basic_order: function(test) {
    test.expect(1);

    var actual = getNormalizedFile('tests/output/basic-order.scss');
    var expected = getNormalizedFile('tests/expected/basic-order.scss');
    test.equal(actual, expected, 'Correct property order not reflected based on default ordering.');

    test.done();
  },

  custom_order: function(test) {
    test.expect(1);

    var actual = getNormalizedFile('tests/output/custom-order.scss');
    var expected = getNormalizedFile('tests/expected/custom-order.scss');
    test.equal(actual, expected, 'Correct property order not reflected based on custom ordering array.');

    test.done();
  },

  spacing_options: function(test) {
    test.expect(1);

    var actual = getNormalizedFile('tests/output/spacing-options.scss');
    var expected = getNormalizedFile('tests/expected/spacing-options.scss');
    test.equal(actual, expected, 'Custom spacing options not reflected.');

    test.done();
  },

  numeric_options: function(test) {
    test.expect(1);

    var actual = getNormalizedFile('tests/output/numeric-options.scss');
    var expected = getNormalizedFile('tests/expected/numeric-options.scss');
    test.equal(actual, expected, 'Custom spacing options not reflected.');

    test.done();
  },

  alphabetical_order: function(test) {
    test.expect(1);

    var actual = getNormalizedFile('tests/output/alphabetical-order.scss');
    var expected = getNormalizedFile('tests/expected/alphabetical-order.scss');
    test.equal(actual, expected, 'Alphabetical property order not reflected.');

    test.done();
  }
};
