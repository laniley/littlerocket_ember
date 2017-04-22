import Ember from 'ember';

export default Ember.Controller.extend({
    buttons: [
        {
            display: 'PLAY',
            icon: 'rocket',
			actionName: 'showStageSelection',
            action() {
				this.get('router').transitionTo("intern.stage.selection");
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
