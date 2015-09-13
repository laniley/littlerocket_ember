import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  me: null,
  componentType: '',
  component: null,
  show_not_enough_stars_alert: false,
  not_enough_stars: false,
  level_not_reached: false,
  needed_level: 0,
  needed_stars: 0,

  store: function() {
    return this.get('targetObject.store');
  }.property(),

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
  }.property('not_enough_stars', 'level_not_reached', 'needed_stars', 'needed_level'),

  selectedRocketComponentModelMm: function() {
    return this.get('component').get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
      return selectedRocketComponentModelMm;
    });
  }.property('component.selectedRocketComponentModelMm'),

  myComponentModelMms: function() {
    return DS.PromiseArray.create({
      promise: this.get('component').then(component => {
        return component.get('rocketComponentModelMms').then(rocketComponentModelMms => {
          return this.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
            rocketComponentModelMms.forEach(rocketComponentModelMm => {
              if(selectedRocketComponentModelMm.get('id') === rocketComponentModelMm.get('id')) {
                rocketComponentModelMm.set('isSelected', true);
              }
              else {
                rocketComponentModelMm.set('isSelected', false);
              }
            });
            return rocketComponentModelMms;
          });
        });
      })
    });
  }.property('component', 'component.status','component.rocketComponentModelMms', 'selectedRocketComponentModelMm'),

  icon: function() {
    if(this.get('componentType') === 'canon') {
      return "fa-bullseye";
    }
    else if(this.get('componentType') === 'shield') {
      return "fa-shield";
    }
    else if(this.get('componentType') === 'engine') {
      return "fa-forward";
    }
  }.property(),

  actions: {
    buyComponent: function(component) {
      if(component.get('type') === 'canon') {
        this.get('targetObject').send('buyCanon', component);
      }
      else if(component.get('type') === 'shield') {
        this.get('targetObject').send('buyShield', component);
      }
      else if(component.get('type') === 'engine') {
        this.get('targetObject').send('buyEngine', component);
      }
    },
    buyComponentModelMm: function(componentModelMm) {
      this.get('targetObject.me').get('user').then(user => {
        componentModelMm.get('rocketComponentModel').then(componentModel => {
          if(user.get('stars') >= componentModel.get('costs')) {
            var now = Math.floor(new Date().getTime() / 1000); // current timestamp in seconds
            componentModelMm.set('construction_start', now);
            componentModelMm.set('status', 'under_construction');
            componentModelMm.save().then(() => {
              user.set('stars', user.get('stars') - componentModel.get('costs'));
              user.save();
            });
          }
          else {
            this.set('not_enough_stars', true);
            this.set('needed_stars', componentModel.get('costs'));
            this.set('show_not_enough_stars_alert', true);
          }
        });
      });
    },
    selectComponentModelMm: function(componentModelMm) {
      componentModelMm.get('rocketComponent').then(rocketComponent => {
        rocketComponent.set('selectedRocketComponentModelMm', componentModelMm);
        rocketComponent.save();
      });
    }
  }
});
