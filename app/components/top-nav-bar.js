/* global FB */
import Ember from 'ember';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Component.extend(FacebookLoginMixin, {

  store: null,

  didInsertElement: function() {
    Ember.$(document).foundation();
    this.set('store', this.get('targetObject.store'));
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
