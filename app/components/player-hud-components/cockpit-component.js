import Ember from 'ember';

export default Ember.Component.extend({

  me: null,
  show_not_enough_stars_alert: false,

  store: function() {
    return this.get('targetObject.store');
  }.property(),

  buyComponent: function(user, component) {
    if(user.get('stars') >= component.get('costs')) {

      var now = Math.floor(new Date().getTime() / 1000); // current timestamp in seconds

      component.set('construction_start', now);
      component.set('status', 'under_construction');
      component.save().then(component => {
        user.set('stars', user.get('stars') - component.get('costs'));
        user.save();
      });
    }
    else {
      this.set('show_not_enough_stars_alert', true);
    }
  },

  actions: {
    buyCanon: function() {
      var me = this.get('targetObject.store').peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('rocket').then(rocket => {
          rocket.get('canon').then(component => {
            this.buyComponent(user, component);
          });
        });
      });
    },
    buyShield: function() {
      var me = this.get('targetObject.store').peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('rocket').then(rocket => {
          rocket.get('shield').then(component => {
            this.buyComponent(user, component);
          });
        });
      });
    },
    buyEngine: function() {
      var me = this.get('targetObject.store').peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('rocket').then(rocket => {
          rocket.get('engine').then(component => {
            this.buyComponent(user, component);
          });
        });
      });
    }
  }
});