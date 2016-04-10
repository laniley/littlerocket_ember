import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('game-canvas-components/scenes/game-over', 'Integration | Component | game canvas components/scenes/game over', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{game-canvas-components/scenes/game-over}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#game-canvas-components/scenes/game-over}}
      template block text
    {{/game-canvas-components/scenes/game-over}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
