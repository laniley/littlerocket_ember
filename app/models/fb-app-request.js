/* global FB */
import DS from 'ember-data';

export default DS.Model.extend({
  fb_request_id: DS.attr('string'),
  type: DS.attr('string'),
  from_user: DS.belongsTo('user', { inverse: 'fb_app_requests_send' }),
  to_user: DS.belongsTo('user', { inverse: 'fb_app_requests_received' }),
  fb_id: DS.attr('string'),
  armada: DS.belongsTo('armada'),
  created_at: DS.attr('date'),

  delete() {
    FB.api(this.get('fb_request_id') + '_' + this.get('fb_id'), 'delete', response => {
      console.log(response);
      this.destroyRecord();
    });
  }
});
