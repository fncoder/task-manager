const gulp            = require('gulp');
const browserSync     = require('browser-sync').create();
const reload          = browserSync.reload;
const sass            = require('gulp-sass');
const autoprefixer    = require('gulp-autoprefixer');
const concat          = require('gulp-concat');
const cssmin          = require('gulp-cssmin');
const uglify          = require('gulp-uglify');
const babel           = require('gulp-babel');
const rename          = require('gulp-rename');
const image           = require('gulp-image');

////Default
gulp.task('default', ['watch']);

////Server
gulp.task('server', ()=>{
    browserSync.init({
        server: {
            baseDir: "src"
        },
       browser: ['chrome']
    });
});

////Compile SASS to CSS (Src)
gulp.task('sass', ()=>{
  return gulp.src('src/sass/global.scss')
    .pipe(concat('main.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('src/stylesheets'));
});

////Main CSS file to Build
gulp.task('css-build', ()=>{
  return gulp.src('src/stylesheets/main.css')
    .pipe(gulp.dest('build/stylesheets'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssmin())
    .pipe(gulp.dest('build/stylesheets'))
});

////Bundle all JS files to Src and Build
gulp.task('js-build', ()=>{
  return gulp.src(['src/js/*.js','!src/js/bundle.js'])
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('src/js'))
  .pipe(concat('bundle.js'))
  .pipe(babel())
  .pipe(gulp.dest('build/js'))
  .pipe(concat('bundle.js'))
  .pipe(rename({suffix: '.min'}))
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest('build/js'))
});

////All JS files to Build
gulp.task('build-scripts', ()=>{
  return gulp.src(['src/js/*.js','!src/js/bundle.js'])
    .pipe(babel())
    .pipe(gulp.dest('build/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
});

////Compress images to Build
gulp.task('imagemin', ()=>{
  gulp.src('src/images/**')
    .pipe(image())
    .pipe(gulp.dest('build/images'))
});

////All FONTS to Build
gulp.task('fonts', ()=> {
return gulp.src('src/fonts/*')
    .pipe(gulp.dest('build/fonts'))
});

////All HTML files to Build
gulp.task('htmls', ()=>{
return gulp.src('src/*.html')
    .pipe(gulp.dest('build'))
});

////Watch tasks
gulp.task('watch', ['server','sass','css-build','js-build','htmls','imagemin'], ()=>{
  gulp.watch(['src/sass/global.scss', 'src/sass/base/**/*.scss', 'src/sass/components/**/*.scss', 'src/sass/helpers/**/*.scss', 'src/sass/layout/**/*.scss','src/sass/pages/**/*.scss', 'src/sass/vendors/**/*.scss'], ['sass']);
  gulp.watch('src/stylesheets/*.css', ['css-build']).on('change', reload);
  gulp.watch('src/js/*.js', ['js-build', 'build-scripts']).on('change', reload);
  gulp.watch('src/fonts/*', ['fonts']);
  gulp.watch('src/images/*', ['imagemin']);
  gulp.watch('src/*.html', ['htmls']).on('change', reload);
});
