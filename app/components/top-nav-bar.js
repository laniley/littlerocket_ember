/* global FB */
import Ember from 'ember';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Component.extend(FacebookLoginMixin, {

  store: null,
  scope: 'public_profile,email,user_friends,publish_actions',

  didInsertElement: function() {
    Ember.$(document).foundation();
    this.store = this.get('targetObject.store');
  },

  actions: {
    login: function() {
      var self = this;
      FB.login(function() {
        self.checkLoginState();
      }, { scope: self.get('scope') });
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
