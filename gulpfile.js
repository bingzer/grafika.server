/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. https://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var less = require('gulp-less');
var typings = require('gulp-typings');
var mainBowerFiles = require('main-bower-files');
var ts = require('gulp-typescript');
var del = require('del');

gulp.task('default', ['install', 'scripts', 'styles']);

gulp.task('watch', ['scripts', 'styles'], function () {
    gulp.watch('Grafika.WebSite/wwwroot/js/**/*.ts', ['scripts']);
    gulp.watch('Grafika.WebSite/wwwroot/css/**/*.less', ['styles']);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function (callback) {
    del.sync([
        "Grafika.WebSite/wwwroot/js/**/*.js",
        "Grafika.WebSite/wwwroot/js/**/*.js.map",
        "Grafika.WebSite/wwwroot/css/**/*.css",
        "Grafika.WebSite/wwwroot/fonts",
        "Grafika.WebSite/wwwroot/less",
        "Grafika.WebSite/wwwroot/scss",
    ]);
    callback();
});

gulp.task('typings', function () {
    return gulp.src('./typings.json').pipe(typings());
});

gulp.task('bower', function (callback) {
    console.log('Installing bower components');
    gulp.src(mainBowerFiles()).pipe(gulp.dest('./Grafika.WebSite/wwwroot/js')).on('end', function () {
        gulp.src('./Grafika.WebSite/wwwroot/js/**/*.css').pipe(gulp.dest('./Grafika.WebSite/wwwroot/css')).on('end', function () {
            console.log('deleting junks');
            del.sync([
                './Grafika.WebSite/wwwroot/js/**/*.css',
                './Grafika.WebSite/wwwroot/js/**/*.less',
                './Grafika.WebSite/wwwroot/js/**/*.scss',
            ]);

            callback();
        });
    });
});

gulp.task('less', function () {
    return gulp.src([
            'bower_components/bootstrap/less/bootstrap.less',
            'bower_components/font-awesome/less/font-awesome.less',
            'Grafika.WebSite/wwwroot/css/**/*.less'
        ])
        .pipe(less({
            paths: [
                'bower_components/bootstrap/less',
                'bower_components/font-awesome/less',
                'Grafika.WebSite/wwwroot/css'
            ]
        }))
        .pipe(gulp.dest('./Grafika.WebSite/wwwroot/css'))

});

gulp.task('ts', function () {
    var tsProject = ts.createProject('./tsconfig.json');
    tsProject.src().pipe(tsProject({
            'compiler': './node_modules/typescript/bin/tsc'
        }))
        .js.pipe(gulp.dest('./Grafika.WebSite/wwwroot/js'))
});

gulp.task('copy-js', function () {
    return gulp.src([
        'bower_components/grafika-js/dist/grafika.js',
        'bower_components/grafika-js/dist/grafika.random-drawing.js',
        'bower_components/grafika-js/dist/grafika.demo.js'
    ])
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/js'));
});

gulp.task('copy-fonts', function () {
    return gulp.src('bower_components/font-awesome/fonts/*').pipe(gulp.dest('Grafika.WebSite/wwwroot/fonts'));
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('install', ['clean', 'bower', 'typings', 'styles', 'scripts'], function (callback) {
    console.log('Running install');
    callback();
});
gulp.task('styles', ['less', 'copy-fonts'], function (callback) {
    console.log('Running task styles');
    callback();
});
gulp.task('scripts', ['ts', 'copy-js'], function (callback) {
    console.log('Running task scripts');
    callback();
});