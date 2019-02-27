const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const rucksack = require('rucksack-css');
const cleanCSS = require('gulp-clean-css');
const browsersync = require('browser-sync').create();

sass.compiler = require('node-sass');

const paths = {
  stylesheets: {
    src: './src/stylesheets/**/*.scss',
    dest: './public/css'
  },
  views: {
    src: './src/views',
    dest: './templates'
  },
  scripts: {
    src: './src/js'
  }
};

gulp.task('build-css', () => {
  return gulp
    .src(paths.stylesheets.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([rucksack({ autoprefixer: true })]))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest(paths.stylesheets.dest));
});

gulp.task('sass', function() {
  return gulp
    .src(paths.stylesheets.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([rucksack({ autoprefixer: true })]))
    .pipe(gulp.dest(paths.stylesheets.dest));
});

gulp.task('sass:watch', function() {
  gulp.watch(paths.stylesheets.src, gulp.series('sass'));
});

const browserSync = done => {
  browsersync.init({
    proxy: 'localhost:8080'
  });
  done();
};

const browserSyncReload = done => {
  browsersync.reload();
  done();
};

const watchFiles = () => {
  gulp.watch(
    [paths.stylesheets.src, paths.views.dest, paths.scripts.src],
    gulp.series(browserSyncReload)
  );
};

gulp.task('dev', gulp.parallel(watchFiles, 'sass:watch', browserSync));
