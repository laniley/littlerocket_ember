import { moduleForModel, test } from 'ember-qunit';

moduleForModel('fb-app-request', 'Unit | Model | fb app request', {
  // Specify the other units that are required for this test.
  needs: ['model:user', 'model:armada']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
