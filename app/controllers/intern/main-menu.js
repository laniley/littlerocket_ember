import Ember from 'ember';

export default Ember.Controller.extend({
    buttons: [
        {
            display: 'PLAY',
            icon: 'rocket',
            active: 'active',
            action(self) {
                self.get('router').transitionTo('intern.stage-selection');
            },
        },
        {
            display: 'WORKBENCH',
            icon: 'wrench',
            action() {

            }
        }
    ],
});
