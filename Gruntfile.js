module.exports = function (grunt) {
    grunt.option('force', true);
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-typings');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.registerTask("default", [
        "clean", 
        "string-replace", 
        "bower:install", 
        "typings", 
        "ts", 
        "cssmin",
        "uglify"
    ]);
    grunt.registerTask("build", [
        "ts",
        "cssmin",
        "uglify"
    ]);

    ///////////////////////////////////////////////////////////////////////////////////////////

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: [
            "client/*.js",
            "client/*.js.map",
            "server/*.js",
            "server/*.js.map",
            "client/assets/js/*",
            "client/assets/*.*"
        ],
        bower: {
            install: {
                options: {
                    targetDir: "client/assets/js",
                    layout: "byComponent",
                    cleanTargetDir: true
                }
            }
        },
        ts: {
            default: {
                tsconfig: true
            }
        },
        typings: {
            install: {}
        },
        mochacli: {
            options: {
                env: {
                    server_url: "http://localhost/test",
                    server_database_url: "mongodb://localhost/grafika-test",
                    server_superSecret: "ABCD",
                    server_mailer_service: "postman",
                    client_sessionSecret: "123"
                }
            },
            all: ['server-test/**/*.js']
        },        
		// update version from package.json
        // appVersion: string = '0.9.0'
		'string-replace': {
			clientVersion: {
				files: { 'client/app/app-config.ts': 'client/app/app-config.ts' },
				options: {
					replacements: [
						{
							pattern: /appVersion: string = [^;]+/g,
							replacement: 'appVersion: string = \'' + grunt.file.readJSON('package.json').version + '\''
						},
                        {
							pattern: /appBuildTimestamp: string = [^;]+/g,
							replacement: 'appBuildTimestamp: string = \'' + new Date().toString() + '\''
                        }
					]
				}
			}
		},
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'client/assets/grafika.app.css': [
                        'node_modules/angular-material/angular-material.css', 
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'client/assets/js/spectrum/spectrum.css',
                        'client/assets/css/site.css'
                    ]
                }
            }
        },
        uglify: {
            lib_js: {
                options: {
                    mangle: true,
                    sourceMap: true,
                    sourceMapName: 'client/assets/grafika.lib.js.map'
                },
                files: {
                    'client/assets/grafika.lib.js': [
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/bootstrap/dist/js/bootstrap.js',
                        'node_modules/angular/angular.js',
                        'node_modules/angular-animate/angular-animate.js',
                        'node_modules/angular-aria/angular-aria.js',
                        'node_modules/angular-messages/angular-messages.js',
                        'node_modules/angular-touch/angular-touch.js',
                        'node_modules/angular-cookies/angular-cookies.js',
                        'node_modules/angular-sanitize/angular-sanitize.js',
                        'node_modules/angular-material/angular-material.js',        
                        'node_modules/angular-ui-router/release/angular-ui-router.js',      
                        'node_modules/angular-jwt/dist/angular-jwt.js',
                        'client/assets/js/spectrum/spectrum.js',
                        'bower_components/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.js',
                        'client/assets/js/angularUtils-disqus/dirDisqus.js',
                    ]
                }
            },
            grafika_js: {
                options: {
                    mangle: true,
                    sourceMap: true,
                    sourceMapName: 'client/assets/grafika.js.map',
                    compress: {
                        drop_console: true
                    }
                },
                files: {
                    'client/assets/grafika.js': [
                        'client/assets/js/grafika.js/src/grafika.js',
                        'client/assets/js/grafika.js/src/grafika.extensions.js',
                        'client/assets/js/grafika.js/src/grafika.demo.js',
                        'client/assets/js/grafika.js/src/grafika.random-drawing.js',
                    ]
                }
            },
            app_js: {
                options: {
                    mangle: false,
                    sourceMap: true,
                    sourceMapName: 'client/assets/grafika.app.js.map'
                },
                files: {
                    'client/assets/grafika.app.js': [
                        'client/app/app-routes.js',
                        'client/app/app-themes.js',
                        'client/app/app-config.js',
                        'client/app/app-common.js',
                        'client/app/app-http.js',
                        'client/app/app-base.js',
                        'client/app/app-controller.js',
                        'client/app/models/user.js',
                        'client/app/models/paging.js',
                        'client/app/models/disqus-config.js',
                        'client/app/models/feedback.js',
                        'client/app/models/animation.js',
                        'client/app/directives/active-link.js',
                        'client/app/directives/image-uploader.js',
                        'client/app/directives/no-result.js',
                        'client/app/directives/fetch-more.js',
                        'client/app/directives/rating-stars.js',
                        'client/app/directives/include-markdown.js',
                        'client/app/directives/gf-spinner.js',
                        'client/app/services/ux-service.js',
                        'client/app/services/api-service.js',
                        'client/app/services/auth-service.js',
                        'client/app/services/animation-service.js',
                        'client/app/services/frame-service.js',
                        'client/app/services/resource-service.js',
                        'client/app/services/user-service.js',
                        'client/app/filters/keyboard-service.js',
                        'client/app/layout/main.js',
                        'client/app/account/login.js',
                        'client/app/account/register.js',
                        'client/app/account/forget.js',
                        'client/app/account/reset.js',
                        'client/app/account/profile.js',
                        'client/app/account/settings.js',
                        'client/app/account/password.js',
                        'client/app/animation/base.js',
                        'client/app/animation/list.js',
                        'client/app/animation/detail.js',
                        'client/app/animation/edit.js',
                        'client/app/animation/drawing.js',
                        'client/app/animation/create.js',
                        'client/app/animation/mine.js',
                        'client/app/animation/playback.js',
                        'client/app/users/user.js',
                        'client/app/content/content.js',
                        'client/app/app.js',
                    ]
                }
            }
        }
    });
}