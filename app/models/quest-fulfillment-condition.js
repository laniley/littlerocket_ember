import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo /*, hasMany*/ } from 'ember-data/relationships';

export default Model.extend({
  quest: belongsTo('quest'),
  fulfillment_condition_type: belongsTo('quest-fulfillment-condition-type'),
  fulfillment_amount: attr('number', { defaultValue: 0 })
});
