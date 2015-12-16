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
import nunjucksRender from 'gulp-nunjucks-render';
import data from 'gulp-data';
import fs from 'fs';
import nunjucks from 'nunjucks';

const dependencies = [
    'underscore'
];


// Combine all JS libraries into a single file for fewer HTTP requests.
gulp.task('vendor', function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/magnific-popup/dist/jquery.magnific-popup.min.js',
        'bower_components/masonry/dist/masonry.pkgd.min.js',
        'bower_components/imagesloaded/imagesloaded.pkgd.min.js',
        'bower_components/lodash/lodash.js'
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
        .plugin(resolutions, '*')
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
    gulp.watch('**/*.nunjucks', ['nunjucks', 'projects']);
    gulp.watch('data/*.json', ['nunjucks', 'projects']);
});


// Same as browserify task, but will also watch for changes and re-compile.
gulp.task('browserify-watch', ['browserify-vendor'], function() {
    var bundler = watchify(browserify('src/app.js', watchify.args));
    bundler.external(dependencies);
    bundler.plugin(resolutions, '*');
    bundler.transform(babelify);
    bundler.on('update', rebundle);
    return rebundle();

    function rebundle() {
        var start = Date.now();
        return bundler.plugin(resolutions, '*')
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

gulp.task('nunjucks', function() {
    nunjucksRender.nunjucks.configure(['templates/']);

    // Gets .html and .nunjucks files in pages
    return gulp.src('pages/**/*.+(html|nunjucks)')
        .pipe(data(function() {
            return JSON.parse(fs.readFileSync('./data/projects.json', 'utf8'));
        }))
        // Renders template with nunjucks
        .pipe(nunjucksRender())
        // output files in app folder
        .pipe(gulp.dest('.'))
});

gulp.task('projects', function() {
    nunjucks.configure(['templates/']);
    let json = JSON.parse(fs.readFileSync('./data/projects.json', 'utf8')),
        projects = json.projects;
    for (var key in projects) {
        let project = projects[key],
            imageDir = './public/images/' + key,
            images = fs.readdirSync(imageDir);
        project['images'] = images;
        project['key'] = key;
        var html = nunjucks.render('project.nunjucks',
                                   {
                                       project: project,
                                       projects: projects
                                   });
        fs.writeFileSync(key + '.html', html);
    }
});

gulp.task('build',
          [
              'fonts',
              'styles',
              'vendor',
              'browserify',
              'browserify-watch',
              'watch',
              'nunjucks',
              'projects'
          ]);
gulp.task('default', ['build']);