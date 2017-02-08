import Ember from 'ember';

export default Ember.Controller.extend({
    buttons: [
        {
            display: 'BACK',
            icon: 'chevron-left',
            name: 'back-button',
            // focused: 'focused',
            action(self) {
                self.get('router').transitionTo('intern.main-menu');
            },
        },
        {
            display: 'START',
            icon: 'rocket',
            name: 'start-button',
            // focused: 'focused',
            action(self) {
                self.get('router').transitionTo('intern.stage');
            },
        },
    ],
});
