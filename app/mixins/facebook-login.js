import Ember from 'ember';

export default Ember.Mixin.create({
  checkLoginState: function() {
    FB.getLoginStatus(response => {
        this.statusChangeCallback(response);
    });
  }
});
