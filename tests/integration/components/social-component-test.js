import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('social-component', 'Integration | Component | social component', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);
  this.render(hbs`{{social-component currentSection=''}}`);
  assert.equal(this.$().html().length > 0, true);
});
