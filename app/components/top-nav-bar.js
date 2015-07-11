import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    Ember.$(document).foundation();
  },

  statusChangeCallback: function(response)
  {
  	console.log('statusChangeCallback', response);
  	 // The response object is returned with a status field that lets the
  	 // app know the current login status of the person.
  	 // Full docs on the response object can be found in the documentation
  	 // for FB.getLoginStatus().
  	if (response.status === 'connected')
  	{
  			// Logged into your app and Facebook.
  			$(".fb-login").hide();
  			$(".cockpit").show();

  			testAPI();
  	}
  	else if (response.status === 'not_authorized')
  	{
  			// The person is logged into Facebook, but not your app.
  			$(".fb-login").show();
  	}
  	else
  	{
  			// The person is not logged into Facebook, so we're not sure if
  			// they are logged into this app or not.
  			$(".fb-login").show();
  	}
  },

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  testAPI: function()
  {
  	console.log('Welcome!  Fetching your information.... ');

  	FB.api('/me', {fields: 'id,name,first_name,picture.width(120).height(120)'}, function(response)
  	{
  		if( !response.error )
  			{
  				console.log(response);

  			user_id = response.id;
  			user_name = response.name;
  			user_img_url = response.picture.data.url;

  			$(".cockpit_img").attr("src", user_img_url);

  			console.log('Successful login for: ' + user_name);

  			$(".logged_in").show();
  			$(".fb-login").hide();

  			getPermissions(function(){});

  			getScores(function()
  			{
  				renderScores();
  			});

  			getLeaderboardRankFromDB();
  			getLevel();
  			getStars();
  			getWorkbenchStatus();
  			getLabStatus();
  			getCanonStatus();
  		}
  		else
  		{
  			conole.log(response.error);
  		}
  	});
  },

  actions: {
    checkLoginState: function() {
      FB.getLoginStatus(response => {
    			this.statusChangeCallback(response);
    	});
    }
  }
});
