// Gulp.js configuration
var
    // modules
    gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    uncss = require('postcss-uncss'),
    concat = require('gulp-concat'),
    cssnano = require('cssnano'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    changed = require('gulp-changed'),
    deporder = require('gulp-deporder'),
    stripdebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    merge = require('gulp-merge-link'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    purgecss = require('gulp-purgecss'),
  
    cssFiles = ['src/css/google.css','src/css/unify-core.css','src/css/unify-components.css','src/css/unify-globals.css','src/css/custom.css','src/vendor/bootstrap/bootstrap.min.css','src/vendor/icon-awesome/css/font-awesome.min.css','src/vendor/dzsparallaxer/dzsparallaxer.css','src/vendor/dzsparallaxer/dzsscroller/scroller.css','src/vendor/dzsparallaxer/advancedscroller/plugin.css','src/vendor/icon-line-pro/style.css','src/vendor/animate.css','src/vendor/hs-megamenu/src/hs.megamenu.css','src/vendor/hamburgers/hamburgers.min.css']
    jsFiles = ['src/vendor/jquery/jquery.min.js','src/vendor/jquery-migrate/jquery-migrate.min.js','src/vendor/popper.min.js','src/vendor/bootstrap/bootstrap.min.js','src/vendor/dzsparallaxer/dzsparallaxer.js','src/vendor/dzsparallaxer/dzsscroller/scroller.js','src/vendor/dzsparallaxer/advancedscroller/plugin.js','src/js/hs.core.js','src/js/components/hs.header.js','src/js/helpers/hs.hamburgers.js','src/js/custom.js','src/js/plugins.js']


    cssFilesNoSrc = [];
    cssFiles.forEach(function(element) {
        cssFilesNoSrc.push(element.replace('src/',''))
    });

    jsFilesNoSrc = [];
    jsFiles.forEach(function(element) {
        jsFilesNoSrc.push(element.replace('src/',''))
    });

    // image processing
    gulp.task('images', function() {
        var out = 'build/img/';
        return gulp.src('src/img/**/*')
        .pipe(newer(out))
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest(out));
    });

    // SCSS processing
    gulp.task('scss', function () {
        var plugins = [
            autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
        ];

    return gulp.src('src/include/scss/**/*.scss')
        .pipe(changed('build/css/'))
        .pipe(sass({outputStyle:'expanded'}))
        .pipe(gulp.dest('build/css/'))

    });


    // CSS processing
    gulp.task('css', function () {
        var plugins = [
            //uncss({
                //html: ['src/index.html']
            //}),
            autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
            cssnano()
        ];
    return gulp.src(cssFiles)
        .pipe(purgecss({
            content: ['src/index.html','build/js/main.js']
        }))
        .pipe(postcss(plugins))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('build/css/'))
        
    });

    // JavaScript processing
    gulp.task('js', function() {

        var jsbuild = gulp.src(jsFiles)
        .pipe(concat('main.js'));
        
        jsbuild = jsbuild
            .pipe(stripdebug())
            .pipe(uglify());

        return jsbuild.pipe(gulp.dest('build/js/'));
    
    });

    // HTML processing
    gulp.task('merge', function () {
        gulp.src('src/index.html')
            .pipe(merge({
                'css/main.css':cssFilesNoSrc,
                'js/main.js':jsFilesNoSrc
            }))
            .pipe(gulp.dest('build/'));
    });