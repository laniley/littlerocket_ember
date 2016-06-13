import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['menu','main-menu'],

  startStageAction: null,
  selectStageAction: null,

  gameState: null,

  selectedButton: 'button-1',

  outOfEnergy: Ember.computed('me.user.energy.current', function() {
    return this.get('me.user.energy.current') <= 0;
  }),

  selectedAction: Ember.computed('outOfEnergy', 'selectedButton', function() {
    if(Ember.$("#button-1").hasClass("active")) {
      if(this.get('outOfEnergy')) {
        return 'openBuyEnergyDialogAction';
      }
      else {
        return 'startStageAction';
      }
    }
    else {

    }
  }),

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
      Ember.$("#button-1").addClass("active");
      Ember.$("#button-2").removeClass("active");
      e.data._self.set('selectedButton', 'button-1');
    }
    // arrow down
    else if(e.keyCode === 40) {
      Ember.$("#button-1").removeClass("active");
      Ember.$("#button-2").addClass("active");
      e.data._self.set('selectedButton', 'button-2');
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
    openBuyEnergyDialog() {
      this.get('router').transitionTo('intern',  {queryParams: {overlay_section: 'buy-energy-dialog'}});
    }
  }
});
