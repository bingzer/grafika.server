/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.registerTask("default", ["qunit:all", "clean", "bower:install", "string-replace", "uglify:my_target", "copy:main"]);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["lib/*", "dist/*"],
        bower: {
            install: {
                options: {
                    targetDir: "lib",
                    layout: "byComponent",
                    cleanTargetDir: true
                }
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                sourceMapName: 'dist/grafika.js.map',
				compress: {
					drop_console: true
				}
            },
            my_target: {
                files: [
					{ 'dist/grafika.min.js': 'src/grafika.js' },
					{ 'dist/grafika.extensions.min.js': 'src/grafika.extensions.js' },
					{ 'dist/grafika.android.min.js': 'src/grafika.android.js' },
					{ 'dist/grafika.demo.min.js': 'src/grafika.demo.js' },
					{ 'dist/grafika.random-drawing.min.js': 'src/grafika.random-drawing.js' },
					{ 'dist/grafika-android.min.js' : ['src/grafika.js', 'src/grafika.extensions.js', 'src/grafika.android.js'] },
					{ 'dist/grafika-core.min.js' : ['src/grafika.js', 'src/grafika.extensions.js' ] }
				]
            }
        },
        copy: {
            main: {
                files: [
                    { 
                        expand: true,
                        cwd: 'src',
                        src: '**',
                        dest: 'dist'
					}
                ],
            },
            android_dev: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['**'],
                        dest: '../grafika.android/engine/src/main/assets/'
                    }
                ]
            }
        },
        qunit: {
            all: ['test/**/*.html']
        },
		// update version from package.json
		'string-replace': {
			inline: {
				files: {
					'src/grafika.js': 'src/grafika.js',
				},
				options: {
					replacements: [
					// place files inline example 
						{
							pattern: /var GRAFIKA_VERSION = [^;]+/g,
							replacement: 'var GRAFIKA_VERSION = \'' + grunt.file.readJSON('package.json').version + '\''
						}
					]
				}
			}
		}
    });

};