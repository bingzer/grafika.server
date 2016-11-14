module.exports = function (grunt) {
    grunt.option('force', false);

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-typings');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.registerTask("default", [
        "clean", 
        "typings", 
        "ts", 
        "mochacli"
    ]);
    grunt.registerTask("build", [ 
        "ts"
    ]);

    ///////////////////////////////////////////////////////////////////////////////////////////

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: [
            "server/*.js",
            "server/*.js.map",
        ],
        ts: {
            options: {
                'compiler': './node_modules/typescript/bin/tsc'
            },
            default: {
                tsconfig: {
                    passThrough : true
                }
            }
        },
        typings: {
            install: {}
        },
        mochacli: {
            options: {
                timeout: 30000,
                env: {
                    server_url: "http://localhost:3000/",
                    server_database_url: "mongodb://localhost/grafika-test",
                    server_superSecret: "123",
                    client_sessionSecret: "abc",
                    server_mailer_service: "postmark",
                    server_mailer_smtp: "smtp.postmarkapp.com",
                    server_mailer_port: "2525",
                    server_mailer_from: "grafika@bingzer.com",
                    content_url: "http://localhost:5000/"
                }
            },
            all: ['server-test/**/*.js']
        },
        compress: {
            transport: {
                options: {
                    archive: '../transport/grafika.server.zip'
                },
                files: [
                    { 
                        expand: true,
                        src: [
                            '.vscode/**',
                            'server/**',
                            'server-test/**',
                            'typings/**',
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
}