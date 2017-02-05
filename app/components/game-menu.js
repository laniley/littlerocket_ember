import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['menu'],

    selectedButton: null,

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
        Ember.$("#button-0").addClass("active");
        Ember.$("#button-1").removeClass("active");
        this.set('selectedButton', this.get('buttons')[0]);
    },

    goButtonDown() {
        Ember.$("#button-0").removeClass("active");
        Ember.$("#button-1").addClass("active");
        this.set('selectedButton', this.get('buttons')[1]);
    },

    willDestroyElement: function(){
        Ember.$(document).off('keyup', this.reactToKeyUp);
    },

    executeSelectedAction() {
        this.get('selectedAction')(this);
    },
});
