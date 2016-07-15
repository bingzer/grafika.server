module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-typings');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.registerTask("default", ["clean", "bower:install", "typings", "ts"]);
    grunt.option('force', true);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["client/assets/js/*"],
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
        }
    });
}