import Ember from 'ember';

export default Ember.Controller.extend({
    buttons: [
        {
            display: 'PLAY',
            icon: 'rocket',
            action() {
				this.get('router').transitionTo("intern.track");
            },
        },
        {
            display: 'WORKBENCH',
            icon: 'wrench',
            action() {

            }
        },
        {
            display: 'LEADERBOARD',
            icon: 'trophy',
            action() {

            }
        }
    ],
});
