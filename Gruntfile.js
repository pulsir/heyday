/* jshint node: true */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  // Add regex quote option
  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  // Project configuration
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),

    // Paths
    heyday: {
      src: {
        less: 'less/heyday.less',
        js: [
          'js/transition.js',
          'js/alert.js',
          'js/button.js',
          'js/carousel.js',
          'js/collapse.js',
          'js/dropdown.js',
          'js/modal.js',
          'js/tooltip.js',
          'js/popover.js',
          'js/scrollspy.js',
          'js/tab.js',
          'js/affix.js'
        ]
      },
      dist: {
        css: 'dist/css/heyday.css',
        cssMin: 'dist/css/heyday.css.min',
        cssMap: 'dist/css/heyday.css.map',
        cssMapURL: 'heyday.css.map',
        js: 'dist/js/heyday.js',
        jsMin: 'dist/js/heyday.min.js'
      }
    },
    
    banner: '/*!\n' +
              ' * Heyday v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
              ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * Licensed under the <%= pkg.license %> License.\n' +
              ' */\n',
    jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("Heyday requires jQuery") }\n\n',

    // Task configuration
    clean: {
      dist: ['dist']
    },

    less: {
      compile: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= heyday.dist.cssMapURL %>',
          sourceMapFilename: '<%= heyday.dist.cssMap %>'
        },
        files: {
          '<%= heyday.dist.css %>': '<%= heyday.src.less %>'
        }
      },
      minify: {
        options: {
          cleancss: true,
          report: 'min'
        },
        files: {
          '<%= heyday.dist.cssMin %>': '<%= heyday.dist.css %>'
        }
      }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        files: {
          src: [
            '<%= heyday.dist.css %>',
            '<%= heyday.dist.cssMin %>',
          ]
        }
      }
    },

    csscomb: {
      sort: {
        options: {
          sortOrder: '.csscomb.json'
        },
        files: {
          '<%= heyday.dist.css %>': '<%= heyday.dist.css %>'
        }
      }
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      src: '<%= heyday.dist.css %>'
    },

    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>',
        stripBanners: false
      },
      dist: {
        src: '<%= heyday.src.js %>',
        dest: '<%= heyday.dist.js %>'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>\n',
        report: 'min'
      },
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: '<%= heyday.dist.jsMin %>'
      }
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['js/*.js']
      },
      test: {
        src: ['js/tests/unit/*.js']
      }
    },

    jscs: {
      options: {
        config: 'js/.jscs.json',
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      src: {
        src: ['js/*.js']
      },
      test: {
        src: ['js/tests/unit/*.js']
      }
    },

    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: ['js/tests/*.html']
    },

    watch: {
      less: {
        files: 'less/*.less',
        tasks: ['less']
      },
      js: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
    },

    sed: {
      version: {
        pattern: (function () {
          var old = grunt.option('old')
          return old ? RegExp.quote(old) : old
        })(),
        replacement: grunt.option('new'),
        recursive: true
      }
    }
  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  // CSS distribution task
  grunt.registerTask('dist-css', ['less', 'csscomb', 'usebanner']);

  // JS distribution task
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // Full distribution task
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js']);

  // Test task
  grunt.registerTask('test', ['dist-css', 'jshint', 'jscs', 'qunit']);

  // Default task
  grunt.registerTask('default', ['dist', 'test']);

  // Version numbering task.
  //
  //   $ grunt change-version --old=A.B.C --new=X.Y.Z
  //
  // Changes should always be manually reviewed!
  grunt.registerTask('change-version', ['sed']);
};
