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
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks('grunt-ts');
    //grunt.registerTask("default", ["qunit:all", "clean", "bower:install", "string-replace", "uglify:my_target", "copy:main"]);
    grunt.registerTask("build-dev", [ 
        "ts"
    ]);
    grunt.registerTask("default", ["clean", "string-replace:version", "ts", "uglify:my_target", "qunit:all",  "string-replace:portable"])
    
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
        ts: {
            default: {
                tsconfig: true,
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
					{ 'dist/grafika.min.js': 'dist/grafika.js' },
					{ 'dist/grafika.extensions.min.js': 'dist/grafika.extensions.js' },
					{ 'dist/grafika.android.min.js': 'dist/grafika.android.js' },
					{ 'dist/grafika.demo.min.js': 'dist/grafika.demo.js' },
					{ 'dist/grafika.random-drawing.min.js': 'dist/grafika.random-drawing.js' },

					{ 'dist/grafika.core.min.js' : ['dist/grafika.js', 'dist/grafika.extensions.js' ] },
					{ 'dist/grafika.android.core.min.js' : ['dist/grafika.js', 'dist/grafika.extensions.js', 'dist/grafika.android.js'] },
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
                        flatten: true,
                        src: [
                            'dist/grafika.js',
                            'dist/grafika.extensions.js',
                            'dist/grafika.android.js',
                            'dist/grafika.android.core.min.js',
                            'dist/grafika.portable.html',
                            'package.json'
                        ],
                        dest: '../grafika.android/app/src/main/assets/'
                    }
                ]
            }
        },
        qunit: {
            all: ['test/**/*.html']
        },
		// update version from package.json
		'string-replace': {
			version: {
				files: {
					'src/grafika.ts': 'src/grafika.ts',
				},
				options: {
					replacements: [
					// place files inline example
                    // export const VERSION = "1.0.0"
						{
							pattern: /export const VERSION = [^;]+/g,
							replacement: 'export const VERSION = \'' + grunt.file.readJSON('package.json').version + '\''
						}
					]
				}
			},
			portable: {
				files: {
					'dist/grafika.portable.html': 'src/grafika.portable.html',
				},
				options: {
					replacements: [
					// place files inline example
                    // export const VERSION = "1.0.0"
						{
							pattern: /\/\/@import: grafika.min.js/g,
							replacement: grunt.file.read('dist/grafika.min.js')
						}
					]
				}
			}
		},
        compress: {
            transport: {
                options: {
                    archive: '../transport/grafika.js.zip'
                },
                files: [
                    { 
                        expand: true,
                        src: [
                            '.vscode/**',
                            'dist/**',
                            'src/**',
                            'test/**',
                        ]
                    },
                    {
                        src: [ '*', '.gitignore', '.travis.yml' ],
                        filter: 'isFile'
                    }
                ]
            }
        }
    });

};