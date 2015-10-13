import Ember from 'ember';
import UfoMixin from '../../../mixins/ufo';
import { module, test } from 'qunit';

module('Unit | Mixin | ufo');

// Replace this with your real tests.
test('it works', function(assert) {
  var UfoObject = Ember.Object.extend(UfoMixin);
  var subject = UfoObject.create();
  assert.ok(subject);
});
