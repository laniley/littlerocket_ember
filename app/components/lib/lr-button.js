import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'button',
    classNames: ['button'],
    classNameBindings: ['name', 'focused'],

    init() {
        this._super();
        this.set('elementId', 'button-' + this.get('index'));
		Ember.$(document).on('keyup', { _self: this }, this.reactToKeyUp);
    },

    click() {
        this.get('buttonAction')(this);
    },

	reactToKeyUp(e) {
        // enter
        if(e.keyCode === 13 && e.data._self.get('focused')) {
            e.data._self.get('buttonAction')(this);
        }
    },
});
