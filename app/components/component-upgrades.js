import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  componentType: '',
  component: null,

  componentModels: function() {
    var store = this.get('targetObject.store');

    return store.query('rocket-component-model-mm', {
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
  }.property(),

  models: function() {

    var store = this.get('targetObject.store');

    return DS.PromiseArray.create({
      promise: store.query('rocket-component-model', { 'type': this.get('componentType') }).then(models => {
        return this.get('componentModels').then(componentModels => {
          return this.get('selectedModel').then(selectedModel => {
            var array = [];
            models.forEach(function(aModel) {
              var status = 'locked';
              componentModels.forEach(function(aComponentModel) {
                if(aComponentModel.get('rocketComponentModel').get('id') === aModel.get('id')) {
                  status = aComponentModel.get('status');
                }
              });
              var isSelected = false;
              if(aModel.get('id') === selectedModel.get('id')) {
                isSelected = true;
              }
              var model = {
                model: aModel.get('model'),
                costs: aModel.get('costs'),
                tooltip: "You need " + aModel.get('costs') + " stars to unlock this canon model.",
                status: status,
                isSelected: isSelected
              };
              array.push(model);
            });
            return array;
          });
        });
      })
    });

  }.property(),

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
  }.property()
});
