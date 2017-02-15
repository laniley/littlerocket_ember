import Ember from 'ember';
/* initialize the helper functions */
export function initialize( application ) {
	var HF = Ember.Object.extend({
		isString(scene) {
			return Ember.typeOf(scene) === 'string';
		},
		isFunction(func) {
			return Ember.typeOf(func) === 'function';
		},
  	});

  	application.register('HF:main', HF);
  	application.inject('service', 'HF', 'HF:main');
}

export default {
  name: 'helper-functions',
  initialize
};
