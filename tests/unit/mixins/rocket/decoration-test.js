import Ember from 'ember';
import RocketDecorationMixin from '../../../mixins/rocket/decoration';
import { module, test } from 'qunit';

module('Unit | Mixin | rocket/decoration');

// Replace this with your real tests.
test('it works', function(assert) {
  var RocketDecorationObject = Ember.Object.extend(RocketDecorationMixin);
  var subject = RocketDecorationObject.create();
  assert.ok(subject);
});
