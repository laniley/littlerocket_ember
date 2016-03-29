import DS from 'ember-data';

export default DS.Model.extend({
  costs: DS.attr('number', { defaultValue: 1000 }),
  construction_time: DS.attr('number', { defaultValue: 240 }),
  construction_start: DS.attr('number', { defaultValue: 0 }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  user: DS.belongsTo('user', { async: true }),

  tooltip: function() {
    return "You need " + this.get('costs') + " stars and exp. level 3 to unlock the lab!";
  }.property('costs')
});
