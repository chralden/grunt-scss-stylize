# grunt-scss-stylize

> Reformat and reorder SCSS files to conform to a basic styleguide.


## Stylizer task
_Run this task with the `grunt stylizeSCSS` command._

This task parses files that use the [SCSS](http://sass-lang.com/documentation/file.SCSS_FOR_SASS_USERS.html) syntax and generates reformatted files with uniform indentation and strictly ordered properties following [RECESS](https://github.com/twitter/recess)-like property precedence.

This task requires you to have [Ruby](http://www.ruby-lang.org/en/downloads/) and [Sass](http://sass-lang.com/download.html) installed in order to validate your SCSS files before reformatting is performed.

### Options


#### tabSize

Type: `Integer`  
Default: `4`

Number of spaces to be used for indentation.

#### extraLine

Type: `Boolean`  
Default: `true`

Add a new line at the end of every multi-line selector.

#### oneLine

Type: `Boolean`  
Default: `true`

Write selectors with only a single property to one line.

#### order

Type: `Array`  
Default: `null`

An array of Strings that represent CSS property precedence. Providing a custom order will overwrite the default [RECESS property order](https://github.com/twitter/recess/blob/master/lib/lint/strict-property-order.js) and any properties not contained in the custom order will maintain their relative position within file. 


### Examples

#### Write stylized files to a directory

If you provide a `dest` directory the stylized files will be written to that directory, leaving your source files untouched.

```javascript
grunt.initConfig({
  
  stylizeSCSS: { 
    target: {
      files: [{
        expand: true,
        src: ['raw/*.scss'], 
        dest: 'frontend/scss/'
      }]
    }
  }

});

grunt.loadNpmTasks('grunt-scss-stylize');

grunt.registerTask('default', ['stylizeSCSS']);
```

#### Overwrite SCSS files with stylized output

If you do not specify a `dest` directory files will be stylized in place, overwriting the source with the reformatted SCSS. 

```javascript
grunt.initConfig({
  
  stylizeSCSS: { 
    target: {
      files: [{
        expand: true,
        src: ['frontend/*.scss']
      }]
    }
  }

});

grunt.loadNpmTasks('grunt-scss-stylize');

grunt.registerTask('default', ['stylizeSCSS']);
```

#### Provide your own property order

By default, properties are reordered following the [RECESS strict property order](https://github.com/twitter/recess/blob/master/lib/lint/strict-property-order.js). To conform to a different style guide you can set your own property precedence by passing an Array of properties to the `order` option. 

N.B. Setting your own order will overwrite the default property order completely, any style properties not specified in your order will be left in the order in which they appeared in the source file.

```javascript
grunt.initConfig({
  
  stylizeSCSS: { 
    target: {
      options: {
        order: ['display', 'position', 'top', ...]
      },

      files: [{
        expand: true,
        src: ['frontend/*.scss']
      }]
    }
  }

});

grunt.loadNpmTasks('grunt-scss-stylize');

grunt.registerTask('default', ['stylizeSCSS']);
```