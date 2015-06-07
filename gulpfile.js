var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');


gulp.task('lint:js', function () {
    return gulp.src([
        'gulpfile.js',
        '**/*.js',
        '!node_modules/**/*.js'
    ]).pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('mocha:coverage', function (done) {
    gulp.src([
        '!gulpfile.js',
        '**/*.js',
        '!node_modules/**/*.js'
    ]).pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src('test/**/*.js')
                .pipe(mocha())
                .pipe(istanbul.writeReports())
                .pipe(istanbul.enforceThresholds({thresholds: {global: 90}}))
                .on('end', done)
            ;
        });
});

gulp.task('mocha:junit', function(done) {
    gulp.src([
        '!gulpfile.js',
        '**/*.js',
        '!node_modules/**/*.js'
    ]).pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function() {
            return gulp.src('test/**/*.js')
                .pipe(mocha({
                    reporter: 'mocha-junit-reporter',
                    reporterOptions: {
                        mochaFile: 'testresults/junit.xml'
                    }
                }))
                .pipe(istanbul.writeReports({
                    reporters: ['lcov', 'json', 'text', 'text-summary', 'cobertura', 'html']
                }))
                .on('end', done);
        });
});

gulp.task('jenkins', [
    'mocha:junit'
]);

gulp.task('default', [
    'mocha:coverage', 'lint:js'
]);
