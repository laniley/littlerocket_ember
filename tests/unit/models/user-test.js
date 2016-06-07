import { moduleForModel, test } from 'ember-qunit';

moduleForModel('user', 'Unit | Model | user', {
  // Specify the other units that are required for this test.
  needs: [
    'model:lab',
    'model:rocket',
    'model:challenge',
    'model:achievement',
    'model:user-energy',
    'model:armada',
    'model:fb-app-request'
  ]
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
