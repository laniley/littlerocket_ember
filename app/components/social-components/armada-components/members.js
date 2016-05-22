/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({

  userInEditMode: null,

  actions: {
    edit(user) {
      this.set('userInEditMode', user);
    },
    save(user) {
      user.set('armada_rank', Ember.$('#armada_rank').val());
      user.save().then(() => {
        this.set('userInEditMode', null);
      });
    },
    recruit() {
      FB.ui({
        method: 'apprequests',
        message: 'Come and join my Armada! Help me fight my enemies',
        exclude_ids: []
      }, function(response){
        console.log(response);
        //request
        //to[index]
      });
    }
  }
});
