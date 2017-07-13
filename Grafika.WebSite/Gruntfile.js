module.exports = function (grunt) {
    grunt.option('force', false);

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-bower");

    grunt.registerTask("default", [
        "clean",
        "bower",
        "less",
        "copy:fa",
        "copy:creative",
        "copy:grafika",
    ]);

    ///////////////////////////////////////////////////////////////////////////////////////////

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            grafika: {
                files: [
                    { src: 'bower_components/grafika-js/dist/grafika.js', dest: 'wwwroot/js/grafika.js' },
                    { src: 'bower_components/grafika-js/dist/grafika.random-drawing.js', dest: 'wwwroot/js/grafika.random-drawing.js' },
                    { src: 'bower_components/grafika-js/dist/grafika.demo.js', dest: 'wwwroot/js/grafika.demo.js' }
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