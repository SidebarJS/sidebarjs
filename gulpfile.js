'use strict';

const gulp        = require('gulp');
const rename      = require('gulp-rename');
const uglify      = require('gulp-uglify');
const babel       = require('gulp-babel');
const compass     = require('gulp-compass');
const cssmin      = require('gulp-cssmin');

gulp.task('scripts', function(){
  return gulp.src('./src/sidebarjs.js')
    .pipe(babel({
			presets: ['es2015']
		}))
    .pipe(gulp.dest('dist'))
    .pipe(rename({extname: '.min.js'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function () {
  return gulp.src('./src/sidebarjs.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: './dist',
      sass: './src',
      comments: true,
      sourcemap: true
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

gulp.task('default', ['scripts', 'styles', 'watch']);
