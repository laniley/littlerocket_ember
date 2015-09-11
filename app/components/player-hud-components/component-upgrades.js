import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  me: null,
  componentType: '',
  component: null,

  store: function() {
    return this.get('targetObject.store');
  }.property(),

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

  status: function() {
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
