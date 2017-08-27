/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. https://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var gutil = require('gulp-util');
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
    gulp.watch('Grafika.Web/wwwroot/js/**/*.ts', ['ts']);
    gulp.watch('Grafika.Web/wwwroot/css/**/*.less', ['less']);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function (callback) {
    return del([
        "Grafika.Web/wwwroot/js/**/*.js",
        "Grafika.Web/wwwroot/js/**/*.js.map",
        "Grafika.Web/wwwroot/css/**/*.css",
        "Grafika.Web/wwwroot/fonts",
        "Grafika.Web/wwwroot/less",
        "Grafika.Web/wwwroot/scss",
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
    return gulp.src(mainBowerFiles()).pipe(gulp.dest('./Grafika.Web/wwwroot/js'))
});

gulp.task('bower:main:css', function (callback) {
    return gulp.src('./Grafika.Web/wwwroot/js/**/*.css').pipe(gulp.dest('./Grafika.Web/wwwroot/css'))
});

gulp.task('bower:clean', function (callback) {
    return del([
        './Grafika.Web/wwwroot/js/**/*.css',
        './Grafika.Web/wwwroot/js/**/*.less',
        './Grafika.Web/wwwroot/js/**/*.scss'
    ]);
});

gulp.task('less', function () {
    return gulp.src([
        'bower_components/bootstrap/less/bootstrap.less',
        'bower_components/font-awesome/less/font-awesome.less',
        'Grafika.Web/wwwroot/css/**/*.less'
    ])
    .pipe(less({
        paths: [
            'bower_components/bootstrap/less',
            'bower_components/font-awesome/less',
            'Grafika.Web/wwwroot/css'
        ]
    }))
    .on('error', logError)
    .pipe(gulp.dest('./Grafika.Web/wwwroot/css'))

});

gulp.task('ts', function () {
    var tsProject = ts.createProject('./tsconfig.json');
    tsProject.src().pipe(tsProject({
        'compiler': './node_modules/typescript/bin/tsc'
    }))
    .on('error', logError)
    .js.pipe(gulp.dest('./Grafika.Web/wwwroot/js'))
});

gulp.task('copy-js', function () {
    return gulp.src([
        'bower_components/grafika-js/dist/grafika.js',
        'bower_components/grafika-js/dist/grafika.extensions.js',
        'bower_components/grafika-js/dist/grafika.random-drawing.js',
        'bower_components/grafika-js/dist/grafika.demo.js',
        'bower_components/jquery-serialize-object/jquery.serialize-object.js'
    ])
    .pipe(gulp.dest('Grafika.Web/wwwroot/js'));
});

gulp.task('copy-fonts', function () {
    return gulp.src('bower_components/font-awesome/fonts/*')
        .pipe(gulp.dest('Grafika.Web/wwwroot/fonts'));
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
        'min:scripts:GrafikaApp.Bundle.Animation',
        'min:scripts:GrafikaApp.Bundle.Drawing',
        'min:scripts:GrafikaApp.Bundle.StickDraw',
        'min:scripts:GrafikaApp.Bundle.Platforms',
        'min:scripts:GrafikaApp.Bundle.Android',
        'min:scripts:GrafikaApp.Bundle.Account',
        callback);
});

gulp.task('min:scripts:GrafikaApp.Bundle.Site', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/js/jquery.validate.js',
        'Grafika.Web/wwwroot/js/jquery.validate.unobtrusive.js',
        'Grafika.Web/wwwroot/js/toastr.js',
        'Grafika.Web/wwwroot/js/bootbox.js',
        'Grafika.Web/wwwroot/js/bootstrap-slider.js',
        'Grafika.Web/wwwroot/js/scrollreveal.js',
        'Grafika.Web/wwwroot/js/jquery.serialize-object.js',
        'Grafika.Web/wwwroot/js/grafika.js',
        'Grafika.Web/wwwroot/js/grafika.extensions.js',
        'Grafika.Web/wwwroot/js/GrafikaApp.js',
        'Grafika.Web/wwwroot/js/GrafikaApp.Form.js',
        'Grafika.Web/wwwroot/js/GrafikaApp.Partials.js',
        'Grafika.Web/wwwroot/js/GrafikaApp.Dialog.js',
        'Grafika.Web/wwwroot/js/GrafikaApp.Player.js',
    ])
    .pipe(concat('GrafikaApp.Bundle.Site.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('Grafika.Web/wwwroot/js'));
});

gulp.task('min:scripts:GrafikaApp.Bundle.Home', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/js/jquery.easing.js',
        'Grafika.Web/wwwroot/js/jquery.magnific-popup.js',
        'Grafika.Web/wwwroot/js/GrafikaApp.Home.js',
    ])
    .pipe(concat('GrafikaApp.Bundle.Home.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('Grafika.Web/wwwroot/js'));
});

gulp.task('min:scripts:GrafikaApp.Bundle.Animation', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/js/GrafikaApp.Animation.js',
    ])
    .pipe(concat('GrafikaApp.Bundle.Animation.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('Grafika.Web/wwwroot/js'));
});

gulp.task('min:scripts:GrafikaApp.Bundle.StickDraw', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/js/jquery.easing.js',
        'Grafika.Web/wwwroot/js/GrafikaApp.StickDraw.js',
    ])
        .pipe(concat('GrafikaApp.Bundle.StickDraw.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('Grafika.Web/wwwroot/js'));
});

