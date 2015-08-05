import Ember from 'ember';

export default Ember.Component.extend({

  me: null,
  currentSection: 'workbench',
  show_not_enough_stars_alert: false,

  store: function() {
    return this.get('targetObject.store');
  }.property(),

  user: function() {
    return this.get('me').get('user');
  }.property('me.user'),

  rocket: function() {
    var user = this.get('user');
    if(!Ember.isEmpty(user)) {
      return user.get('rocket');
    }
    else {
      return null;
    }
  }.property('user.rocket'),

  canon: function() {
    var rocket = this.get('rocket');
    if(!Ember.isEmpty(rocket)) {
      return rocket.get('canon');
    }
    else {
      return null;
    }
  }.property('rocket.canon'),

  canon_capacity: function() {
    var canon = this.get('canon');
    if(!Ember.isEmpty(canon) && canon.get('status') === 'unlocked') {
      return canon.get('capacity');
    }
    else {
      return 0;
    }
  }.property('canon.status', 'canon.capacity'),

  canon_bps: function() {
    var canon = this.get('canon');
    if(!Ember.isEmpty(canon) && canon.get('status') === 'unlocked') {
      return canon.get('bps');
    }
    else {
      return 0;
    }
  }.property('user.rocket.canon.status', 'user.rocket.canon.bps'),

  canon_tooltip: function() {
    return    "<u><b>Canon</b></u><br />Max. Ammo: " +
              this.get('me').get('user').get('rocket').get('canon').get('capacity') +
              "<br />BPS (Bullets per second): " +
              this.get('me').get('user').get('rocket').get('canon').get('bps');
  }.property('me.user.rocket.canon.capacity'),

  buyComponent: function(user, component) {
    if(user.get('stars') >= component.get('costs')) {

      var now = Math.floor(new Date().getTime() / 1000); // current timestamp in seconds

      component.set('status', 'under_construction');
      component.set('construction_start', now);
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
    buyDrive: function() {
      console.log('buyDrive');
      // var me = this.get('targetObject.store').peekRecord('me', 1);
      // me.get('user').then(user => {
      //   user.get('rocket').then(rocket => {
      //     rocket.get('shield').then(component => {
      //       this.buyComponent(user, component);
      //     });
      //   });
      // });
    },
    buyLab: function() {
      var me = this.get('targetObject.store').peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('lab').then(component => {
          this.buyComponent(user, component);
        });
      });
    }
  }
});
