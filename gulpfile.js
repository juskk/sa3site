const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');

const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const browserSync = require('browser-sync').create();

gulp.task('sass', function (done) {
   const source = './app/sass/**/*.sass';
   gulp
      .src(source)
      .pipe(changed(source))
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(
         autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false,
         }),
      )
      .pipe(
         rename({
            extname: '.min.css',
         }),
      )
      .pipe(cssnano())
      .pipe(gulp.dest('./dist/styles'))
      .pipe(browserSync.reload({ stream: true }));
   done();
});

gulp.task('img', function (done) {
   gulp.src('./app/img/*').pipe(imagemin()).pipe(gulp.dest('./dist/img'));
   done();
});

gulp.task('html', function (done) {
   gulp
      .src('./app/**/*.html')
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.reload({ stream: true }));
   done();
});

gulp.task('js', function (done) {
   const source = './app/js/*.js';

   gulp
      .src(source)
      .pipe(changed(source))
      .pipe(concat('bundle.js'))
      .pipe(uglify())
      .pipe(
         rename({
            extname: '.min.js',
         }),
      )
      .pipe(gulp.dest('./dist/js/'))
      .pipe(browserSync.reload({ stream: true }));
   done();
});



gulp.task('browser-sync', function (done) {
   browserSync.init({
      server: {
         baseDir: './dist/',
      },
      port: 3000,
      notify: false,
   });

   done();
});

gulp.task('watch', function (done) {
   gulp.watch('./app/sass/**/*.sass', gulp.series('sass'));
   gulp.watch('./app/**/*.html', gulp.series('html'));
   gulp.watch('./app/**/*.js', gulp.series('js'));
   gulp.watch('./app/img/*', gulp.series('img'));
   done();
});

gulp.task(
   'default',
   gulp.parallel('watch', 'sass', 'html', 'js', 'img', 'browser-sync'),
);
