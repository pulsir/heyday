/*!
 * Heyday Gruntfile (http://dev.pulsir.eu/heyday)
 * Copyright 2014 Pulsir team
 * Licensed under The :) Licence.
 */

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
    jqueryCheck: 'if (typeof jQuery === \'undefined\') throw new Error(\'Heyday requires jQuery\');\n\n',

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
        src: '<%= heyday.less %>',
        dest: '<%= heyday.css %>'
      },
      distMin: {
        options: {
          cleancss: true
        },
        src: '<%= heyday.css %>',
        dest: '<%= heyday.cssMin %>'
      }
    },

    csscomb: {
      dist: {
        options: {
          config: 'less/.csscomb.json'
        },
        src: '<%= heyday.css %>',
        dest: '<%= heyday.css %>'
      }
    },

    usebanner: {
      css: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        src: 'dist/css/*.css'
      }
    },

    concat: {
      js: {
        options: {
          banner: '<%= banner %>\n<%= jqueryCheck %>',
          stripBanners: false
        },
        src: '<%= heyday.js.src %>',
        dest: '<%= heyday.js.dist %>'
      }
    },

    uglify: {
      distMin: {
        options: {
          banner: '<%= banner %>\n'
        },
        src: '<%= heyday.js.dist %>',
        dest: '<%= heyday.js.distMin %>'
      }
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      grunt: {
        options: {
          asi: false
        },
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
        config: 'js/.jscsrc',
      },
      grunt: {
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
      versions: {
        pattern: (function () {
          var old = grunt.option('old');
          return old ? RegExp.quote(old) : old;
        })(),
        replacement: grunt.option('new'),
        recursive: true
      }
    }
  });

  // Load plugins
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
  require('time-grunt')(grunt);

  // CSS distribution task
  grunt.registerTask('dist-css', ['less', 'csscomb', 'usebanner']);

  // JS distribution task
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // Full distribution task
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js']);

  // Test task
  grunt.registerTask('test', ['jshint', 'jscs', 'qunit']);

  // Default task
  grunt.registerTask('default', ['dist', 'test']);

  // Version updating task
  //
  //   $ grunt change-versions --old=A.B.C --new=X.Y.Z
  //
  // Changes should always be manually reviewed!
  grunt.registerTask('change-versions', 'sed:versions');
};
