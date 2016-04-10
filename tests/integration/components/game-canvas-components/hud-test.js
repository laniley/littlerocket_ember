import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('game-canvas-components/hud', 'Integration | Component | game canvas components/hud', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{game-canvas-components/hud}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#game-canvas-components/hud}}
      template block text
    {{/game-canvas-components/hud}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
