/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
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
