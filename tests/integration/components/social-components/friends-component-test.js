import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('social-components/friends-component', 'Integration | Component | social components/friends component', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{social-components/friends-component}}`);

  assert.equal(this.$().html().length > 0, true);

  // Template block usage:"
  this.render(hbs`
    {{#social-components/friends-component}}
      template block text
    {{/social-components/friends-component}}
  `);

  assert.equal(this.$().html().length > 0, true);
});
