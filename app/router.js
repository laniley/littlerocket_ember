import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

	this.route('login');

	this.route('intern', function() {

		this.route('welcome');

		this.route('main-menu');

		this.route('track', function() {
			this.route('menu');
		});

		this.route('messages');

		this.route('buy-energy');
	});
});

export default Router;
