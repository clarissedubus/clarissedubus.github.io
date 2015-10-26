/**
 * Author:  @juancarlosfarah
 * Date:    05/10/15
 */

import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import concat from 'gulp-concat';
import source from 'vinyl-source-stream';
import cssmin from 'gulp-cssmin';
import less from 'gulp-less';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';
import resolutions from 'browserify-resolutions';
import watchify from 'watchify';

const dependencies = [
    'react',
    'react-dom',
    'react-router',
    'react-bootstrap',
    'underscore'
];


// Combine all JS libraries into a single file for fewer HTTP requests.
gulp.task('vendor', function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/magnific-popup/dist/jquery.magnific-popup.min.js',
        'bower_components/masonry/dist/masonry.pkgd.min.js',
        'bower_components/imagesloaded/imagesloaded.pkgd.min.js'
    ]).pipe(concat('vendor.js'))
      .pipe(gulp.dest('public/js'));
});

// Copy all fonts to public directory.
gulp.task('fonts', function() {
    return gulp.src(['bower_components/bootstrap/fonts/**/*'])
               .pipe(gulp.dest('public/fonts'));
});

// Compile third-party dependencies separately for faster performance.
gulp.task('browserify-vendor', function() {
    return browserify()
        .require(dependencies)
        .plugin(resolutions, 'react')
        .bundle()
        .pipe(source('vendor.bundle.js'))
        .pipe(gulp.dest('public/js'));
});

// Compile only project files, excluding all third-party dependencies.
gulp.task('browserify', ['browserify-vendor'], function() {
    return browserify('src/app.js')
        .external(dependencies)
        .plugin(resolutions, 'react')
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('public/js'));
});

// Compile LESS stylesheets.
gulp.task('styles', function() {
    return gulp.src('src/less/styles.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
    gulp.watch('src/less/**/*.less', ['styles']);
});


// Same as browserify task, but will also watch for changes and re-compile.
gulp.task('browserify-watch', ['browserify-vendor'], function() {
    var bundler = watchify(browserify('src/app.js', watchify.args));
    bundler.external(dependencies);
    bundler.plugin(resolutions, 'react');
    bundler.transform(babelify);
    bundler.on('update', rebundle);
    return rebundle();

    function rebundle() {
        var start = Date.now();
        return bundler.plugin(resolutions, 'react')
            .bundle()
            .on('error', function(err) {
                gutil.log(gutil.colors.red(err.toString()));
            })
            .on('end', function() {
                gutil.log(gutil.colors.green('Finished re-bundling in',
                    (Date.now() - start) + 'ms.'));
            })
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('public/js/'));
    }
});

gulp.task('build',
          [
              'fonts',
              'styles',
              'vendor',
              'browserify',
              'browserify-watch',
              'watch'
          ]);
gulp.task('default', ['build']);