import { moduleForModel, test } from 'ember-qunit';

moduleForModel('armada', 'Unit | Model | armada', {
  // Specify the other units that are required for this test.
  needs: [
    'model:armada',
    'model:user',
    'model:armada-membership-request',
    'model:fb-app-request'
  ]
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
