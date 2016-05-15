import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['menu','main-menu'],

  selectedAction: 'startStageAction',
  startStageAction: null,
  selectStageAction: null,

  gameState: null,

  init() {
    this._super();

    Ember.$(document).on('keyup', { _self: this }, this.reactToKeyUp);

    this.get('gameState').set('flown_distance', 0);
    this.get('gameState').set('stars', 0);
    this.get('gameState').set('speed', 0);
    this.get('gameState').set('distance_to_goal', 50);
  },

  reactToKeyUp(e) {
    // console.log('key pressed', e);
    // arrow up
    if(e.keyCode === 38) {
      Ember.$(".start-stage").addClass("active");
      Ember.$(".select-stage").removeClass("active");
      e.data._self.set('selectedAction', 'startStageAction');
    }
    // arrow down
    else if(e.keyCode === 40) {
      Ember.$(".start-stage").removeClass("active");
      Ember.$(".select-stage").addClass("active");
      e.data._self.set('selectedAction', 'selectStageAction');
    }
    // enter
    else if(e.keyCode === 13) {
      e.data._self.get(e.data._self.get('selectedAction'))();
    }
  },

  willDestroyElement: function(){
    Ember.$(document).off('keyup', this.reactToKeyUp);
  },

  actions: {
    startStage() {
      this.get('startStageAction')();
    },
    selectStage() {
      this.get('selectStageAction')();
    },
  }
});