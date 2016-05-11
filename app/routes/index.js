import Ember from 'ember';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Route.extend(FacebookLoginMixin, {
  // 
  // beforeModel: function() {
  //   this.getUserDataFromFB(this.get('store'));
  //
  //   this.checkLoginState(
  //     // on success
  //     () => {
  //       // this.getUserDataFromFB(this.get('store'));
  //       this.transitionTo('index');
  //     },
  //     // on failure
  //     () => {
  //       this.transitionTo('login');
  //     }
  //   );
  // },

  model: function() {
    var me = this.store.peekRecord('me', 1);

    if(Ember.isEmpty(me)) {
      return this.store.createRecord('me', { id: 1, isLoggedIn: false });
    }
    else {
      return me;
    }
  }

});
