module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.registerTask("default", ["clean", "bower:install", "ts"]);
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
        }
    });
}