import Ember from 'ember';

export default Ember.Controller.extend({
    buttons: [
        {
            display: 'PLAY',
            icon: 'rocket',
            focused: 'focused',
            action() {

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
