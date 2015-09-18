import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({

  me: null,
  myComponentModelMm: null,

  modelIsUnlocked: function() {
    if(this.get('myComponentModelMm').get('status') === 'unlocked') {
      return true;
    }
    else {
      return false;
    }
  }.property('myComponentModelMm.status')
});