gulp.task('min:scripts:GrafikaApp.Bundle.Platforms', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/js/jquery.easing.js',
        'Grafika.Web/wwwroot/js/GrafikaApp.Platforms.js',
    ])
        .pipe(concat('GrafikaApp.Bundle.Platforms.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('Grafika.Web/wwwroot/js'));
});

gulp.task('min:scripts:GrafikaApp.Bundle.Android', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/js/GrafikaApp.Android.js',
    ])
        .pipe(concat('GrafikaApp.Bundle.Android.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('Grafika.Web/wwwroot/js'));
});

gulp.task('min:scripts:GrafikaApp.Bundle.Account', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/js/GrafikaApp.Account.js',
    ])
        .pipe(concat('GrafikaApp.Bundle.Account.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('Grafika.Web/wwwroot/js'));
});

gulp.task('min:scripts:GrafikaApp.Bundle.Drawing', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/js/jquery.minicolors.js',
        'Grafika.Web/wwwroot/js/angular.js',
        'Grafika.Web/wwwroot/js/angular-animate.js',
        'Grafika.Web/wwwroot/js/angular-aria.js',
        'Grafika.Web/wwwroot/js/angular-messages.js',
        'Grafika.Web/wwwroot/js/angular-touch.js',
        'Grafika.Web/wwwroot/js/angular-cookies.js',
        'Grafika.Web/wwwroot/js/angular-sanitize.js',
        'Grafika.Web/wwwroot/js/angular-material.js',
        'Grafika.Web/wwwroot/js/angular-ui-router.js',
        'Grafika.Web/wwwroot/js/angular-jwt.js',
        'Grafika.Web/wwwroot/js/angular-minicolors.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Theme.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Base.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.AppCommon.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.AppAuthInterceptor.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.AppHttpInterceptor.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.AppRoutes.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Models.ImageData.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Models.User.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Filters.CapitalizeFirstLetter.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Directives.ContextMenuDirective.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Directives.ImageUploaderDirective.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Services.BaseService.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Services.AnimationService.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Services.ApiService.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Services.AuthService.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Services.FrameService.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Services.ResourceService.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Controllers.BaseController.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Controllers.AuthController.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Controllers.BaseAnimationController.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Controllers.DialogController.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Controllers.DrawingController.js',
        'Grafika.Web/wwwroot/js/drawing/GrafikaApp.Drawing.Controllers.LocalDrawingController.js',
        'Grafika.Web/wwwroot/js/GrafikaApp.Drawing.js'
    ])
    .pipe(concat('GrafikaApp.Bundle.Drawing.min.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('Grafika.Web/wwwroot/js'));
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('min:styles', function (callback) {
    runSequence(
        'min:styles:GrafikaApp.Bundle.Site',
        'min:styles:GrafikaApp.Bundle.Home',
        'min:styles:GrafikaApp.Bundle.Login',
        'min:styles:GrafikaApp.Bundle.Platforms',
        'min:styles:GrafikaApp.Bundle.Android',
        'min:styles:GrafikaApp.Bundle.StickDraw',
        'min:styles:GrafikaApp.Bundle.Animation.List',
        'min:styles:GrafikaApp.Bundle.Animation.Detail',
        'min:styles:GrafikaApp.Bundle.Drawing',
        callback);
});

gulp.task('min:styles:GrafikaApp.Bundle.Site', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/css/toastr.css',
        'Grafika.Web/wwwroot/css/bootstrap.css',
        'Grafika.Web/wwwroot/css/font-awesome.css',
        'Grafika.Web/wwwroot/css/bootstrap-slider.css',
        'Grafika.Web/wwwroot/css/bootstrap-xl.css',
        'Grafika.Web/wwwroot/css/GrafikaApp.css',
        'Grafika.Web/wwwroot/css/GrafikaApp.Player.css',
    ])
    .pipe(concat('GrafikaApp.Bundle.Site.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.Web/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.Home', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/css/magnific-popup.css',
        'Grafika.Web/wwwroot/css/GrafikaApp.Home.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Home.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.Web/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.Login', function(callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/css/GrafikaApp.Login.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Login.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.Web/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.Platforms', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/css/GrafikaApp.Platforms.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Platforms.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.Web/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.Android', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/css/GrafikaApp.Android.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Android.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.Web/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.StickDraw', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/css/GrafikaApp.Stickdraw.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.StickDraw.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.Web/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.Animation.List', function (callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/css/GrafikaApp.Animation.List.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Animation.List.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.Web/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.Animation.Detail', function(callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/css/GrafikaApp.Animation.Detail.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Animation.Detail.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.Web/wwwroot/css'));
});

gulp.task('min:styles:GrafikaApp.Bundle.Drawing', function(callback) {
    return gulp.src([
        'Grafika.Web/wwwroot/css/jquery.minicolors.css',
        'Grafika.Web/wwwroot/css/angular-material.css',
        'Grafika.Web/wwwroot/css/GrafikaApp.Drawing.css',
        'Grafika.Web/wwwroot/css/GrafikaApp.Login.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Drawing.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.Web/wwwroot/css'));
});