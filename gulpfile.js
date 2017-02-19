const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');

gulp.task('scripts', () => (
  gulp.src('./src/sidebarjs.js')
  .pipe(babel({
    presets: ['es2015'],
    sourceMaps: true,
  }))
  .pipe(gulp.dest('./dist'))
  .pipe(rename({extname: '.min.js'}))
  .pipe(uglify())
  .pipe(gulp.dest('./dist'))
));

gulp.task('styles', () => (
  gulp.src('./src/sidebarjs.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 4 versions'],
  }))
  .pipe(gulp.dest('./dist'))
  .pipe(cssmin())
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest('./dist'))
));

gulp.task('watch', () => {
  gulp.watch('./src/sidebarjs.js', ['scripts']);
  gulp.watch('./src/sidebarjs.scss', ['styles']);
});

gulp.task('build', ['scripts', 'styles']);
