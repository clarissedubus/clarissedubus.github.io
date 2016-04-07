/**
 * Author:  @juancarlosfarah
 * Date:    05/10/15
 * File:    gulpfile.babel.js
 */

const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const concat = require('gulp-concat');
const source = require('vinyl-source-stream');
const cssmin = require('gulp-cssmin');
const less = require('gulp-less');
const util = require('gulp-util');
const plumber = require('gulp-plumber');
const _ = require('lodash');
const autoprefixer = require('gulp-autoprefixer');
const resolutions = require('browserify-resolutions');
const watchify = require('watchify');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const nunjucks = require('nunjucks');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rimraf = require('rimraf');
const imageResize = require('gulp-image-resize');
const fs = require('fs');

// TODO: Make images 800px wide on largest dimension.
// const imageSize = require('image-size');

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

// Watch for changes across relevant directories.
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
                util.log(util.colors.red(err.toString()));
            })
            .on('end', function() {
                util.log(util.colors.green('Finished re-bundling in',
                    (Date.now() - start) + 'ms.'));
            })
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('public/js/'));
    }
});

/**
 * Compiles nunjucks files.
 * @param watch
 */
function compileNunjucks(watch) {
    // Gets .html and .nunjucks files in pages.
    return gulp.src('pages/**/*.+(html|nunjucks)')
        .pipe(data(function() {
            return JSON.parse(fs.readFileSync('./data/projects.json', 'utf8'));
        }))
        // Renders template with nunjucks.
        .pipe(nunjucksRender({
            path: ['templates/'],
            watch
        }))
        // Output files in app folder.
        .pipe(gulp.dest('.'));
}

// Compile all nunjucks files.
gulp.task('nunjucks', function() {
    return compileNunjucks(false);
});

// Compile all nunjucks files and watch for changes.
gulp.task('nunjucks-watch', function() {
    return compileNunjucks(true);
});

/**
 * Reads images from directory.
 * @param imageDir
 * @returns {Array}
 */
function readImages(imageDir) {
    let images = [],
        files = fs.readdirSync(imageDir);

    files.map((filename) => {
        if ((/\.(jpg|jpeg|png)$/i).test(filename)) {
            images.push(filename);
        }
    });

    return images;
}

// Compiles the projects.
gulp.task('projects', function() {
    nunjucks.configure(['templates/']);
    let json = JSON.parse(fs.readFileSync('./data/projects.json', 'utf8')),
        projects = json.projects;
    _.map(projects, (project, key) => {
        const imageDir = `./public/images/${key}`;
        project['images'] = readImages(imageDir);
        project['key'] = key;
        const html = nunjucks.render('project.nunjucks',
            {
                project: project,
                projects: projects
            });
        fs.writeFileSync(key + '.html', html);
    });
});

// Cleans public images folder.
gulp.task('clean', (callback) => {
    return rimraf('./public/images', callback);
});

// Re-sizes and optimises images.
gulp.task('images', () => {
    const width = 800;
    return gulp.src('./src/images/**/*')
        .pipe(imageResize({
            width,
            crop : false,
            upscale : false
        }))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                {
                    removeViewBox: false
                }
            ],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./public/images'));
});

// Build
gulp.task(
    'build',
    [
        'fonts',
        'styles',
        'vendor',
        'browserify',
        'nunjucks',
        'clean',
        'images',
        'projects'
    ]
);

// Watch
gulp.task(
    'dev',
    [
        'fonts',
        'styles',
        'vendor',
        'browserify',
        'browserify-watch',
        'watch',
        'nunjucks-watch',
        'clean',
        'images',
        'projects'
    ]
);

// Default
gulp.task('default', ['dev']);
