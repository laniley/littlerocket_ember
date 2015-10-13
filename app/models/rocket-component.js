import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('String'),
  rocket: DS.belongsTo('rocket', { async: true, inverse: null }),
  costs: DS.attr('number', { defaultValue: 500 }),
  construction_time: DS.attr('number', { defaultValue: 240 }),
  construction_start: DS.attr('number', { defaultValue: 0 }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  selectedRocketComponentModelMm: DS.belongsTo('rocket-component-model-mm', { async: true }),
  rocketComponentModelMms: DS.hasMany('rocket-component-model-mm', { async: true }),

  currentValue: DS.attr('number', { defaultValue: 0 }),

  tooltip: function() {
    return "You need " + this.get('costs') + " stars to unlock the " + this.get('type') + "!";
  }.property('costs')
});
