import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('social-components/armada-components/invitations', 'Integration | Component | social components/armada components/invitations', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{social-components/armada-components/invitations}}`);

  assert.equal(this.$().html().length > 0, true);

  // Template block usage:"
  // this.render(hbs`
  //   {{#social-components/armada-components/invitations}}
  //     template block text
  //   {{/social-components/armada-components/invitations}}
  // `);
  //
  // assert.equal(this.$().text().trim(), 'template block text');
});
