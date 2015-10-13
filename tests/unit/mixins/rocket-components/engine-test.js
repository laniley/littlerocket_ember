import Ember from 'ember';
import RocketComponentsEngineMixin from '../../../mixins/rocket-components/engine';
import { module, test } from 'qunit';

module('Unit | Mixin | rocket components/engine');

// Replace this with your real tests.
test('it works', function(assert) {
  var RocketComponentsEngineObject = Ember.Object.extend(RocketComponentsEngineMixin);
  var subject = RocketComponentsEngineObject.create();
  assert.ok(subject);
});
