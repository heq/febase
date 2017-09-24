'use strict';

var gulp = require('gulp');
var del = require('del');
var hbs = require('gulp-hb');
var sprity = require('sprity');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var source = require('vinyl-source-stream');
var imagemin = require('gulp-imagemin');
var rubySass = require('gulp-ruby-sass');
var pngquant = require('imagemin-pngquant');
var streamify = require('gulp-streamify');
var minifyCss = require('gulp-minify-css');
var browserify = require('browserify');
var minifyHtml = require('gulp-minify-html');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', ['clean'], function(cb) {
  runSequence(['scripts', 'styles'], ['hbs', 'images'], 'hbs-other', 'browser-sync', 'watch', cb);
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./dist"
    },
    browser: "google chrome",
    ghostMode: false
  });
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist/*'], {
  dot: true
}));

gulp.task('hbs', function() {
  return gulp.src('src/hbs/index.hbs')
    .pipe(hbs({
      debug: true,
      data: './src/json/**/*.json',
      helpers: './src/helpers/*.js',
      partials: './src/hbs/partials/**/*.hbs',
      bustCache: true
    }))
    .pipe(rename('index.html'))
    .pipe(minifyHtml())
    .pipe(gulp.dest('dist'));
});

gulp.task('hbs-other', function() {
  return gulp.src('src/hbs/{*}.hbs')
    .pipe(hbs({
      debug: true,
      helpers: './src/helpers/*.js',
      bustCache: true
    }))
    .pipe(minifyHtml())
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
  return rubySass('src/scss/style.scss', {
      style: 'expanded',
      precision: 10,
      noCache: true
    })
    .on('error', function(err) {
      console.error('Error!', err.message);
    })
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    //.pipe(minifyCss())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function() {
  var props = {
    debug: false
  };

  return browserify('./src/js/main.js', props).bundle()
    .pipe(source('main.js'))
    //.pipe(streamify(uglify()))
    //.pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*.{gif,jpg,png,svg}')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['styles', browserSync.reload]);
  gulp.watch('src/js/**/*.js', ['scripts', browserSync.reload]);
  gulp.watch('src/json/**/*.json', ['hbs', browserSync.reload]);
  gulp.watch('src/images/sprite/**/*.png', ['sprite']);
  gulp.watch(['src/images/**/*', '! src/images/spite/**/*'], ['images']);
  gulp.watch('src/hbs/**/*', ['hbs', 'hbs-other', browserSync.reload]);
});
