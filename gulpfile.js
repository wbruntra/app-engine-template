const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const rucksack = require('rucksack-css');
const cleanCSS = require('gulp-clean-css');
const browsersync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const image = require('gulp-image');

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

gulp.task('sass', function() {
  return gulp
    .src(paths.stylesheets.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([rucksack({ autoprefixer: true })]))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.stylesheets.dest));
});

gulp.task('sass:watch', function() {
  gulp.watch(paths.stylesheets.src, gulp.series('sass'));
});
 
gulp.task('image', done => {
  gulp.src('./src/img/*')
    .pipe(image())
    .pipe(gulp.dest('./public/img'));
  done();
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
