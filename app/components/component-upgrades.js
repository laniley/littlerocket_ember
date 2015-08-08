import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  componentType: '',
  component: null,

  myModels: function() {

    var store = this.get('targetObject.store');

    if(this.get('componentType') === 'canon') {
      return store.query('canon-model-mm', {
        'canon': this.get('component').get('id')
      }).then(models => {
        return models;
      });
    }
    else if(this.get('componentType') === 'shield') {
      return store.query('shield-model-mm', {
        'shield': this.get('component').get('id')
      }).then(models => {
        return models;
      });
    }
    else if(this.get('componentType') === 'engine') {
      return store.query('engine-model-mm', {
        'engine': this.get('component').get('id')
      }).then(models => {
        return models;
      });
    }
  }.property(),

  selectedModel: function() {
    if(this.get('componentType') === 'canon') {
      return this.get('component').get('selectedCanonModelMm').then(selectedCanonModelMm => {
        return selectedCanonModelMm.get('canonModel').then(canonModel => {
          return canonModel;
        });
      });
    }
    else if(this.get('componentType') === 'shield') {
      return this.get('component').get('selectedShieldModelMm').then(selectedShieldModelMm => {
        return selectedShieldModelMm.get('shieldModel').then(shieldModel => {
          return shieldModel;
        });
      });
    }
    else if(this.get('componentType') === 'engine') {
      return this.get('component').get('selectedEngineModelMm').then(selectedEngineModelMm => {
        return selectedEngineModelMm.get('shieldModel').then(engineModel => {
          return engineModel;
        });
      });
    }
  }.property(),

  models: function() {

    var store = this.get('targetObject.store');

    if(this.get('componentType') === 'canon') {
      return DS.PromiseArray.create({
        promise: store.findAll('canon-model').then(models => {
          return this.get('myModels').then(myModels => {
            return this.get('selectedModel').then(selectedModel => {
              var array = [];
              models.forEach(function(aModel) {
                var status = 'locked';
                myModels.forEach(function(aMyModel) {
                  if(aMyModel.get('canonModel').get('id') === aModel.get('id')) {
                    status = aMyModel.get('status');
                  }
                });
                var isSelected = false;

                if(aModel.get('id') === selectedModel.get('id')) {
                  isSelected = true;
                  console.log(selectedModel.get('id'), 'true');
                }
                var model = {
                  model: aModel.get('model'),
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
    }
    else if(this.get('componentType') === 'shield') {
      return DS.PromiseArray.create({
        promise: store.findAll('shield-model').then(models => {
          return this.get('myModels').then(myModels => {
            var array = [];
            models.forEach(function(aModel) {
              var status = 'locked';
              myModels.forEach(function(aMyModel) {
                if(aMyModel.get('shieldModel').get('id') === aModel.get('id')) {
                  status = aMyModel.get('status');
                }
              });
              var model = {
                model: aModel.get('model'),
                status: status
              };
              array.push(model);
            });
            return array;
          });
        })
      });
    }
    else if(this.get('componentType') === 'engine') {
      return DS.PromiseArray.create({
        promise: store.findAll('engine-model').then(models => {
          return this.get('myModels').then(myModels => {
            var array = [];
            models.forEach(function(aModel) {
              var status = 'locked';
              myModels.forEach(function(aMyModel) {
                if(aMyModel.get('engineModel').get('id') === aModel.get('id')) {
                  status = aMyModel.get('status');
                }
              });
              var model = {
                model: aModel.get('model'),
                status: status
              };
              array.push(model);
            });
            return array;
          });
        })
      });
    }
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
