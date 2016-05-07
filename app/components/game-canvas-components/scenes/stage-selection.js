import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stage-selection'],
  Q: null,
  me: null,
  gameState: null,

  actions: {
    setGameMode(mode) {
      this.set('gameState.mode', mode);
    }
  }
});
