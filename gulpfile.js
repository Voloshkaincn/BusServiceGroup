var gulp = require('gulp'),
concat = require('gulp-concat'),
cssnano = require('gulp-cssnano'),
rename      = require('gulp-rename'),
uglify = require('gulp-uglifyjs'),
sass = require('gulp-sass'),
browserSync = require('browser-sync').create(),
del = require('del'),
imagemin     = require('gulp-imagemin'),
pngquant     = require('imagemin-pngquant'),
cache        = require('gulp-cache'),
autoprefixer = require('gulp-autoprefixer');
includer     = require("gulp-x-includer");

//======all tasks=====
//cleaning tasks
gulp.task('clean', function() {
    return del.sync('build'); 
});
gulp.task('clear', function (callback) {
	return cache.clearAll();
});
//scripts
gulp.task('libs-js', function() {
	gulp.src('src/libs/**/*.js')
		.pipe(concat('libs.js'))
		.pipe(uglify())
		.pipe(rename ({suffix: '.min'}))
		.pipe(gulp.dest('dev/js'))
});
gulp.task('js', function() {
  	gulp.src(['src/js/**/*.js','src/blocks/**/*.js'])
	  	.pipe(concat('main.js'))
	    .pipe(uglify())
	    .pipe(rename ({suffix: '.min'}))
	    .pipe(gulp.dest('dev/js'))
});
//styles
gulp.task('libs-sass', function(){
    return gulp.src(['src/libs/scss/libs.scss'])
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('src/libs/'))
});
gulp.task('libs-css', ['libs-sass'], function() {
	gulp.src('src/libs/**/*.css')
		.pipe(concat('libs.css'))
		.pipe(cssnano())
		.pipe(rename ({suffix: '.min'}))
		.pipe(gulp.dest('dev/css'))
});
gulp.task('sass', function(){
    return gulp.src(['src/sass/**/*.scss', 'src/blocks/**/*.scss'])
    	.pipe(concat('main.scss'))
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('dev/css'))
        //.pipe(browserSync.reload({stream: true}))
});
gulp.task('css', ['sass'], function() {
  	gulp.src('dev/css/main.css')
	    .pipe(cssnano())
	    .pipe(rename ({suffix: '.min'}))
	    .pipe(gulp.dest('dev/css'))
	    .pipe(browserSync.reload({stream: true}))
});
//browser-sync
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "dev"
        }
    });
});
//fonts

//images
gulp.task('img', function() {
	gulp.src(['src/img/**/*', 'src/block/assets/**/*'])
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dev/img'));

});
//html
gulp.task("include", function(){
    gulp.src(["src/*.html"])
    .pipe(includer())
    .pipe(gulp.dest("dev/"));
});

//default task. call command - gulp
gulp.task('default', ['watch']);

gulp.task('watch', ['browser-sync', 'libs-css', 'css',  'libs-js', 'js', 'include', 'img'], function() {
	gulp.watch(['src/sass/**/*.scss', 'src/blocks/**/*.scss'], ['css']);
	gulp.watch('src/css/libs/**/*.css', ['libs-css']);
	gulp.watch('src/js/libs/**/*.js', ['libs-js']);
	gulp.watch(['src/js/**/*.js'], ['js']);
	gulp.watch(['src/**/*.html'], ['include']);
	gulp.watch(['src/img/**/*'], ['img']);
	gulp.watch('dev/**/*', browserSync.reload);
});

// gulp.task('build', ['clean'], function() {
// 	var buildCss = gulp.src([
// 		'src/css/main.min.css',
// 		'src/css/main.css',
// 		'src/css/libs.min.css'
// 		])
// 	.pipe(gulp.dest('build/css'))

// 	var buildFonts = gulp.src('src/fonts/**/*')
// 	.pipe(gulp.dest('build/fonts'))

// 	var buildJs = gulp.src([
// 		'src/js/libs.min.js',
// 		'src/js/main.js',
// 		'src/js/main.min.js'
// 	])
// 	.pipe(gulp.dest('build/js'))

// 	var buildHtml = gulp.src('src/*.html')
// 	.pipe(gulp.dest('build'));
// });