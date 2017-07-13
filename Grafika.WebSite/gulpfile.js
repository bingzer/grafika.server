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

gulp.task('default', [
    'clean',
    'bower',
    'less-site',
    'typings',
    'ts',
    'copy-grafika',
    'copy-creative',
    'copy-fa'
]);

gulp.task('bower', ['bower-js', 'bower-css', 'bower-less', 'bower-scss']);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function () {
    return del([
        "wwwroot/js",
        "wwwroot/css",
        "wwwroot/fonts",
        "wwwroot/less",
        "wwwroot/scss"
    ]);
});

gulp.task('bower-js', function () {
    return gulp.src(mainBowerFiles({ filter: '**/*.js' })).pipe(gulp.dest('wwwroot/js'));
});

gulp.task('bower-css', function () {
    return gulp.src(mainBowerFiles({ filter: '**/*.css' })).pipe(gulp.dest('wwwroot/css'));
});

gulp.task('bower-less', function () {
    return gulp.src(mainBowerFiles({ filter: '**/*.less' })).pipe(gulp.dest('wwwroot/less'));
});

gulp.task('bower-scss', function () {
    return gulp.src(mainBowerFiles({ filter: '**/*.scss' })).pipe(gulp.dest('wwwroot/scss'));
});

gulp.task('less-site', function () {
    return gulp.src([
        'bower_components/bootstrap/less/bootstrap.less',
        'bower_components/font-awesome/less/font-awesome.less',
        'Templates/creative/less/creative.less'
    ])
        .pipe(less({
            paths: [
                'bower_components/bootstrap/less',
                'bower_components/font-awesome/less',
                'Templates/creative/less'
            ]
        }))
        .pipe(gulp.dest('./wwwroot/css'))

});

gulp.task('ts', function () {
    var tsProject = ts.createProject('./tsconfig.json');
    tsProject.src()
        .pipe(tsProject({
            'compiler': './node_modules/typescript/bin/tsc'
        }))
        .js.pipe(gulp.dest('./wwwroot/js'))
});

gulp.task('typings', function () {
    return gulp.src('./typings.json').pipe(typings());
});

gulp.task('copy-grafika', function () {
    return gulp.src([
        'bower_components/grafika-js/dist/grafika.js',
        'bower_components/grafika-js/dist/grafika.random-drawing.js',
        'bower_components/grafika-js/dist/grafika.demo.js'
    ])
    .pipe(gulp.dest('wwwroot/js'));
});

gulp.task('copy-creative', function () {
    return gulp.src('Templates/creative/js/creative.js').pipe(gulp.dest('wwwroot/js'));
});

gulp.task('copy-fa', function () {
    return gulp.src('bower_components/font-awesome/fonts/*').pipe(gulp.dest('wwwroot/fonts'));
});