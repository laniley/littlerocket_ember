import Ember from 'ember';
import RocketRocketComponentsCannonBulletMixin from './../../../../../../mixins/rocket/rocket-components/cannon/bullet';
import { module, test } from 'qunit';

module('Unit | Mixin | rocket/rocket components/cannon/bullet');

// Replace this with your real tests.
test('it works', function(assert) {
  let RocketRocketComponentsCannonBulletObject = Ember.Object.extend(RocketRocketComponentsCannonBulletMixin);
  let subject = RocketRocketComponentsCannonBulletObject.create();
  assert.ok(subject);
});
