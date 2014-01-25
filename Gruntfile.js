/* jshint node: true */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  // Add regexp quote method
  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  // Configuration
  grunt.initConfig({
    // Meta data
    pkg: grunt.file.readJSON('package.json'),

    // Paths
    heyday: {
      less: 'less/heyday.less',
      css: 'dist/css/heyday.css',
      cssMin: 'dist/css/heyday.min.css',
      cssMap: 'dist/css/heyday.css.map',
      js: {
        src: [
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
        ],
        dist: 'dist/js/heyday.js',
        distMin: 'dist/js/heyday.min.js'
      }
    },

    // Banners
    banner: '/*!\n' +
              ' * Heyday v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
              ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * Licensed under <%= pkg.license %>.\n' +
              ' */\n',
    jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Heyday requires jQuery\'); }\n\n',

    // Tasks
    clean: {
      dist: 'dist'
    },

    less: {
      dist: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'heyday.css.map',
          sourceMapFilename: '<%= heyday.cssMap %>'
        },
        files: {
          '<%= heyday.css %>': '<%= heyday.less %>'
        }
      },
      distMin: {
        options: {
          cleancss: true,
          report: 'min'
        },
        files: {
          '<%= heyday.cssMin %>': '<%= heyday.css %>'
        }
      }
    },

    csscomb: {
      dist: {
        options: {
          config: 'less/.csscomb.json'
        },
        files: {
          '<%= heyday.css %>': '<%= heyday.css %>'
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
            '<%= heyday.css %>',
            '<%= heyday.cssMin %>'
          ]
        }
      }
    },

    csslint: {
      options: {
        csslintrc: 'less/.csslintrc',
      },
      dist: {
        src: '<%= heyday.css %>'
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>',
        stripBanners: false
      },
      dist: {
        src: '<%= heyday.js.src %>',
        dest: '<%= heyday.js.dist %>'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>\n',
        report: 'min'
      },
      dist: {
        src: '<%= heyday.js.dist %>',
        dest: '<%= heyday.js.distMin %>'
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
        src: 'js/*.js'
      },
      test: {
        src: 'js/tests/unit/*.js'
      }
    },

    jscs: {
      options: {
        config: 'js/.jscs.json',
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: 'js/*.js'
      },
      test: {
        src: 'js/tests/unit/*.js'
      }
    },

    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: 'js/tests/index.html'
    },

    watch: {
      less: {
        files: 'less/*.less',
        tasks: ['less', 'csscomb', 'usebanner']
      },
      js: {
        files: '<%= heyday.js.src %>',
        tasks: ['concat', 'uglify', 'jshint:src', 'qunit']
      }
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

  // Load plugins
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  // CSS distribution task
  grunt.registerTask('dist-css', ['less', 'csscomb', 'usebanner']);

  // JS distribution task
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // Full distribution task
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js']);

  // Test task
  grunt.registerTask('test', ['csslint', 'jshint', 'jscs', 'qunit']);

  // Default task
  grunt.registerTask('default', ['dist', 'test']);

  // Version updating task
  //
  //   $ grunt change-version --old=A.B.C --new=X.Y.Z
  //
  // Changes should always be manually reviewed!
  grunt.registerTask('change-version', 'sed:version');
};
