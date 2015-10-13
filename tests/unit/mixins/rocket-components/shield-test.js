import Ember from 'ember';
import RocketComponentsShieldMixin from '../../../mixins/rocket-components/shield';
import { module, test } from 'qunit';

module('Unit | Mixin | rocket components/shield');

// Replace this with your real tests.
test('it works', function(assert) {
  var RocketComponentsShieldObject = Ember.Object.extend(RocketComponentsShieldMixin);
  var subject = RocketComponentsShieldObject.create();
  assert.ok(subject);
});
