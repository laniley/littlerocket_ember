import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('lib/lr-progress', 'Integration | Component | lr progress', {
  integration: true,
});

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{lib/lr-progress}}`);

  assert.equal(this.$().text().trim(), '0/100');

  // Template block usage:
  this.render(hbs`
    {{#lib/lr-progress reached=0}}
      template block text
    {{/lib/lr-progress}}
  `);

  assert.equal(this.$().text().trim(), '0/100');
});
