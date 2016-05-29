import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('social-components/armada-component', 'Integration | Component | social components/armada component', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{social-components/armada-component}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#social-components/armada-component}}
      template block text
    {{/social-components/armada-component}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});