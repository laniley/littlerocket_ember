/* global FB */
import Ember from 'ember';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Component.extend(FacebookLoginMixin, {

  store: null,
  scope: 'public_profile,publish_actions,user_friends',

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
    }
  }
});
