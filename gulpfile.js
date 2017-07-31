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
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function logError(e) {
    console.error(e.message);
    this.emit('end');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['install']);

gulp.task('watch', ['ts', 'less'], function () {
    gulp.watch('Grafika.WebSite/wwwroot/js/**/*.ts', ['ts']);
    gulp.watch('Grafika.WebSite/wwwroot/css/**/*.less', ['less']);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function (callback) {
    return del([
        "Grafika.WebSite/wwwroot/js/**/*.js",
        "Grafika.WebSite/wwwroot/js/**/*.js.map",
        "Grafika.WebSite/wwwroot/css/**/*.css",
        "Grafika.WebSite/wwwroot/fonts",
        "Grafika.WebSite/wwwroot/less",
        "Grafika.WebSite/wwwroot/scss",
    ]);
});

gulp.task('typings', function () {
    return gulp.src('./typings.json').pipe(typings());
});

gulp.task('bower', function (callback) {
    runSequence(
        'bower:main',
        'bower:main:css',
        'bower:clean',
        callback);
});

gulp.task('bower:main', function (callback) {
    return gulp.src(mainBowerFiles()).pipe(gulp.dest('./Grafika.WebSite/wwwroot/js'))
});

gulp.task('bower:main:css', function (callback) {
    return gulp.src('./Grafika.WebSite/wwwroot/js/**/*.css').pipe(gulp.dest('./Grafika.WebSite/wwwroot/css'))
});

gulp.task('bower:clean', function (callback) {
    return del([
        './Grafika.WebSite/wwwroot/js/**/*.css',
        './Grafika.WebSite/wwwroot/js/**/*.less',
        './Grafika.WebSite/wwwroot/js/**/*.scss'
    ]);
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
    .on('error', logError)
    .pipe(gulp.dest('./Grafika.WebSite/wwwroot/css'))

});

gulp.task('ts', function () {
    var tsProject = ts.createProject('./tsconfig.json');
    tsProject.src().pipe(tsProject({
        'compiler': './node_modules/typescript/bin/tsc'
    }))
    .on('error', logError)
    .js.pipe(gulp.dest('./Grafika.WebSite/wwwroot/js'))
});

gulp.task('copy-js', function () {
    return gulp.src([
        'bower_components/grafika-js/dist/grafika.js',
        'bower_components/grafika-js/dist/grafika.random-drawing.js',
        'bower_components/grafika-js/dist/grafika.demo.js',
        'bower_components/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.js',
        'bower_components/jquery-serialize-object/jquery.serialize-object.js'
    ])
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/js'));
});

gulp.task('copy-fonts', function () {
    return gulp.src('bower_components/font-awesome/fonts/*')
        .pipe(gulp.dest('Grafika.WebSite/wwwroot/fonts'));
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('install', function (callback) {
    runSequence('clean', 'bower', 'typings', 'styles', 'scripts', callback);
});
gulp.task('styles', function (callback) {
    runSequence('copy-fonts', 'less', callback);
});
gulp.task('scripts', function (callback) {
    runSequence('copy-js', 'ts', callback);
});
gulp.task('minify', function (callback) {
    runSequence('min:styles', 'min:scripts', callback);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('min:scripts', function (callback) {
    runSequence(
        'min:scripts:GrafikaApp.Bundle.Site',
        'min:scripts:GrafikaApp.Bundle.Home',
        'min:scripts:GrafikaApp.Bundle.Drawing',
        'min:scripts:GrafikaApp.Bundle.StickDraw',
        callback);
});

gulp.task('min:scripts:GrafikaApp.Bundle.Site', function (callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/js/bootbox.js',
        'Grafika.WebSite/wwwroot/js/scrollreveal.js',
        'Grafika.WebSite/wwwroot/js/jquery.serialize-object.js',
        'Grafika.WebSite/wwwroot/js/grafika.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.Form.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.Partials.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.Dialog.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.Player.js',
    ])
    .pipe(concat('GrafikaApp.Bundle.Site.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/js'));
});

gulp.task('min:scripts:GrafikaApp.Bundle.Home', function (callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/js/jquery.easing.js',
        'Grafika.WebSite/wwwroot/js/jquery.magnific-popup.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.Home.js',
    ])
    .pipe(concat('GrafikaApp.Bundle.Home.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/js'));
});

gulp.task('min:scripts:GrafikaApp.Bundle.StickDraw', function (callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/js/jquery.easing.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.StickDraw.js',
    ])
        .pipe(concat('GrafikaApp.Bundle.StickDraw.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('Grafika.WebSite/wwwroot/js'));
});

gulp.task('min:scripts:GrafikaApp.Bundle.Drawing', function (callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/js/spectrum.js',
        'Grafika.WebSite/wwwroot/js/angular.js',
        'Grafika.WebSite/wwwroot/js/angular-animate.js',
        'Grafika.WebSite/wwwroot/js/angular-aria.js',
        'Grafika.WebSite/wwwroot/js/angular-messages.js',
        'Grafika.WebSite/wwwroot/js/angular-touch.js',
        'Grafika.WebSite/wwwroot/js/angular-cookies.js',
        'Grafika.WebSite/wwwroot/js/angular-sanitize.js',
        'Grafika.WebSite/wwwroot/js/angular-material.js',
        'Grafika.WebSite/wwwroot/js/angular-ui-router.js',
        'Grafika.WebSite/wwwroot/js/angular-jwt.js',
        'Grafika.WebSite/wwwroot/js/angular-spectrum-colorpicker.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Theme.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Base.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.AppCommon.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.AppAuthInterceptor.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.AppHttpInterceptor.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.AppRoutes.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Filters.CapitalizeFirstLetter.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Directives.ContextMenuDirective.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Directives.ImageUploaderDirective.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Services.BaseService.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Services.AnimationService.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Services.ApiService.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Services.AuthService.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Services.FrameService.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Services.ResourceService.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Controllers.BaseController.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Controllers.AuthController.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Controllers.BaseAnimationController.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Controllers.DialogController.js',
        'Grafika.WebSite/wwwroot/js/drawing/GrafikaApp.Drawing.Controllers.DrawingController.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.Drawing.js'
    ])
    .pipe(concat('GrafikaApp.Bundle.Drawing.min.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/js'));
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('min:styles', function (callback) {
    runSequence(
        'min:styles:GrafikaApp.Bundle.Site',
        'min:styles:GrafikaApp.Bundle.Home',
        'min:styles:GrafikaApp.Bundle.Login',
        'min:styles:GrafikaApp.Bundle.Drawing',
        'min:styles:GrafikaApp.Bundle.StickDraw',
        'min:styles:GrafikaApp.Bundle.Animation.List',
        'min:styles:GrafikaApp.Bundle.Animation.Detail',
        callback);
});

gulp.task('min:styles:GrafikaApp.Bundle.Site', function (callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/css/bootstrap.css',
        'Grafika.WebSite/wwwroot/css/font-awesome.css',
        'Grafika.WebSite/wwwroot/css/bootstrap-xl.css',
        'Grafika.WebSite/wwwroot/css/GrafikaApp.css',
        'Grafika.WebSite/wwwroot/css/GrafikaApp.Player.css',
    ])
    .pipe(concat('GrafikaApp.Bundle.Site.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.Home', function (callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/css/magnific-popup.css',
        'Grafika.WebSite/wwwroot/css/GrafikaApp.Home.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Home.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.Login', function(callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/css/GrafikaApp.Login.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Login.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.Animation.List', function (callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/css/GrafikaApp.Animation.List.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Animation.List.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.Animation.Detail', function(callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/css/GrafikaApp.Animation.Detail.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Animation.Detail.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.Drawing', function(callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/css/angular-material.css',
        'Grafika.WebSite/wwwroot/css/GrafikaApp.Drawing.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Drawing.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.StickDraw', function (callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/css/GrafikaApp.Stickdraw.css'
    ])
        .pipe(concat('GrafikaApp.Bundle.StickDraw.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('Grafika.WebSite/wwwroot/css'));
});