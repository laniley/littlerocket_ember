import Model from 'ember-data/model';
// import attr from 'ember-data/attr';
import { /*belongsTo,*/ hasMany } from 'ember-data/relationships';

export default Model.extend({
  user_quests: hasMany('user-quest'),
  quest_fulfillment_conditions: hasMany('quest-fulfillment-condition'),
  quest_rewards: hasMany('quest-reward')
});
