import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'timer',
  type: null,
  component: null,

  didInsertElement: function() {

    var now = Math.floor(new Date().getTime() / 1000); // current timestamp in seconds
    var remaining_construction_time = this.get('component').get('construction_time') - (now - this.get('component').get('construction_start'));

    Ember.$('#' + this.get('elementId')).pietimer
    (
      {
      	timerSeconds: remaining_construction_time,
      	color: 'rgba(43, 194, 83, 0.3)',
      	height: 50,
      	width: 50,
        showPercentage: true
      },
      () => {

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
          else if(this.get('type') === 'canon') {
            me.get('user').then(user => {
              user.get('rocket').then(rocket => {
                rocket.get(this.get('type')).then(component => {
                  component.save();
                });
              });
            });
          }
        }

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
    });
  }
});
