import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('social-components/armada-components/create', 'Integration | Component | social components/armada components/create', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{social-components/armada-components/create}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#social-components/armada-components/create}}
      template block text
    {{/social-components/armada-components/create}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
