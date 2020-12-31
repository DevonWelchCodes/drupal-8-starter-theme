// Defining requirements
var gulp = require( 'gulp' );
var plumber = require( 'gulp-plumber' );
var sass = require( 'gulp-sass' );
var rename = require( 'gulp-rename' );
var concat = require( 'gulp-concat' );
var uglify = require( 'gulp-uglify' );
var imagemin = require( 'gulp-imagemin' );
var ignore = require( 'gulp-ignore' );
var rimraf = require( 'gulp-rimraf' );
var sourcemaps = require( 'gulp-sourcemaps' );
var browserSync = require( 'browser-sync' ).create();
var cleanCSS = require( 'gulp-clean-css' );
var gulpSequence = require( 'gulp-sequence' );
var autoprefixer = require( 'gulp-autoprefixer' );
var purgecss = require('gulp-purgecss');

// Configuration file to keep your code DRY
var cfg = require( './gulpconfig.json' );
var paths = cfg.paths;

// Run:
// gulp sass
// Compiles SCSS files in CSS
gulp.task( 'sass', function() {
  var stream = gulp.src( paths.sass + '/*.scss' )
    .pipe( sourcemaps.init( { loadMaps: true } ) )
    .pipe( plumber( {
      errorHandler: function( err ) {
        console.log( err );
        this.emit( 'end' );
      }
    } ) )
    .pipe( sass( { errLogToConsole: true } ) )
    .pipe( autoprefixer( 'last 2 versions' ) )
    .pipe( sourcemaps.write( './' ) )
    .pipe( gulp.dest( paths.css ) )
    .pipe( rename( 'custom-editor-style.css' ) );
  return stream;
});

// Run:
// gulp watch
// Starts watcher. Watcher runs gulp sass task on changes
gulp.task( 'watch', function()  {
  gulp.watch( paths.sass + '/**/*.scss', ['styles'] );
  gulp.watch('./**/*.twig', function (event) {
    gulpSequence('minifycss', 'browserSyncReload')(function (err) {
      if (err) console.log(err)
    })
  });
  gulp.watch( [paths.dev + '/js/**/*.js', 'js/**/*.js', '!js/child-theme.js', '!js/child-theme.min.js'], ['scripts'] );

  //Inside the watch task.
  gulp.watch( paths.imgsrc + '/**', ['imagemin-watch'] );
});

// Run:
// gulp imagemin
// Running image optimizing task
gulp.task( 'imagemin', function() {
  gulp.src( paths.imgsrc + '/**' )
    .pipe( imagemin() )
    .pipe( gulp.dest( paths.img ) );
});

gulp.task( 'browserSyncReload', function(){
  browserSync.reload();
});
/**
 * Ensures the 'imagemin' task is complete before reloading browsers
 * @verbose
 */
gulp.task( 'imagemin-watch', ['imagemin'], function( ) {
  browserSync.reload();
});

gulp.task( 'minifycss', function() {
  return gulp.src( paths.css + '/child-theme.css' )
    .pipe(purgecss({ content: ['./**/*.twig', './js/*.js', '../../core/themes/classy/templates/**/*.twig'] }))
    .pipe( sourcemaps.init( { loadMaps: true } ) )
    .pipe( cleanCSS( { compatibility: '*' } ) )
    .pipe( plumber( {
      errorHandler: function( err ) {
        console.log( err ) ;
        this.emit( 'end' );
      }
    } ) )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( sourcemaps.write( './' ) )
    .pipe( gulp.dest( paths.css ) )
});


gulp.task( 'cleancss', function() {
  return gulp.src( paths.css + '/*.min.css', { read: false } ) // Much faster
    .pipe( ignore( 'child-theme.css' ) )
    .pipe( rimraf() );
});

gulp.task( 'styles', function( callback ) {
  gulpSequence( 'sass', 'minifycss' )( callback );
} );

// Run:
// gulp browser-sync
// Starts browser-sync task for starting the server.
gulp.task( 'browser-sync', function() {
  browserSync.init( cfg.browserSyncWatchFiles, cfg.browserSyncOptions );
} );

// Run:
// gulp watch-bs
// Starts watcher with browser-sync. Browser-sync reloads page automatically on your browser
gulp.task( 'watch-bs', ['browser-sync', 'watch', 'scripts'], function() {
} );

// Run:
// gulp scripts.
// Uglifies and concat all JS files into one
gulp.task( 'scripts', function() {
  var scripts = [

    // Start - All BS4 stuff

    // paths.dev + '/js/bootstrap4/bootstrap.min.js',

    // End - All BS4 stuff

    // Modernizr
    paths.dev + '/js/modernizr.js',

    // Cash stuff
    // paths.dev + '/js/cash.min.js',

    // Siema Slider
    paths.dev + '/js/siema.min.js',

    // Lazy Load
    paths.dev + '/js/lazyload.min.js',

    paths.dev + '/js/skip-link-focus-fix.js',

    // Adding currently empty javascript file to add on for your own themes´ customizations
    // Please add any customizations to this .js file only!
    paths.dev + '/js/custom-javascript.js'
  ];
  gulp.src( scripts )
    .pipe( concat( 'child-theme.min.js' ) )
    .pipe( uglify() )
    .pipe( gulp.dest( paths.js ) );

  gulp.src( scripts )
    .pipe( concat( 'child-theme.js' ) )
    .pipe( gulp.dest( paths.js ) );
});


// Run:
// gulp copy-assets.
gulp.task( 'copy-assets', function() {

  var stream = gulp.src( paths.node + 'cash-dom/dist/cash.min.js' )
    .pipe( gulp.dest( paths.dev + '/js/' ) );

  gulp.src( paths.node + 'siema/dist/siema.min.js' )
    .pipe( gulp.dest( paths.dev + '/js/' ) );

  gulp.src( paths.node + 'vanilla-lazyload/dist/lazyload.min.js' )
    .pipe( gulp.dest( paths.dev + '/js/' ) );

// Copy all Bootstrap SCSS files
  gulp.src( paths.node + 'bootstrap/scss/**/*.scss' )
    .pipe( gulp.dest( paths.dev + '/sass/bootstrap4' ) );

  return stream;
});


