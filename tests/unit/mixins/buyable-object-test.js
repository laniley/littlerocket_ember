import Ember from 'ember';
import ObjectMixin from './../../../mixins/buyable-object';
import { module, test } from 'qunit';

module('Unit | Mixin | object');

// Replace this with your real tests.
test('it works', function(assert) {
  let ObjectObject = Ember.Object.extend(ObjectMixin);
  let subject = ObjectObject.create();
  assert.ok(subject);
});
