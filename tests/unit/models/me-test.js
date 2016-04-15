import { moduleForModel, test } from 'ember-qunit';

moduleForModel('me', 'Unit | Model | me', {
  // Specify the other units that are required for this test.
  needs: ['model:user', 'model:friend', 'model:challenge']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
