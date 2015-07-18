import Ember from 'ember';
import FacebookLoginMixin from '../../../mixins/facebook-login';
import { module, test } from 'qunit';

module('Unit | Mixin | facebook login');

// Replace this with your real tests.
test('it works', function(assert) {
  var FacebookLoginObject = Ember.Object.extend(FacebookLoginMixin);
  var subject = FacebookLoginObject.create();
  assert.ok(subject);
});
