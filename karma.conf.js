module.exports = function(config) {
  config.set({
    browserNoActivityTimeout: 20000,
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: [
      // vendor files
      'bower_components/moment/moment.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/lodash/dist/lodash.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/snapjs/snap.js',
      'bower_components/angular-snap/angular-snap.js',
      'bower_components/spin.js/spin.js',
      'bower_components/angular-spinner/dist/angular-spinner.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
      'bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.templates.js',

      //src files
      'dist/app.js',
      'dist/**/*.js',

      //spec files
      'src/**/*.spec.js',
    ],
    exclude: [
      'dist/bower_components/**/*',
    ],
    //add reporters
    reporters: [
      'coverage',
      'spec',
    ],
    // coverage reporter config
    coverageReporter: {
      reporters: [
        { type: 'html' },
        { type: 'lcov' },
        { type: 'cobertura' },
        { type: 'text-summary' },
      ],
      watermarks: {
        statements: [50, 90],
        functions: [50, 90],
        branches: [50, 90],
        lines: [50, 90],
      },
    },
    // spec reporter config
    specReporter: {
      suppressPassed: true,
    },
  });
};
