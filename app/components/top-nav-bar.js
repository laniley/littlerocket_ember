import Ember from 'ember';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Component.extend(FacebookLoginMixin, {

  didRender: function() {
    Ember.$(document).foundation();
  },

  actions: {
    login: function() {
      this.login();
    }
  }
});
