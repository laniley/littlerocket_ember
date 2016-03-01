import Ember from 'ember';
import StarMixin from 'littlerocket/mixins/star';
import { module, test } from 'qunit';

module('Unit | Mixin | star');

// Replace this with your real tests.
test('it works', function(assert) {
  let StarObject = Ember.Object.extend(StarMixin);
  let subject = StarObject.create();
  assert.ok(subject);
});
