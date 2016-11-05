// Assigning modules to local variables
var gulp = require('gulp');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');


// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Default task
gulp.task('default', ['less', 'minify-js', 'copy']);

// Less task to compile the less files and add the banner
gulp.task('less', function() {
    return gulp.src('client/less/freelancer.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('client/css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('client/css'))
        .pipe(livereload())
});

// Minify CSS
gulp.task('minify-css', function() {
    return gulp.src('client/css/freelancer.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('client/css'))
        .pipe(livereload())
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('client/js/freelancer.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('client/js'))
        .pipe(livereload())
});

// Copy Bootstrap core files from node_modules to vendor directory
gulp.task('bootstrap', function() {
    return gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('client/vendor/bootstrap'))
})

// Copy jQuery core files from node_modules to vendor directory
gulp.task('jquery', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('client/vendor/jquery'))
})

// Copy Font Awesome core files from node_modules to vendor directory
gulp.task('fontawesome', function() {
    return gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('client/vendor/font-awesome'))
})

gulp.task('reload-html', function() {
    return gulp.src('client/*.html')
        .pipe(gulp.dest('client/.'))
        .pipe(livereload());
});

// Copy all third party dependencies from node_modules to vendor directory
gulp.task('copy', ['bootstrap', 'jquery', 'fontawesome']);

// Watch Task that compiles LESS and watches for HTML or JS changes and reloads with browserSync
gulp.task('dev', ['less', 'minify-css', 'minify-js'], function() {
    livereload.listen();
    gulp.watch('client/less/*.less', ['less']);
    gulp.watch('client/.css/*.css', ['minify-css']);
    gulp.watch('client/js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML, JS or image files change
    gulp.watch('client/gulpfile.js', ['reload-html'] );
    gulp.watch('client/img/*.png', ['reload-html'] );
    gulp.watch('client/*.html', ['reload-html'] );
    gulp.watch('client/js/**/*.js', ['reload-html'] );
});
