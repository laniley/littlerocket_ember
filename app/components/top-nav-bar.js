/* global FB */
import Ember from 'ember';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Component.extend(FacebookLoginMixin, {

  didRender: function() {
    Ember.$(document).foundation();
  },

  actions: {
    login: function() {
      this.login(
        // on success
        () => {
          this.get('router').transitionTo('/');
        },
        // on failure
        () => {
          this.get('router').transitionTo('login');
        }
      );
    },
    logout: function() {
      this.logout(() => {
        // on success
        this.get('router').transitionTo('login');
      });
    },
    invite() {
      FB.ui({
        method: 'apprequests',
        message: 'Come and play Little Rocket with me!',
        filters: ['app_non_users']
      }, function(response){
        console.log(response);
        //request
        //to[index]
      });
    }
  }
});
