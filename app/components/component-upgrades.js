import Ember from 'ember';

export default Ember.Component.extend({
  componentType: '',
  component: null,

  models: function() {

    var store = this.get('targetObject.store');

    if(this.get('componentType') === 'canon') {
      return DS.PromiseArray.create({
        promise: store.findAll('canon-model').then(models => {
          return models;
        })
      });
    }
    else if(this.get('componentType') === 'shield') {
      return DS.PromiseArray.create({
        promise: store.findAll('shield-model').then(models => {
          return models;
        })
      });
    }
    else if(this.get('componentType') === 'engine') {
      return DS.PromiseArray.create({
        promise: store.findAll('engine-model').then(models => {
          return models;
        })
      });
    }
  }.property()
});
