import Ember from 'ember';

const GameObject = Ember.Object.extend({

	_has(obj, key) {
		return !Ember.isEmpty(obj[key]);
	},
	_keys(obj) {
		if(Ember.typeOf(obj) !== 'object') {
			throw new TypeError('Invalid object');
		}
		var keys = [];
		for (var key in obj) {
			if (this._has(obj, key)) {
				keys[keys.length] = key;
			}
		}
		return keys;
	},
});

export default GameObject;
