import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
    rocket: belongsTo('rocket', { async: true, inverse: null }),
    rocketComponentType: belongsTo('rocket-component-type', { async: true }),
    construction_start: attr('number', { defaultValue: 0 }),
    status: attr('String', { defaultValue: 'locked' }),
    selectedRocketComponentModelMm: belongsTo('rocket-component-model-mm', { async: true }),
    rocketComponentModelMms: hasMany('rocket-component-model-mm', { async: true }),

    currentValue: attr('number', { defaultValue: 0 }),
    isReloading: attr('boolean', { defaultValue: false }),

    tooltip: function() {
        return "You need " + this.get('costs') + " stars to unlock the " + this.get('type') + "!";
    }.property('costs')
});
