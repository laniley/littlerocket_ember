import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['menu'],

    selectedButton: null,
	selectedButtonIndex: 0,

    init() {
        this._super();
        Ember.$(document).on('keyup', { _self: this }, this.reactToKeyUp);
		this.get('buttons')[0].focused = true;
        this.set('selectedButton', this.get('buttons')[0]);
    },

    reactToKeyUp(e) {
        // console.log('key pressed', e);
        // arrow up
        if(e.keyCode === 38) {
            e.data._self.goButtonUp();
        }
        // arrow down
        else if(e.keyCode === 40) {
            e.data._self.goButtonDown();
        }
    },

    goButtonUp() {
		var selectedButtonIndex = this.get("selectedButtonIndex");

		if(selectedButtonIndex > 0) {

			Ember.set(this.get('buttons')[selectedButtonIndex - 1], 'focused', true);
			Ember.set(this.get('buttons')[selectedButtonIndex], 'focused', false);

			this.set('selectedButtonIndex', (selectedButtonIndex - 1));
		   	this.set('selectedButton', this.get('buttons')[(selectedButtonIndex - 1)]);
		}
    },

    goButtonDown() {
		var selectedButtonIndex = this.get("selectedButtonIndex");

		if(selectedButtonIndex < (this.get('buttons').length - 1) ) {

			Ember.set(this.get('buttons')[selectedButtonIndex], 'focused', false);
			Ember.set(this.get('buttons')[selectedButtonIndex + 1], 'focused', true);

			this.set('selectedButtonIndex', (selectedButtonIndex + 1));
	        this.set('selectedButton', this.get('buttons')[(selectedButtonIndex + 1)]);
		}
    },

    willDestroyElement: function(){
        Ember.$(document).off('keyup', this.reactToKeyUp);
    },

});
