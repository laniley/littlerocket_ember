import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['armada'],
  armadaSection: 'main',
  showInvitations: false,
  showJoinableArmadas: false,
  showCreateDialog: false,

  actions: {

    showInvitations() {
      this.set('showInvitations', true);
    },

    showJoinableArmadas() {
      this.set('showJoinableArmadas', true);
    },

    showCreateDialog() {
      this.set('showCreateDialog', true);
    }

  }
});
