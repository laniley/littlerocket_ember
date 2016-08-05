import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo /*, hasMany*/ } from 'ember-data/relationships';

export default Model.extend({
  quest: belongsTo('quest'),
  action: attr('string'),
  amount: attr('number', { defaultValue: 0 }),
  object: attr('string'),
});
