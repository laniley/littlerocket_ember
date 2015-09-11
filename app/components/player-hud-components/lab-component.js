import Ember from 'ember';

export default Ember.Component.extend({
  me: null,
  currentLabSection: '',
  store: function() {
    return this.get('targetObject.store');
  }.property(),
  actions: {
    buyCanon: function() {
      var me = this.get('targetObject.store').peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('rocket').then(rocket => {
          rocket.get('canon').then(component => {
            this.get('targetObject').buyComponent(user, component);
          });
        });
      });
    },
    buyShield: function() {
      var me = this.get('targetObject.store').peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('rocket').then(rocket => {
          rocket.get('shield').then(component => {
            this.get('targetObject').buyComponent(user, component);
          });
        });
      });
    },
    buyEngine: function() {
      var me = this.get('targetObject.store').peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('rocket').then(rocket => {
          rocket.get('engine').then(component => {
            this.get('targetObject').buyComponent(user, component);
          });
        });
      });
    }
  }
});