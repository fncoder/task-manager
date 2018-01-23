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
const processHTML     = require('gulp-processhtml');

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
    .pipe(rename({suffix: '.min'}))
    .pipe(cssmin())
    .pipe(gulp.dest('build/stylesheets'))
});

////All JS files to Build
gulp.task('build-scripts', ()=>{
  return gulp.src(['src/js/*.js','!src/js/bundle.js'])
    .pipe(rename({suffix: '.min'}))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
});

////All HTML files to Build
gulp.task('htmls', ()=>{
return gulp.src('src/*.html')
    .pipe(processHTML())
    .pipe(gulp.dest('build'))
});

////Watch tasks
gulp.task('watch', ['server','sass','css-build','htmls'], ()=>{
  gulp.watch(['src/sass/global.scss', 'src/sass/base/**/*.scss', 'src/sass/components/**/*.scss', 'src/sass/helpers/**/*.scss', 'src/sass/layout/**/*.scss','src/sass/pages/**/*.scss', 'src/sass/vendors/**/*.scss'], ['sass']);
  gulp.watch('src/stylesheets/*.css', ['css-build']).on('change', reload);
  gulp.watch('src/js/*.js', ['build-scripts']).on('change', reload);
  gulp.watch('src/*.html', ['htmls']).on('change', reload);
});
