import { moduleForModel, test } from 'ember-qunit';

moduleForModel('rocket-component-model-mm', 'Unit | Model | rocket component model mm', {
  // Specify the other units that are required for this test.
  needs: ['model:rocket-component', 'model:rocket-component-model']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
