/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({
  me: null,

  actions: {
    sendChallengeRequest: function(long_fb_id) {
      FB.ui({method: 'apprequests',
        message: 'I want to challenge you in Little Rocket! Can you beat me?',
        to: long_fb_id
      }, function(response){
          console.log(response);
      });
    }
  }
});
