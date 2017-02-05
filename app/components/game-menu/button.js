import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['button'],
    classNameBindings: ['active'],

    init() {
        this._super();
        this.set('elementId', 'button-' + this.get('index'));
    },

    click() {
        this.get('buttonAction')(this);
    }
});
