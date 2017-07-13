module.exports = function (grunt) {
    grunt.option('force', false);

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-typings");
    grunt.loadNpmTasks("grunt-bower");

    grunt.registerTask("default", [
        "clean",
        "bower",
        "less",
        "ts",
        "copy:fa",
        "copy:creative",
        "copy:grafika",
    ]);

    ///////////////////////////////////////////////////////////////////////////////////////////

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            options: {
                'compiler': './node_modules/typescript/bin/tsc'
            },
            default: {
                tsconfig: {
                    src: ['Templates/GrafikaApp/**/*.ts'],
                    passThrough: true
                }
            }
        },
        typings: {
            install: {}
        },      
        copy: {
            grafika: {
                files: [
                    { src: 'bower_components/grafika-js/dist/grafika.js', dest: 'wwwroot/js/grafika.js' },
                    { src: 'bower_components/grafika-js/dist/grafika.random-drawing.js', dest: 'wwwroot/js/grafika.random-drawing.js' },
                    { src: 'bower_components/grafika-js/dist/grafika.demo.js', dest: 'wwwroot/js/grafika.demo.js' },
                    { src: 'Templates/defaults/js/**.js*', dest: 'wwwroot/js', flatten: true, expand: true }
                ]
            },
            creative: {
                files: [
                    { src: 'Templates/creative/js/creative.js', dest: 'wwwroot/js/creative.js' }
                ]
            },
            fa: {
                files: [
                    { src: ['bower_components/font-awesome/fonts/*'], dest: 'wwwroot/fonts/', flatten: true, expand: true }
                ]
            }
        },
        bower: {
            dev: {
                options: {
                    keepExpandedHierarchy: false
                },
                dest: 'wwwroot',
                js_dest: 'wwwroot/js/',
                css_dest: 'wwwroot/css/',
                less_dest: 'wwwroot/less',
                img_dest: 'wwwroot/img/',
                scss_dest: 'wwwroot/scss'
            }
        },
        less: {
            bootstrap: {
                options: {
                    paths: [ 'bower_components/bootstrap/less', ]
                },
                files: { 'wwwroot/css/bootstrap.css': 'wwwroot/less/bootstrap.less' }
            },
            fa: {
                options: {
                    paths: [ 'bower_components/font-awesome/less' ]
                },
                files: {
                    'wwwroot/css/font-awesome.css': 'wwwroot/less/font-awesome.less'
                }
            },
            creative: {
                options: {
                    paths: ['Templates/creative/less']
                },
                files: {
                    'wwwroot/css/creative.css': 'Templates/creative/less/creative.less'
                }
            }
        },
        clean: [
            "wwwroot/js",
            "wwwroot/css",
            "wwwroot/fonts",
            "wwwroot/less",
            "wwwroot/scss"
        ]
    });
}