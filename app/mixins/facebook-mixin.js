/* global FB */
import Ember from 'ember';

export default Ember.Mixin.create({

	me: null,

	reRequestPostPermission(callback) {
		FB.login(
			response => {
		    	console.log('reRequestPostPermission: ', response);
		    	if(callback) { callback(response); }
			},
			{ scope: 'publish_actions', auth_type: 'rerequest' }
		);
	},

});
