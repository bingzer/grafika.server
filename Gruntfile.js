module.exports = function (grunt) {
    grunt.option('force', false);

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-typings');
    grunt.loadNpmTasks('grunt-mocha-cli');
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
            default: {
                tsconfig: true
            }
        },
        typings: {
            install: {}
        },
        mochacli: {
            options: {
                timeout: 10000,
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
        }
    });
}