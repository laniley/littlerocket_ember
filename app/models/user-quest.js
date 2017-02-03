import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo/*, hasMany */ } from 'ember-data/relationships';

export default Model.extend({
  user: belongsTo('user'),
  quest: belongsTo('quest'),

  is_unlocked: attr('boolean', { defaultValue: false }),
  is_completed: attr('boolean', { defaultValue: false }),

  current_amount: attr('number', { defaultValue: 0 })
});
