var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var gulpConcat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
  js:        'javascripts/',
  sass:      'stylesheets/',
  build:     'build/',
  jsBuild:   'build/all.js',
  sassBuild: 'build/all.css'
}

var jsFiles = [
  // modules
  'class_utils.js',
  'select_utils.js',
  'script_utils.js',
  'array_utils.js',

  // classes
  'board.js',
  'tile.js',

  // general
  'create_board.js'
].map(function(elem) {
  return paths.js + elem;
});

gulp.task('watch', function () {
  gulp.watch(paths.sass + '**/*.scss', ['sass:build']);
  gulp.watch(paths.js   + '**/*.js',   ['js:build']);
});

gulp.task('sass:build', function () {
  return gulp.src(paths.sass + 'all.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions', 'Explorer >= 9'] }))
    .pipe(gulp.dest(paths.build));
});

gulp.task('css:minify', ['sass:build'], function () {
  return gulp.src(paths.sassBuild)
    .pipe(csso())
    .pipe(gulp.dest(paths.build));
});

gulp.task('js:build', function () {
  return gulp.src(jsFiles)
    .pipe(gulpConcat('all.js'))
    .pipe(gulp.dest(paths.build));
});

gulp.task('js:minify', ['js:build'], function () {
  return gulp.src(paths.jsBuild)
    .pipe(uglify())
    .pipe(gulp.dest(paths.build));
});

gulp.task('dev', ['sass:build', 'js:build']);
gulp.task('prod', ['css:minify', 'js:minify']);

gulp.task('default', ['dev', 'watch'])
