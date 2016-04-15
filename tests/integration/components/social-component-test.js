import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('social-component', 'Integration | Component | social component', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{social-component}}`);

  assert.equal(this.$().html().length > 0, true);

  // Template block usage:
  this.render(hbs`
    {{#social-component}}
      template block text
    {{/social-component}}
  `);

  assert.equal(this.$().html().length > 0, true);
});
