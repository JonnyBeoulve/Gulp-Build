/* =====================================================================
// GLOBAL VARIABLES
// Require
// These are the modules that this program requires.
===================================================================== */
 const gulp = require('gulp'),
     concat = require('gulp-concat'),
     uglify = require('gulp-uglify'),
     rename = require('gulp-rename'),
       csso = require('gulp-csso'),
       sass = require('gulp-sass'),
      cache = require('gulp-cache'),
      image = require('gulp-image'),
       maps = require('gulp-sourcemaps'),
        del = require('del'),
     useref = require('gulp-useref'),
    replace = require('gulp-replace'),
     server = require('http-server'),
    connect = require('gulp-connect');

/* =====================================================================
// Options
// Sets the file path for operations.
===================================================================== */
const options = {
   src: 'src',
  dist: 'dist'
};

/* =====================================================================
// TASKS
// Scripts
// This task concatenates and minifies all JS files into a single
// min file before moving it to the dist/scripts folder.
===================================================================== */
gulp.task('scripts', () => {
  return gulp.src(`${options.src}/js/**/*.js`)
    .pipe(maps.init())
    .pipe(concat('global.js'))
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(`${options.dist}/scripts`))
});

/* =====================================================================
// Styles
// This task compiles all SCSS files into CSS before concatenating the
// file in the dist/styles folder.
===================================================================== */
gulp.task('styles', () => {
  return gulp.src(`${options.src}/sass/global.scss`)
    .pipe(maps.init())
    .pipe(sass())
    .pipe(csso())
    .pipe(rename('all.min.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(`${options.dist}/styles`))
});

/* =====================================================================
// Images
// This task optimizes all images before moving them to the 
// dist/content folder.
===================================================================== */
gulp.task('images', () => {
  return gulp.src(`${options.src}/images/*.{jpg,png}`)
    .pipe(image())
    .pipe(gulp.dest(`${options.dist}/content`));
});

/* =====================================================================
// Icons
// This task optimies the SVG icons before moving them to the
// dist/icons folder.
===================================================================== */
gulp.task('icons', () => {
  return gulp.src(`${options.src}/icons/**/*`)
    .pipe(cache(image([
    ])))
    .pipe(gulp.dest(`${options.dist}/icons`));
});

/* =====================================================================
// Clean
// This task deletes the dist folder.
===================================================================== */
gulp.task('clean', () => {
  return del(options.dist);
});

/* =====================================================================
// Build
// This task initates the Clean task before starting Scripts, Styles,
// Images, and Icons in preparation of hosting the optimized website.
===================================================================== */
gulp.task('build', ['clean'], () => {
  gulp.start(['scripts', 'styles', 'images', 'icons']);
  return gulp.src(`index.html`)
    .pipe(useref())
    .pipe(replace('images/', 'content/'))
    .pipe(gulp.dest(options.dist));
});

/* =====================================================================
// Connect
// This task hosts the index.html file at 'localhost:3000' and uses
// the optimized files in the 'dist' folder instead of 'src'.
===================================================================== */
gulp.task('connect', () => {
  connect.server({
    port: 3000,
    fallback: 'index.html', // this allows the root index.html to be read
    root: `${options.dist}`, // points to the optimized folder
    livereload: true
  });
});

/* =====================================================================
// Gulp
// This is the default task, iniated by simply typing 'gulp' in terminal.
// It runs the Build task before running Connect to begin hosting.
===================================================================== */
gulp.task('default', ['build'], () => {
  gulp.start(['connect']);
});
