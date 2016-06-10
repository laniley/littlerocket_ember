import Ember from 'ember';

export default Ember.Component.extend({
  messages: Ember.computed('me.user.fb_id', function() {
    return this.get('me').get('user').then(user => {
      return this.store.query('fb-app-request', { type: 'energy-request', fb_id: user.get('fb_id') }).then(requests => {
        return requests;
      });
    });
  }),
  actions: {
    close() {
      this.get('router').transitionTo('intern', { queryParams: { overlay_section: 'none' }});
    }
  }
});
