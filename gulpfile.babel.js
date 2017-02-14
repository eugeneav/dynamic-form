var gulp = require('gulp');
var browserSync = require('browser-sync').create();
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
    browserSync.init({
        server: {
            baseDir: "./",
        }
    });
});

gulp.task('default', ['build', 'watch', 'webserver']);