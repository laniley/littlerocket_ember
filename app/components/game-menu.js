import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['menu'],

    selectedButton: 'button-1',

    init() {
        this._super();

        Ember.$(document).on('keyup', { _self: this }, this.reactToKeyUp);
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
});
