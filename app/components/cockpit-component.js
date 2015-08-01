import Ember from 'ember';

export default Ember.Component.extend({
  me: null,

  canon_tooltip: function() {
    return    "<u><b>Canon</b></u><br />Max. Ammo: " + 
              this.get('me').get('user').get('rocket').get('canon').get('capacity') +
              "<br />BPS (Bullets per second): " +
              this.get('me').get('user').get('rocket').get('canon').get('bps');
  }.property('me.user.rocket.canon.capacity'),

  actions: {
    buyCanon: function() {

      var me = this.get('targetObject.store').peekRecord('me', 1);

      me.get('user').then(user => {
        user.get('rocket').then(rocket => {
          rocket.get('canon').then(component => {
            if(user.get('stars') >= component.get('costs')) {

              var now = Math.floor(new Date().getTime() / 1000); // current timestamp in seconds

              component.set('status', 'under_construction');
              component.set('construction_start', now);
              component.save().then(component => {
                user.set('stars', user.get('stars') - component.get('costs'));
                user.save();
              });
          	}
          });
        });
      });

    }
  }
});
