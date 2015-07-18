/* global FB */
import Ember from 'ember';
import ENV from '../config/environment';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Route.extend(FacebookLoginMixin, {

  beforeModel: function() {

    var self = this;

    var fbAsyncInit = function() {

      FB.init({
          appId      : ENV.fb_app_id,
          xfbml      : true,
         version    : 'v2.3'
      });

      self.checkLoginState();
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

     window.fbAsyncInit = fbAsyncInit;
  },

  model: function() {
    var me = this.store.getById('me', 1);

    if(Ember.isEmpty(me)) {
      return this.store.createRecord('me', { id: 1, isLoggedIn: false });
    }
    else {
      return me;
    }
  }

});
