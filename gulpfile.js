const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
// const uglify = require('gulp-uglify-es').default;
// const babel = require("gulp-babel");
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const beautify = require('gulp-jsbeautifier');
const cache = require('gulp-cache');
const reload = browserSync.reload;

// === Пути ===

const src = {
   script: {
      all: './src/js/**/*',
      input: './src/js/**/*.js',
      output: {
         we: './js'
      },
   
      output_name: 'script.js'
   },

   style: {
      input: {
         basis: './src/scss/style.scss',
         all: './src/scss/**/*.scss',
         css: './src/css/**/*.css',
      },

      output: {
         we: './css',
      },

      output_name: 'style.css',
      s_maps: './'
   },

   html: {
      input: {
         basis:'./index.html',
         all: './src/pages/**/*',
         beautify: './**/*.html'
      }
   },

   fonts: {
      input: './src/fonts/**/*',
      output: {
         we: './fonts'
      },
   },

   img: {
      input: './src/images/**',
      output: {
         we: './images'
      },
   },

   pug: {
      input_pug: './src/templates/pug/**/*.pug',
      input_pages: './src/pages/**/*.pug',
      input_index: './src/index.pug',

      output_templates: './templates/',
      output_pages: './pages/',
      output_index: './'
   }
};

// === task ===

gulp.task('beautify', function() {
  gulp.src('./**/*.html')
    .pipe(beautify())
    .pipe(gulp.dest('./'))
});

gulp.task('pug_pages', function() {
   return gulp.src(src.pug.input_pages)
   .pipe(pug({pretty: true}))
   .on('error', function (err) {
      console.log(err);
      this.emit('end');
   })
   .pipe(beautify(this))
   .pipe(gulp.dest(src.pug.output_pages))
   .pipe(reload({ stream: true }))
});

 gulp.task('pug_index', function() {
   return gulp.src(src.pug.input_index)
   .pipe(pug({pretty: true}))
   .on('error', function (err) {
      console.log(err);
      this.emit('end');
   })
   .pipe(beautify(this))
   .pipe(gulp.dest(src.pug.output_index))
   .pipe(reload({ stream: true }))
 });

gulp.task('styles', () => {
   return gulp.src(src.style.input.basis)
   .pipe(sourcemaps.init())
   .pipe(sass())
   .on('error', function (err) {
      console.log(err);
      this.emit('end');
   })
   .pipe(concat(src.style.output_name))
   .pipe(autoprefixer({
      overrideBrowserslist: ['last 4 versions'], 
      cascade: false
   }))
   // Сжатие CSS
   .pipe(cleanCSS({
      level: 2
   }))
   .pipe(sourcemaps.write(src.style.s_maps))
   .pipe(gulp.dest(src.style.output.we))
   .pipe(reload({ stream: true }))
});

gulp.task('fonts', () => {
   return gulp.src(src.fonts.input)
   .pipe(gulp.dest(src.fonts.output.we))
   .pipe(reload({ stream: true }))
});

gulp.task('scripts', () => {
   return gulp.src(src.script.input)
   // .pipe(babel())
   //Сжатие JS
   // .pipe(uglify({
   //    toplevel: true
   // }))
   .on('error', function (err) {
      console.log(err);
      this.emit('end');
   })
   .pipe(gulp.dest(src.script.output.we))
   .pipe(reload({ stream: true }))
});

gulp.task('scriptsAll', () => {
   return gulp.src(src.script.all, !src.script.input)
   // .pipe(babel())
   .on('error', function (err) {
      console.log(err);
      this.emit('end');
   })
   .pipe(gulp.dest(src.script.output.we))
   .pipe(reload({ stream: true }))
});

gulp.task('del', () => {
   return del([src.style.output.we, src.script.output.we, src.fonts.output.we, src.img.output.we, src.pug.output_pages, './index.html']);
});

gulp.task('img-compress', function() {
   return gulp.src(src.img.input)
     .pipe(cache(imagemin([
       imagemin.gifsicle({interlaced: true}),
       imagemin.jpegtran({progressive: true}),
       imageminJpegRecompress({
         loops: 5,
         min: 65,
         max: 70,
         quality:'medium'
       }),
       imagemin.optipng({optimizationLevel: 3})
     ])))
   .pipe(gulp.dest(src.img.output.we))
   .pipe(reload({ stream: true }));
 });
 
 gulp.task('clear', function (done) {
   return cache.clearAll(done)
 });

gulp.task('watch', () => {
   browserSync.init({
      server: {
         baseDir: "./"
      }
   });
});

gulp.watch(([src.pug.input_pug, src.pug.input_index, src.pug.input_pages]), gulp.series('pug_pages', 'pug_index'));
gulp.watch(src.img.input, gulp.series('img-compress'));
gulp.watch((src.style.input.all), gulp.series('styles'));
gulp.watch(src.fonts.input, gulp.series('fonts'));
gulp.watch(src.script.input, gulp.series('scripts'));
gulp.watch(src.script.all, gulp.series('scriptsAll'));

gulp.task('default', gulp.series('del', gulp.parallel('clear', 'fonts', 'img-compress', 'styles', 'scriptsAll', 'scripts', 'pug_pages', 'pug_index'), 'watch'));