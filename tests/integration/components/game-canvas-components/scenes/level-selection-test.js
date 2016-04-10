import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('game-canvas-components/scenes/level-selection', 'Integration | Component | game canvas components/scenes/level selection', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{game-canvas-components/scenes/level-selection}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#game-canvas-components/scenes/level-selection}}
      template block text
    {{/game-canvas-components/scenes/level-selection}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
