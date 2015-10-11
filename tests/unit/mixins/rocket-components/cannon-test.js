import Ember from 'ember';
import RocketComponentsCannonMixin from '../../../mixins/rocket-components/cannon';
import { module, test } from 'qunit';

module('Unit | Mixin | rocket components/cannon');

// Replace this with your real tests.
test('it works', function(assert) {
  var RocketComponentsCannonObject = Ember.Object.extend(RocketComponentsCannonMixin);
  var subject = RocketComponentsCannonObject.create();
  assert.ok(subject);
});
