import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo /*, hasMany*/ } from 'ember-data/relationships';

export default Model.extend({
  from_user: belongsTo('user', { inverse: 'messages_send' }),
  to_user: belongsTo('user', { inverse: 'messages_received' }),
  type: attr('string'),

  delete() {
    this.destroyRecord();
  }
});
