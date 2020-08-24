module.exports = function (grunt) {
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,
        /**
         * Delete files and directories.
         */
        clean: {
            build: ['.tmp', 'dist', 'min'],
            release: ['.tmp']
        },

        /**
         * Copy files and directories.
         */
        copy: {
            html: {
                files: [{
                    expand: true,
                    cwd: 'src/sample',
                    src: ['*.html'],
                    dest: 'dist'
                }]
            },
            images: {
                files: [{
                    expand: true,
                    cwd: 'src/sample/images',
                    src: ['*.png'],
                    dest: 'dist/images'
                }]
            },
            thumbnails: {
                files: [{
                    expand: true,
                    cwd: 'src/sample/thumbnails',
                    src: ['*.jpg'],
                    dest: 'dist/thumbnails'
                }]
            },
            scripts: {
                files: [{
                    expand: true,
                    cwd: 'src/sample/scripts',
                    src: ['*.js'],
                    dest: 'dist/scripts'
                }]
            },
            mins: {
                files: [{
                    expand: true,
                    cwd: 'dist/scripts',
                    src: ['MagnifyImageJS.min.js'],
                    dest: 'min'
                }]
            }
        },

        /**
         * Combines and compresses CSS and JavaScript, and updates the HTML reference path.
         */
        // useminPrepare: {
        //     html: 'src/html/*.html',
        //     options: {
        //         dest: 'dist'
        //      }
        // },
        // usemin: {
        //     html: 'dist/*.html',
        //     options: {
        //         dest: 'dist'
        //      }
        // },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/sample/stylesheets',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/stylesheets',
                    ext: '.min.css'
                }]
            }
        },

        uglify: {
            options: {
                output: {
                    comments: 'some'
                }
            },
            dist: {
                files: {
                    // Output file: Original file
                    'dist/scripts/MagnifyImageJS.min.js': '.tmp/MagnifyImageJS.js'
                }
            }
        },

        concat: {
            files: {
                // Original file
                src: 'src/*.js',
                // Output file
                dest: '.tmp/MagnifyImageJS.js'
            }
        },

        /**
         * Settings to monitor changes to the folder.
         * While running "$ grunt watch", perform the specified task every time there is a change.
         * @type {Object}
         */
        watch: {
            scripts: {
                files: ['src/*.js', 'src/sample/*.html', 'src/sample/stylesheets/*.css'],
                tasks: ['build']
            }
        }
    });

    Object.keys(pkg.devDependencies).forEach(function (devDependency) {
        if (devDependency.match(/^grunt\-/)) {
            grunt.loadNpmTasks(devDependency);
        }
    });

    grunt.registerTask('build', ['clean:build', 'concat', 'uglify', 'cssmin', 'copy', 'clean:release']);
    grunt.registerTask('default', ['watch']);
};
