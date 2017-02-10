import Ember from 'ember';

export default Ember.Controller.extend({
    buttons: [
        {
            display: 'START',
            icon: 'rocket',
            name: 'start-button',
            focused: 'focused',
            action(self) {
                self.get('router').transitionTo('intern.stage');
            },
        },
    ],
});
