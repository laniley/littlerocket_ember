import { moduleForModel, test } from 'ember-qunit';

moduleForModel('user', 'Unit | Model | user', {
  // Specify the other units that are required for this test.
  needs: [
    'model:achievement',
    'model:armada',
    'model:challenge',
    'model:fb-app-request',
    'model:lab',
    'model:message',
    'model:rocket',
    'model:user-energy',
  ]
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
