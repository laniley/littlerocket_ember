import FB from 'ember-cli-facebook-js-sdk/fb';
import ENV from '../config/environment';

export function initialize(/* container, application */) {
  // application.inject('route', 'foo', 'service:foo');
}

export default {
  name: 'facebook',
  initialize: function() {
    return FB.init({
      appId: ENV.fb_app_id,
      version: 'v2.3',
      xfbml: true
    });
  }
};
