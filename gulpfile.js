'use strict';

/* jshint -W117 */

const gulp        = require('gulp');
const rename      = require('gulp-rename');
const uglify      = require('gulp-uglify');
const babel       = require('gulp-babel');
const compass     = require('gulp-compass');
const cssmin      = require('gulp-cssmin');

gulp.task('scripts', function(){
  return gulp.src('./src/sidebarjs.js')
    .pipe(babel({
			presets: ['es2015'],
      sourceMaps: true
		}))
    .pipe(gulp.dest('./dist'))
    .pipe(rename({extname: '.min.js'}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('styles', function () {
  return gulp.src('./src/sidebarjs.scss')
    .pipe(compass({
      css: './dist',
      sass: './src',
      comments: true
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(cssmin())
    .pipe(rename({ extname: '.min.css'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  gulp.watch('./src/sidebarjs.js', ['scripts']);
  gulp.watch('./src/sidebarjs.scss', ['styles']);
});

gulp.task('build', ['scripts', 'styles', 'watch']);
