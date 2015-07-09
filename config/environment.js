/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'littlerocket',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    // for the FB-SDK
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' use.typekit.net connect.facebook.net facebook.com graph.facebook.com maps.googleapis.com maps.gstatic.com mt0.googleapis.com mt1.googleapis.com http://www.google-analytics.com/analytics.js",
      'font-src': "'self' data: use.typekit.net fonts.gstatic.com",
      'connect-src': "'self' localhost:8000",
      'img-src': "'self' www.paypalobjects.com graph.facebook.com www.facebook.com p.typekit.net fbcdn-profile-a.akamaihd.net maps.gstatic.com mt0.googleapis.com mt1.googleapis.com maps.googleapis.com csi.gstatic.com mt.googleapis.com",
      'style-src': "'self' 'unsafe-inline' use.typekit.net fonts.googleapis.com",
      'frame-src': "s-static.ak.facebook.com static.ak.facebook.com www.facebook.com admin.appnext.com",
      'report-uri': '/_/csp-reports'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.fb_app_id = 964330650255655;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.fb_app_id = 964330650255655;
  }

  if (environment === 'production') {
    ENV.fb_app_id = 759505040738218;
  }

  return ENV;
};
