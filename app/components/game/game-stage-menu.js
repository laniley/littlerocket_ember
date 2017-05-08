import Ember from 'ember';

export default Ember.Component.extend({

	gameState: Ember.inject.service('game-state'),

	init() {
        this._super();

		var buttons = [
			{
				display: 'START',
				icon: 'rocket',
				action() {
					if(this.get('gameState').get('isPaused')) {
			            this.set('gameState.currentScene', 'track');
			        }
				},
			},
		];

		this.set('buttons', buttons);
    },

	// startStageAction: null,
	// selectStageAction: null,
	//
	//
	// outOfEnergy: Ember.computed('me.user.energy.current', function() {
	//   return this.get('me.user.energy.current') <= 0;
	// }),
	//
	//
	// init() {
	//   this._super();
	//
	//   this.get('gameState').set('flown_distance', 0);
	//   this.get('gameState').set('stars', 0);
	//   this.get('gameState').set('speed', 0);
	//   this.get('gameState').set('distance_to_goal', 50);
	// },
	//
	// actions: {
	//   startStage() {
	//     this.get('startStageAction')();
	//   },
	//   selectStage() {
	//     this.get('selectStageAction')();
	//   },
	//   openBuyEnergyDialog() {
	//     this.get('router').transitionTo('intern',  {queryParams: {overlay_section: 'buy-energy-dialog'}});
	//   }
	// }
});