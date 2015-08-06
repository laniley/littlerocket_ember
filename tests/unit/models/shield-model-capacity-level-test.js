import { moduleForModel, test } from 'ember-qunit';

moduleForModel('shield-model-capacity-level', 'Unit | Model | shield model capacity level', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
