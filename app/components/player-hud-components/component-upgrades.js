import Ember from 'ember';
import DS from 'ember-data';
import ObjectMixin from './../../mixins/buyable-object';

export default Ember.Component.extend(ObjectMixin, {
  me: null,
  componentType: '',
  component: null,

  selectedRocketComponentModelMm: function() {
    return this.get('component').get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
      return selectedRocketComponentModelMm;
    });
  }.property('component.selectedRocketComponentModelMm'),

  mySortedComponentModelMms: function() {
    return this.get('component').then(component => {
      return component.get('rocketComponentModelMms').then(rocketComponentModelMms => {
        return Ember.RSVP.map(rocketComponentModelMms.toArray(), rocketComponentModelMm => {
          return rocketComponentModelMm.get('rocketComponentModel').then(rocketComponentModel => {
            return rocketComponentModel;
          });
        }).then(rocketComponentModels => {
          return rocketComponentModels.sortBy('model').map(sortedRocketComponentModel => {
            return Ember.RSVP.filter(rocketComponentModelMms.toArray(), rocketComponentModelMm => {
              return rocketComponentModelMm.get('rocketComponentModel').then(rocketComponentModel => {
                return Ember.isEqual(sortedRocketComponentModel, rocketComponentModel);
              });
            }).then(foundRocketComponentModelMmArray => {
              return foundRocketComponentModelMmArray.get('firstObject');
            });
          });
        });
      });
    });
  }.property('component', 'component.status','component.rocketComponentModelMms.[]'),

  myComponentModelMms: function() {
    return DS.PromiseObject.create({
      promise: this.get('mySortedComponentModelMms').then(rocketComponentModelMms => {
        return this.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
          return Ember.RSVP.all([rocketComponentModelMms]).then(result => {
            var resolvedRocketComponentModelMms = result[0];
            var preparedRocketComponentModelMms = [];
            resolvedRocketComponentModelMms.forEach(rocketComponentModelMmPromise => {
              var rocketComponentModelMm = rocketComponentModelMmPromise["_result"]._internalModel.record;
              if(Ember.isEqual(selectedRocketComponentModelMm, rocketComponentModelMm)) {
                rocketComponentModelMm.set('isSelected', true);
              }
              else {
                rocketComponentModelMm.set('isSelected', false);
              }
              preparedRocketComponentModelMms.push(rocketComponentModelMm);
            });
            return preparedRocketComponentModelMms;
          });
        });
      })
    });
  }.property('mySortedComponentModelMms.[]', 'selectedRocketComponentModelMm'),

  actions: {
    buyComponent: function(component) {
      if(component.get('type') === 'cannon') {
        this.get('targetObject').send('buyCannon', component);
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
            this.set('show_missing_requirements_message', true);
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
