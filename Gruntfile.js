// Need another plugin? https://www.npmjs.com/ here's an example installation of JSHint
// npm install grunt-contrib-jshint --save-dev

module.exports = function(grunt) {

    // mozjpeg must be required here
    var mozjpeg = require('imagemin-mozjpeg');

    // Configure tasks`
    grunt.initConfig({
        // read package.json for dependencies
        pkg: grunt.file.readJSON('package.json'),

        // concat Bower libraries
        bower_concat: {
            all: {
                dest: 'src/js/_bower.js',    // destination for bower compiled JS
                cssDest: 'src/scss/_bower.scss',    // destination for bower compiled CSS

                // if Bower cannot identify the main file for a package, you need to specify it here
                mainFiles: {
                    bootstrap: [
                        'dist/css/bootstrap.css',
                         'dist/js/bootstrap.js',
                     ],    // for 3.3.6
                },

                exclude: [],    // exclude components
                // EX: exclude: [ 'owlcarousel' ],

                include: [],    // include components not automatically included
                // EX: include: [ 'backbone' ],

                dependencies: {},    // if dependencies aren't managed, you can manually configure them here
                // EX: dependencies: { 'underscore': 'jquery' }

                bowerOptions: {
                    relative: false
                },
            },
        },

        // compile Sass/SCSS to CSS
        sass: {
            dev: {
                options: {
                    outputStyle: 'expanded',    // don't compress
                    sourceMap: true,    // generate sourceMap
                    outFile: 'css/style.css.map'    // sourceMap file
                },
                files: { 'css/style.css' : 'src/scss/style.scss' },    // 'css/production-file' : 'src/scss/source-file'
            },
        },

        // concat and minify JS
        uglify: {
            // use this by registering 'uglify:dev'
            dev: {
                options: {
                    beautify: true,    // make the code pretty
                    mangle: false,    // don't change variables
                    compress: false,    // don't minify the JS
                    preserveComments: 'all'    // keep all comments
                },
                files: [{
                    src: [
                        'src/js/*.js',    // JS libraries and jQuery plugins
                        'src/js/config/*.js'    // your JS
                    ],
                    dest: 'js/script.js'    // dev concatenated scripts
                }]
            },
            build: {
                files: [{
                    src: [
                        'src/js/*.js',
                        'src/js/config/*.js'
                    ],
                    dest: 'js/script.min.js'    // production concatenated scripts
                }]
            },
        },

        // build the site using grunt-includes
        includes: {
            build: {
                cwd: 'src/html/',    // html file directory
                src: ['*.html'],    // source files
                dest: '.',    // publish to root directory
                options: {
                    flatten: true,    // removes source paths from publish directory
                    includePath: 'src/html/include',    // include directory
                },
            },
        },

        // minify CSS
        cssmin: {
            full: {
                files: [{
                    src: 'css/style.css',    // CSS
                    dest: 'css/style.min.css'    // minified CSS
                }]
            },
        },

        // minify images - mozjpeg for jpg
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3,    // adjust the amount of compression for png files from 0 (none) to 7 (very compressed)
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [mozjpeg()]    // use mozjpeg for jpeg compression
                },
                files: [{
                    expand: true,
                    cwd: 'src/img/',    // source image directory
                    src: ['large/*.{png,jpg}'],    // subfolders to search for png and jpeg files
                    dest: 'img/'    // destination - will create directories that match subfolders
                }]
            },
        },

        // copy files
        copy: {
            img: {
                files: [{
                    expand: true,
                    cwd: 'src/img/',    // source directory
                     // subfolders to search for files
                    src: [
                        'pages/*.{png,jpg}',
                        'texture/*.{png,jpg}',
                        'code_logos/*.{png,jpg}'
                    ],
                    dest: 'img/'    // destination - will create directories that match subfolders
                }],
            },
        },

        // Grunt watch
        watch: {
            js: {
                // files to watch for changes
                files: [
                    'src/js/*.js',
                    'src/js/config/*.js'
                ],
                tasks: ['uglify:dev']    // task to run when a change is detected
            },
            css: {
                files: ['src/scss/**/*.scss'],    // files to watch for changes
                tasks: ['sass:dev']    // task to run when a change is detected
            },
        },

    });

    // Load the plugins
    require('load-grunt-tasks')(grunt);
    // grunt.loadNpmTasks('grunt-bower-concat');
    // grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-cssmin');
    // grunt.loadNpmTasks('grunt-contrib-imagemin');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-includes');
    // grunt.loadNpmTasks('grunt-newer');
    // grunt.loadNpmTasks('grunt-sass');
    // grunt.loadNpmTasks('grunt-contrib-clean');

    // Register tasks
    // prepending newer: runs tasks only on new or modified files
    grunt.registerTask('default', [
        'sass:dev',
        'includes:build',
    ]);
    grunt.registerTask('build', [
        'bower_concat:all',
        'sass:dev',
        'uglify:dev',
        'uglify:build',
        'includes:build',
        'cssmin:full',
        'newer:imagemin:dynamic',
        'newer:copy:img'
    ]);
}    // end exports
