import Ember from 'ember';
import RocketMixin from '../../../mixins/rocket';
import { module, test } from 'qunit';

module('Unit | Mixin | rocket');

// Replace this with your real tests.
test('it works', function(assert) {
  var RocketObject = Ember.Object.extend(RocketMixin);
  var subject = RocketObject.create();
  assert.ok(subject);
});
