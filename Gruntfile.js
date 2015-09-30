// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

var libraryFiles = ['js-libs/color.js', 'js-libs/colors.min.js', 'js/maths.js', 'js/helpers.js'];
var avatarFiles = [ 'js/avatar-<%= pkg.version %>.js', 'js/avatar-options.js', 'js/avatar-textures.js', 'js/avatar-lines.js', 'js/avatar-hair.js', 'js/avatar-beard.js'];
var raceFiles = [ 'js/races/ogre.js', 'js/races/navi.js', 'js/races/demon.js'];
var dropbox_root = '/Users/jcrossler/Dropbox/Public/sites/avatar/';


var allFiles = libraryFiles.concat(avatarFiles, raceFiles);

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';\n',
                banner: '/*! <%= pkg.name %> ( and supporting libraries) - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build: {
                src: allFiles,
                dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            quick: {
                src: allFiles,
                dest: 'build/avatar.min.js'
            }

        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>.js - <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap: true
            },
            build: {
                src: 'build/<%= pkg.name %>-<%= pkg.version %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        jasmine: {
            avatar: {
                src: 'build/avatar.min.js',
                options: {
                    specs: 'tests/*.spec.js',
                    helpers: 'tests/helpers/*.js',
                    vendor: [
                        "js-libs/jquery-1.11.3.min.js",
                        "js-libs/bootstrap.min.js",
                        "js-libs/underscore-min.js",
                        "js-libs/underscore.string.min.js",
                        "js-libs/easeljs-NEXT.min.js"
                    ],
                    phantomJSOptions: { //TODO: These aren't getting processed
                        page: {
                            viewportSize: {
                                width: 680,
                                height: 800
                            }
                        }
                    }
                }
            }
        },
        notify: {
            build: {
                options: {
                    title: "Avatar Compiled",
                    message: "Files saved and minified and merged"
                }
            },
            quick: {
                options: {
                    title: "Avatar Quick Compiled",
                    message: "Files merged"
                }
            }

        },
        watch: {
            avatar: {
                files: ['**/*.js'],
                tasks: ['concat:quick']
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    keepalive: true
                }
            }
        },
        copy: {
            dropbox: {
                files: [
                    {expand: true, src: ['build/**'], dest: dropbox_root+ 'build'},
                    {expand: true, src: ['css/**'], dest: dropbox_root+ 'css'},
                    {expand: true, src: ['examples/**'], dest: dropbox_root+ 'examples'},
                    {expand: true, src: ['images/**'], dest: dropbox_root+ 'images'},
                    {expand: true, src: ['js/**'], dest: dropbox_root+ 'js'},
                    {expand: true, src: ['js-libs/**'], dest: dropbox_root+ 'js-libs'},
                    {expand: false, src: ['index.html'], dest: dropbox_root}
                ]
            }
        },
        replace: {
            version: {
                src: ['js/avatar.js'],
                dest: 'js/avatar-<%= pkg.version %>.js',
                replacements: [
                    {
                        from: "version = 'X.X.X',",
                        to: "version = '<%= pkg.version %>',"
                    },
                    {
                        from: "summary = 'X',",
                        to: "summary = '<%= pkg.summary %>',"
                    }
                ]
            },
            index: {
                src: ['index.html'],
                overwrite: true,
                replacements: [
                    {
                        from: new RegExp('<.*?id="summary".*?>(.*?)</.*?>'),
                        to: '<h2 id="summary"><%= pkg.summary %></h2>'
                    },
                    {
                        from: new RegExp('<.*?id="description".*?>(.*?)</.*?>'),
                        to: '<p id="description" class="lead"><%= pkg.description %></p>'
                    }
                ]
            }
        }
    });

    // Load the plugin that provides the tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['replace:index', 'replace:version', 'concat:build', 'uglify:build', 'jasmine', 'notify:build']);
    grunt.registerTask('quick', ['concat:quick', 'notify:quick']);
    grunt.registerTask('server', ['concat:quick', 'notify:quick', 'connect']);
    grunt.registerTask('dropbox', ['copy:dropbox']);

    grunt.task.run('notify_hooks');

};