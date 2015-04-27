# grunt-scss-stylize

> Reformat and reorder SCSS files to conform to a basic styleguide.

## Getting Started
This plugin requires Grunt `>=0.4.0`

Install this plugin with this command:

```shell
npm install grunt-scss-stylize --save-dev
```

Once the plugin has been installed, it can be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-scss-stylize');
```

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

#### padPrefixes

Type: `Boolean`  
Default: `false`

Add leading space to vendor prefix properties.

#### cleanDecimals

Type: `Boolean`  
Default: `false`

Clean decimal values to add leading zeros to values less than one and remove trailing zeros.

#### cleanZeros

Type: `Boolean`  
Default: `false`

Remove units from values equal to zero.

#### alphabetizeProps

Type: `Boolean`  
Default: `false`

Override default property precedence with properties ordered alphabetically. This is the only built in ordering alternative, since alphabetical order is a common alternative to RECESS style property grouping.

#### order

Type: `Array`  
Default: `null`

An array of Strings that represent CSS property precedence. Providing a custom order will overwrite the [default order](#default-order) and any properties not contained in the custom order will maintain their relative position within file. 


### Examples

#### The basics

Pre-stylized SCSS:

```css
.parent {
height: 400px;
position: relative;
font-size: 24px;
  .child {
      margin-right: 20px;
      float: left;
  }
  a {
    color: #FF0000;
  }
}

```

Stylized with default options

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

Produces stylized output:

```css
.parent {
    position: relative;
    height: 400px;
    font-size: 24px;
    .child {
        float: left;
        margin-right: 20px;
    }

    a { color: #FF0000; }
}

```


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

#### Default order <a name="default-order"></a>

The default order wraps sass specific properties around the [RECESS property order](https://github.com/twitter/recess/blob/master/lib/lint/strict-property-order.js), followed by media queries and nested declarations:

```javascript
  var order = [
      'fontface',

      '@extend',
      '@include',
      '@import',

      /* Positioning */
      ...

      /* Box-model */
      ...

      /* Typography */
      ...

      /* Cursor */
      ...

      /* Visual */
      ...

      /* Misc */
      ...

      'query',
      'child'
  ];

```