import { moduleForModel, test } from 'ember-qunit';

moduleForModel('armada-membership-request', 'Unit | Model | armada membership request', {
  // Specify the other units that are required for this test.
  needs: ['model:armada', 'model:user']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
