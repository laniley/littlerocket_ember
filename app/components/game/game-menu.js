import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['menu'],

    selectedButton: null,
	selectedButtonIndex: 0,

    selectedAction: Ember.computed('selectedButton', function() {
        return this.get('selectedButton')['action'];
    }),

    init() {
        this._super();
        Ember.$(document).on('keyup', { _self: this }, this.reactToKeyUp);
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
        // enter
        else if(e.keyCode === 13) {
            e.data._self.executeSelectedAction();
        }
    },

    goButtonUp() {
		var selectedButtonIndex = this.get("selectedButtonIndex");

		if(selectedButtonIndex > 0) {
			Ember.$("#button-" + (selectedButtonIndex - 1) ).addClass("focused");
		   	Ember.$("#button-" + selectedButtonIndex).removeClass("focused");
			this.set('selectedButtonIndex', (selectedButtonIndex - 1));
		   	this.set('selectedButton', this.get('buttons')[(selectedButtonIndex - 1)]);
		}
    },

    goButtonDown() {
		var selectedButtonIndex = this.get("selectedButtonIndex");

		if(selectedButtonIndex < (this.get('buttons').length - 1) ) {
	        Ember.$("#button-" + selectedButtonIndex).removeClass("focused");
	        Ember.$("#button-" + (selectedButtonIndex + 1)).addClass("focused");
			this.set('selectedButtonIndex', (selectedButtonIndex + 1));
	        this.set('selectedButton', this.get('buttons')[(selectedButtonIndex + 1)]);
		}
    },

    willDestroyElement: function(){
        Ember.$(document).off('keyup', this.reactToKeyUp);
    },

    executeSelectedAction() {
        this.get('selectedAction')(this);
    },
});
