import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('social-components/armada', 'Integration | Component | social components/armada', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{social-components/armada}}`);

  assert.equal(this.$().html().length > 0, true);

  // Template block usage:"
  // this.render(hbs`
  //   {{#social-components/armada}}
  //     template block text
  //   {{/social-components/armada}}
  // `);
  //
  // assert.equal(this.$().text().trim(), 'template block text');
});
