var gulp = require('gulp'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    cleanCSS = require('gulp-clean-css'),
    path = require('path');


var WebSources = ['src/less/files/*.less'];

gulp.task('web', function() {
    return gulp.src('src/less/custom.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('www/css'));
});

gulp.task('default', ['web', 'webWatch']);

gulp.task('webWatch', function() {
    gulp.watch(WebSources, ['web']);
});