var gulp = require('gulp');
var server = require('gulp-server-livereload');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserify = require('browserify');
var react = require('gulp-react');

gulp.task('build', function () {
    return browserify({
        entries: ["./src/main.jsx"]
    })
        .transform(babelify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("./build"));
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.jsx', ['build'])
});

gulp.task('webserver', function () {
    gulp.src('./')
        .pipe(server({
            livereload: false,
            directoryListing: true,
            port: 8001,
        }));
});

gulp.task('default', ['build', 'watch', 'webserver']);