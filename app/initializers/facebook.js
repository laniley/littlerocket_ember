import FB from 'ember-cli-facebook-js-sdk/fb';

export default {
  name: 'facebook',
  initialize: function() {
    return FB.init({
      appId: '759505040738218',
      version: 'v2.3',
      xfbml: true
    });
  }
};
