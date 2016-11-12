import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['dropdown'],
    classNameBindings: ['cssClasses', 'isOpen:--open:--closed'],
    cssClasses: '',

    isOpen: false,

    mouseEnter() {
        this.openDropdown();
    },
    mouseLeave() {
        this.closeDropdown();
    },
    click() {
        this.toggleDropdown();
    },

    openDropdown() {
        this.set('isOpen', true);
    },

    closeDropdown() {
        this.set('isOpen', false);
    },

    toggleDropdown() {
        if(this.get('isOpen')) {
            this.closeDropdown();
        }
        else {
            this.openDropdown();
        }
    }
});
