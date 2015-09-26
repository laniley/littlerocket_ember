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
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' cdn.lfstmedia.com ads.lfstmedia.com www.google-analytics.com use.typekit.net connect.facebook.net facebook.com graph.facebook.com",
      'font-src': "'self' data: use.typekit.net fonts.gstatic.com",
      'connect-src': "'self' localhost:8000 littlerocket-game.com connect.facebook.net",
      'img-src': "'self' ads.lfstmedia.com cdn.lfstmedia.com *.xx.fbcdn.net www.google-analytics.com www.paypalobjects.com fbstatic-a.akamaihd.net graph.facebook.com www.facebook.com p.typekit.net fbcdn-profile-a.akamaihd.net csi.gstatic.com mt.googleapis.com",
      'style-src': "'self' 'unsafe-inline' use.typekit.net fonts.googleapis.com",
      'frame-src': "localhost:4200 littlerocket-game.com cdn.lfstmedia.com ads.lfstmedia.com s-static.ak.facebook.com static.ak.facebook.com www.facebook.com admin.appnext.com",
      'report-uri': '/_/csp-reports'
    }
  };

  ENV.backend_namespace = 'api/v1';

  if (environment === 'development') {
    ENV.backend_url = 'http://localhost:8000';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.fb_app_id = '964330650255655';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.fb_app_id = '964330650255655';
  }

  if (environment === 'production') {
    ENV.backend_url = 'https://littlerocket-game.com';
    ENV.fb_app_id = '759505040738218';
  }

  return ENV;
};
