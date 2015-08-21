import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'timer',
  type: null,
  component: null,

  didInsertElement: function() {

    var self = this;
    var now = Math.floor(new Date().getTime() / 1000); // current timestamp in seconds
    var start_time = this.get('component').get('construction_start');
    var elapsed_construction_time = now - start_time;
    var remaining_construction_time = this.get('component').get('construction_time') - elapsed_construction_time;

    Ember.$('#' + this.get('elementId')).pietimer
    (
      {
        timerStart: start_time,
        timerCurrent: elapsed_construction_time,
      	timerSeconds: remaining_construction_time,
      	color: 'rgb(20, 208, 69)',
      	height: 50,
      	width: 50,
        showPercentage: true,
        callback: function() {
          self.onTimerReady();
        }
      }
    );

    Ember.$('#' + this.get('elementId')).pietimer('start');
  },

  onTimerReady: function() {

    if(this.get('component').get('status') === 'under_construction') {

      this.get('component').set('status', 'unlocked');

      var store = this.get('targetObject.store');
      var me = store.peekRecord('me', 1);

      if(this.get('type') === 'lab-tab') {
        me.get('user').then(user => {
          user.get('lab').then(lab => {
            lab.save();
          });
        });
      }
      else {
        me.get('user').then(user => {
          user.get('rocket').then(rocket => {
            rocket.get(this.get('type')).then(component => {
              component.save();
            });
          });
        });
      }
    }

    Ember.$('#' + this.get('elementId')).remove();

    // FB.api
    // (
    //   	'me/little_rocket:build',
    //   	'post',
    // 	{
    // 	   lab: "http://meme-games.com/little_rocket/stories/lab.html"
    // 	},
    // 	function(response)
    // 	{
    // 	   if( !response.error )
    //  				{
    //  					console.log(response);
    //  				}
    //  				else
    //  				{
    //  					console.log(response.error);
    //  				}
    // 	}
    // );
  }
});
