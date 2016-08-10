module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-typings');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.registerTask("default", ["clean", "string-replace:clientVersion", "bower:install", "typings", "ts"]);
    grunt.option('force', true);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: [
            "client/*.js",
            "client/*.js.map",
            "server/*.js",
            "server/*.js.map",
            "client/assets/js/*"
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
						}
					]
				}
			},
            serverVersion: {

            }
		},
        uglify: {
            vendor_js: {
                options: {
                    mangle: false,
                    sourceMap: true,
                    sourceMapName: 'client/assets/js/vendor.js.map'
                },
                files: {
                    'client/assets/js/vendor.js': [
                        'client/assets/js/spectrum/spectrum.js',
                        'client/assets/js/angular-spectrum-colorpicker/angular-spectrum-colorpicker.min.js',
                        'client/assets/js/angularUtils-disqus/dirDisqus.js',
                    ]
                }
            },
            app_js: {
                options: {
                    mangle: false,
                    sourceMap: true,
                    sourceMapName: 'client/assets/js/grafika.app.js.map'
                },
                files: {
                    'client/assets/js/grafika.app.js': [
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
                        'client/app/directives/active-link.js',
                        'client/app/directives/image-uploader.js',
                        'client/app/directives/no-result.js',
                        'client/app/directives/fetch-more.js',
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