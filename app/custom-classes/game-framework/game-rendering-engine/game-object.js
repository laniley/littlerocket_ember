import Ember from 'ember';

const GameObject = Ember.Object.extend({
	class: 'GameObject',
	name: 'GameObject',

	destroy() {
		this.get('stage').removeObject(this);
	},
});

export default GameObject;
