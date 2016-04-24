import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('game-canvas-components/scenes/main-menu', 'Integration | Component | game canvas components/scenes/main menu', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{game-canvas-components/scenes/main-menu}}`);

  assert.equal(this.$().text().replace(/[^A-Z]/g, ""), 'STARTSELECTSTAGE');

  // Template block usage:"
  this.render(hbs`
    {{#game-canvas-components/scenes/main-menu}}
      template block text
    {{/game-canvas-components/scenes/main-menu}}
  `);

  assert.equal(this.$().text().replace(/[^A-Z]/g, ""), 'STARTSELECTSTAGE');
});
