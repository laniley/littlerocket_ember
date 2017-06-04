import Ember from 'ember';

const GameStageObject = Ember.Object.extend({
	class: 'GameObject',
	name: 'GameObject',

	destroy() {
		this.get('stage').removeObject(this);
	},
});

export default GameStageObject;
