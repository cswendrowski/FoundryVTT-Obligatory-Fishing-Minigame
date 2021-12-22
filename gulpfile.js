const gulp = require('gulp');
const prefix = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const minify = require('gulp-minify');
const path = require('path');
const vueComponent = require('gulp-vue-single-file-component');
const babel = require('gulp-babel');
 
/* ----------------------------------------- */
/*  Compile Sass
/* ----------------------------------------- */

// Small error handler helper function.
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
  }
  
const SCSS_FILES = ["styles/**/*.scss"];

scss = () => gulp.src(SCSS_FILES)
    .pipe(sourcemaps.init())
    .pipe(
        sass({
            outputStyle: 'nested'
        })
        .on('error', handleError)
    )
    .pipe(sourcemaps.write('.'))
    // .pipe(prefix({
    //     cascade: false
    // }))
    .pipe(gulp.dest("./css"));

/* ----------------------------------------- */
/*  Compile Vue
/* ----------------------------------------- */

const VUE_FILES = ["vue/**/*.vue"];

vue = () => gulp.src(VUE_FILES)
        .pipe(vueComponent({ loadCssMethod: 'VuePort.loadCss' }))
        .pipe(babel({
            presets: [["@babel/preset-env", { "targets": {
                "chrome": "58",
            } }]],
            plugins: ['@babel/plugin-transform-modules-commonjs']
        }))
        .pipe(wrap('Vue.component(<%= processComponentName(file.relative) %>, (function() {const exports = {}; <%= contents %>; return _default;})())', {}, {
            imports: {
                processComponentName: function (fileName) {
                    // Strip the extension and escape the output with JSON.stringify
                    return JSON.stringify(path.basename(fileName, '.js'));
                }
            }
        }))
        .pipe(declare({
            namespace: 'VuePort.Components',
            noRedeclare: true, // Avoid duplicate declarations
        }))
        .pipe(concat('vue-components.js'))

    .pipe(minify({ noSource: true, ext: ".min.js" }))
        .pipe(gulp.dest('dist/'));

watch = () => { 
    gulp.watch(VUE_FILES, vue);
    gulp.watch(SCSS_FILES, scss);
}


gulp.task('watch', watch);
gulp.task('build', gulp.series(vue, scss));
gulp.task('default', gulp.series(vue, scss, watch));
