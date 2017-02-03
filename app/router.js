import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('intern', function() {
    this.route('welcome');
    this.route('messages');
    this.route('buy-energy');
    this.route('stage_selection');
    this.route('stage', function() {
      this.route('menu');
    });
  });
});

export default Router;
