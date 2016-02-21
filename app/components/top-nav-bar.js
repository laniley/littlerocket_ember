/* global FB */
import Ember from 'ember';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Component.extend(FacebookLoginMixin, {

  didRender: function() {
    Ember.$(document).foundation();
  },

  actions: {
    login: function() {
      this.login();
    },
    inviteFriends: function() {
      FB.ui ({
       method: 'apprequests',
       message: 'Little Rocket is great fun! Just fly as far as you can!',
       filters: ['app_non_users']
      });
    }
  }
});
