import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('String'),
  model: DS.attr('number'),
  costs: DS.attr('number', { defaultValue: 500 }),
  construction_time: DS.attr('number', { defaultValue: 120 }),

  tooltip: function() {
    return "You need " + this.get('costs') + " stars to unlock this " + this.get('type') + " model.";
  }.property('costs', 'type')
});
