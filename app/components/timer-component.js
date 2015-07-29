import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'timer',
  type: null,
  component: null,

  didInsertElement: function() {
    Ember.$('#' + this.get('type') + ' > .timer').pietimer
    (
      {
      	seconds: this.get('component').get('construction_time'),
      	color: 'rgba(43, 194, 83, 0.3)',
      	height: 50,
      	width: 50
      },
      function() {
        // me.setStatus('construction_complete');

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

    Ember.$('#' + this.get('type') + ' > .timer').pietimer('start');
  }
});
