import Ember from 'ember';

export default Ember.Component.extend({
  me: null,
  currentSection: 'rocket',
  currentCockpitSection: 'workbench',
  currentLabSection: 'cannon',
  show_not_enough_stars_alert: false,
  not_enough_stars: false,
  level_not_reached: false,
  needed_level: 0,
  needed_stars: 0,

  missing_requirements_message: function() {

    var text = 'You need ';

    if(this.get('not_enough_stars')) {
      text += this.get('needed_stars') + ' stars';
      if(this.get('level_not_reached')) {
        text += ' and';
      }
    }

    if(this.get('level_not_reached')) {
      text += ' to reach level ' + this.get('needed_level');
    }

    text += '!';

    return text;

  }.property('not_enough_stars', 'level_not_reached'),

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
      this.set('needed_stars', component.get('costs'));
      this.set('not_enough_stars', true);
      this.set('show_not_enough_stars_alert', true);
    }
  },

  actions: {
    buyLab: function() {
      var me = this.get('targetObject.store').peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('lab').then(component => {
          this.set('level_not_reached', false);
          this.set('not_enough_stars', false);
          if(user.get('exp_level') >= 3) {
            this.buyComponent(user, component);
          }
          else {
            this.set('needed_level', 3);
            this.set('level_not_reached', true);
            this.set('show_not_enough_stars_alert', true);
          }
        });
      });
    },
    buyCannon: function() {
      var me = this.get('targetObject.store').peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('rocket').then(rocket => {
          rocket.get('cannon').then(component => {
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
