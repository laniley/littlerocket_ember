import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  componentType: '',
  component: null,

  store: function() {
    return this.get('targetObject.store');
  }.property(),

  allComponentModels: function() {
    return this.get('targetObject.store').query('rocket-component-model', { 'type': this.get('componentType') }).then(models => {
      return models;
    });
  }.property(),

  myComponentModels: function() {
    return this.get('targetObject.store').query('rocket-component-model-mm', {
      'rocketComponent': this.get('component').get('id')
    }).then(models => {
      return models;
    });
  }.property(),

  selectedModel: function() {
    return this.get('component').get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
      return selectedRocketComponentModelMm.get('rocketComponentModel').then(rocketComponentModel => {
        return rocketComponentModel;
      });
    });
  }.property('component.selectedRocketComponentModelMm'),

  preparedModels: function() {
    return DS.PromiseArray.create({
      promise: this.get('allComponentModels').then(models => {
        return this.get('myComponentModels').then(componentModels => {
          return this.get('selectedModel').then(selectedModel => {
            return models.map(aModel => {
              var status = 'locked';
              var construction_start = 0;
              var construction_time = 0;
              var reference = null;
              componentModels.forEach(aComponentModel => {
                if(aComponentModel.get('rocketComponentModel').get('id') === aModel.get('id')) {
                  status = aComponentModel.get('status');
                  construction_start = aComponentModel.get('construction_start');
                  construction_time = aModel.get('construction_time');
                  reference = aComponentModel;
                }
              });
              return {
                id: aModel.get('id'),
                model: aModel.get('model'),
                costs: aModel.get('costs'),
                tooltip: "You need " + aModel.get('costs') + " stars to unlock this canon model.",
                status: status,
                isSelected: aModel.get('id') === selectedModel.get('id'),
                construction_start: construction_start,
                construction_time: construction_time,
                reference: reference
              };
            });
          });
        });
      })
    });
  }.property('selectedModel'),

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

  loadRocketComponentModelCapacityLevelMM: function(rocketComponentModelMm) {
    rocketComponentModelMm.get('rocketComponentModelCapacityLevelMm').then(rocketComponentModelCapacityLevelMm => {
      if(Ember.isEmpty(rocketComponentModelCapacityLevelMm)) {
        this.setRocketComponentModelCapacityLevelMM(1, rocketComponentModelMm);
      }
    });
  },

  setRocketComponentModelCapacityLevelMM: function(level, rocketComponentModelMm) {
    rocketComponentModelMm.get('rocketComponentModel').then(rocketComponentModel => {
      this.get('targetObject.store').query('rocketComponentModelLevel', {
        type: 'capacity',
        level: 1,
        rocketComponentModel: rocketComponentModel.get('id')
      }).then(rocketComponentModelCapacityLevels => {
        this.get('targetObject.store').query('rocketComponentModelLevelMm', {
          rocketComponentModelMm: rocketComponentModelMm.get('id'),
          rocketComponentModelLevel: rocketComponentModelCapacityLevels.get('firstObject').get('id')
        }).then(rocketComponentModelCapacityLevelMms => {

          var rocketComponentModelCapacityLevelMm = {};

          if(Ember.isEmpty(rocketComponentModelCapacityLevelMms)) {
            rocketComponentModelCapacityLevelMm = this.get('targetObject.store').createRecord('rocket-component-model-level-mm', {
               rocketComponentModelMm: rocketComponentModelMm,
               rocketComponentModelLevel: rocketComponentModelCapacityLevels.get('firstObject'),
               construction_start: 0,
               status: 'unlocked'
            });

            rocketComponentModelCapacityLevelMm.save().then(rocketComponentModelCapacityLevelMm => {
               rocketComponentModelMm.set('rocketComponentModelCapacityLevelMm', rocketComponentModelCapacityLevelMm);
               rocketComponentModelMm.save();
            });
          }
          else {
            rocketComponentModelCapacityLevelMm = rocketComponentModelCapacityLevelMms.get('firstObject');
            rocketComponentModelMm.set('rocketComponentModelCapacityLevelMm', rocketComponentModelCapacityLevelMm);
            rocketComponentModelMm.save();
          }
        });
      });
    });
  },

  loadRocketComponentModelRechargeRateLevelMM: function(rocketComponentModelMm) {
    rocketComponentModelMm.get('rocketComponentModelRechargeRateLevelMm').then(rocketComponentModelRechargeRateLevelMm => {
      if(Ember.isEmpty(rocketComponentModelRechargeRateLevelMm)) {
        this.setRocketComponentModelRechargeRateLevelMM(1, rocketComponentModelMm);
      }
    });
  },

  setRocketComponentModelRechargeRateLevelMM: function(level, rocketComponentModelMm) {
    rocketComponentModelMm.get('rocketComponentModel').then(rocketComponentModel => {
      this.get('targetObject.store').query('rocketComponentModelLevel', {
        type: 'recharge_rate',
        level: 1,
        rocketComponentModel: rocketComponentModel.get('id')
      }).then(rocketComponentModelRechargeRateLevels => {
        this.get('targetObject.store').query('rocketComponentModelLevelMm', {
          rocketComponentModelMm: rocketComponentModelMm.get('id'),
          rocketComponentModelLevel: rocketComponentModelRechargeRateLevels.get('firstObject').get('id')
        }).then(rocketComponentModelRechargeRateLevelMms => {

          var rocketComponentModelRechargeRateLevelMm = {};

          if(Ember.isEmpty(rocketComponentModelRechargeRateLevelMms)) {
            rocketComponentModelRechargeRateLevelMm = this.get('targetObject.store').createRecord('rocket-component-model-level-mm', {
               rocketComponentModelMm: rocketComponentModelMm,
               rocketComponentModelLevel: rocketComponentModelRechargeRateLevels.get('firstObject'),
               construction_start: 0,
               status: 'unlocked'
            });

            rocketComponentModelRechargeRateLevelMm.save().then(rocketComponentModelRechargeRateLevelMm => {
               rocketComponentModelMm.set('rocketComponentModelRechargeRateLevelMm', rocketComponentModelRechargeRateLevelMm);
               rocketComponentModelMm.save();
            });
          }
          else {
            rocketComponentModelRechargeRateLevelMm = rocketComponentModelRechargeRateLevelMms.get('firstObject');
            rocketComponentModelMm.set('rocketComponentModelRechargeRateLevelMm', rocketComponentModelRechargeRateLevelMm);
            rocketComponentModelMm.save();
          }
        });
      });
    });
  },

  buyComponentModelCallback: function(user, componentModelMm, costs) {
    this.loadRocketComponentModelCapacityLevelMM(componentModelMm);
    this.loadRocketComponentModelRechargeRateLevelMM(componentModelMm);
    var now = Math.floor(new Date().getTime() / 1000); // current timestamp in seconds
    componentModelMm.set('construction_start', now);
    componentModelMm.set('status', 'under_construction');
    componentModelMm.save().then(() => {
      user.set('stars', user.get('stars') - costs);
      user.save();
    });
  },

  actions: {
    buyComponentModel: function(componentModel) {
      var me = this.get('targetObject.me');
      me.get('user').then(user => {
        if(user.get('stars') >= componentModel.costs) {
          this.get('targetObject.store').query(
            'rocket-component-model-mm', {
              'rocketComponent': this.get('component').get('id'),
              'rocketComponentModel': componentModel.id
            }
          ).then(componentModelMms => {
            if(Ember.isEmpty(componentModelMms)) {
              this.get('targetObject.store').find('rocketComponentModel', componentModel.id).then(componentModel => {
                var componentModelMm = this.get('targetObject.store').createRecord('rocket-component-model-mm', {
                  rocketComponent: this.get('component'),
                  rocketComponentModel: componentModel
                });
                componentModelMm.save().then(componentModelMm => {
                  this.buyComponentModelCallback(user, componentModelMm, componentModel.costs);
                });
              });
            }
            else {
              this.buyComponentModelCallback(user, componentModelMms.get('firstObject'), componentModel.costs);
            }
          });
        }
        else {
          this.set('show_not_enough_stars_alert', true);
        }
      });
    },
    selectComponentModel: function(componentModel) {
      // var me = this.get('targetObject.me');
      // me.get('user').then(user => {
        this.get('targetObject.store').query(
          'rocket-component-model-mm', {
            'rocketComponent': this.get('component').get('id'),
            'rocketComponentModel': componentModel.id
          }
        ).then(componentModelMms => {
          this.get('targetObject.store').find('rocketComponent', this.get('component').get('id')).then(rocketComponent => {
            rocketComponent.set('selectedRocketComponentModelMm', componentModelMms.get('firstObject'));
            rocketComponent.save();
          });
        });
      // });
    }
  }
});
