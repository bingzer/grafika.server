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
        'bower_components/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.js'
    ])
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/js'));
});

gulp.task('copy-fonts', function () {
    return gulp.src('bower_components/font-awesome/fonts/*')
        .pipe(gulp.dest('Grafika.WebSite/wwwroot/fonts'));
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('install', function (callback) {
    runSequence('clean', 'bower', 'typings', 'scripts', 'styles', 'minify', callback);
});
gulp.task('styles', function (callback) {
    runSequence('less', 'copy-fonts', callback);
});
gulp.task('scripts', function (callback) {
    runSequence('ts', 'copy-js', callback);
});
gulp.task('minify', function(callback) {
    runSequence('min:js', 'min:css', callback);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('min:js', function (callback) {
    runSequence(
        'min:js:GrafikaApp.Bundle.Site',
        'min:js:GrafikaApp.Bundle.Home',
        'min:js:GrafikaApp.Bundle.Drawing',
        callback);
});

gulp.task('min:js:GrafikaApp.Bundle.Site', function (callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/js/bootbox.js',
        'Grafika.WebSite/wwwroot/js/scrollreveal.js',
        'Grafika.WebSite/wwwroot/js/grafika.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.Partials.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.Dialog.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.Player.js',
    ])
    .pipe(concat('GrafikaApp.Bundle.Site.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/js'));
});

gulp.task('min:js:GrafikaApp.Bundle.Home', function (callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/js/jquery.easing.js',
        'Grafika.WebSite/wwwroot/js/jquery.magnific-popup.js',
        'Grafika.WebSite/wwwroot/js/GrafikaApp.Home.js',
    ])
    .pipe(concat('GrafikaApp.Bundle.Home.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/js'));
});

gulp.task('min:js:GrafikaApp.Bundle.Drawing', function (callback) {
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
    .pipe(sourcemaps.init())
    .pipe(concat('GrafikaApp.Bundle.Drawing.min.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/js'));
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('min:css', function (callback) {
    runSequence(
        'min:css:GrafikaApp.Bundle.Site',
        'min:css:GrafikaApp.Bundle.Home',
        'min:css:GrafikaApp.Bundle.Login',
        'min:css:GrafikaApp.Bundle.Drawing',
        'min:css:GrafikaApp.Bundle.Animation.List',
        'min:css:GrafikaApp.Bundle.Animation.Detail',
        callback);
});

gulp.task('min:css:GrafikaApp.Bundle.Site', function (callback) {
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

gulp.task('min:css:GrafikaApp.Bundle.Home', function (callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/css/magnific-popup.css',
        'Grafika.WebSite/wwwroot/css/GrafikaApp.Home.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Home.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/css'));
});

gulp.task('min:css:GrafikaApp.Bundle.Login', function(callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/css/GrafikaApp.Login.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Login.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/css'));
});

gulp.task('min:css:GrafikaApp.Bundle.Animation.List', function (callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/css/GrafikaApp.Animation.List.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Animation.List.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/css'));
});

gulp.task('min:css:GrafikaApp.Bundle.Animation.Detail', function(callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/css/GrafikaApp.Animation.Detail.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Animation.Detail.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/css'));
});

gulp.task('min:css:GrafikaApp.Bundle.Drawing', function(callback) {
    return gulp.src([
        'Grafika.WebSite/wwwroot/css/angular-material.css',
        'Grafika.WebSite/wwwroot/css/GrafikaApp.Drawing.css'
    ])
    .pipe(concat('GrafikaApp.Bundle.Drawing.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('Grafika.WebSite/wwwroot/css'));
});