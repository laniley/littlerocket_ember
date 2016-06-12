import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('overlay-component', 'Integration | Component | overlay component', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{overlay-component me=me overlay_section='none'}}`);
  assert.equal(this.$().text().trim(), '');
});
