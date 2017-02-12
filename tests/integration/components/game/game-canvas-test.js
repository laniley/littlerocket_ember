import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('game/game-canvas', 'Integration | Component | game/game canvas', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{game/game-canvas}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#game/game-canvas}}
      template block text
    {{/game/game-canvas}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
