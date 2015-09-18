import DS from 'ember-data';

export default DS.Model.extend({
  rocketComponentModelMm: DS.belongsTo('rocket-component-model-mm', { async:true, inverse: 'rocketComponentModelLevelMms' }),
  rocketComponentModelLevel: DS.belongsTo('rocket-component-model-level', { async:true }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  construction_start: DS.attr('number', { defaultValue: 0 }),
  isSelected: DS.attr('boolean', { defaultValue: false }),

  tooltip: function() {
    return DS.PromiseObject.create({
      promise: this.get('rocketComponentModelLevel').then(rocketComponentModelLevel => {
        return "Unlock for " + rocketComponentModelLevel.get('costs') + " stars!";
      })
    });
  }.property('rocketComponentModelLevel.costs')
});
