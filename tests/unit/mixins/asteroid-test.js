import Ember from 'ember';
import AsteroidMixin from 'littlerocket/mixins/asteroid';
import { module, test } from 'qunit';

module('Unit | Mixin | asteroid');

// Replace this with your real tests.
test('it works', function(assert) {
  let AsteroidObject = Ember.Object.extend(AsteroidMixin);
  let subject = AsteroidObject.create();
  assert.ok(subject);
});
