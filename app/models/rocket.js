import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', { async: true }),
  cannon: DS.belongsTo('rocket-component', { async: true }),
  shield: DS.belongsTo('rocket-component', { async: true }),
  engine: DS.belongsTo('rocket-component', { async: true }),

  hasAShield: function() {
    if(!Ember.isEmpty(this.get('shield'))) {
      return true;
    }
    else {
      return false;
    }
  }.property('shield'),

  hasASpecialEngine: function() {
    if(!Ember.isEmpty(this.get('engine'))) {
      return true;
    }
    else {
      return false;
    }
  }.property('engine')
});
