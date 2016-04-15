import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player-hud-components/workbench', 'Integration | Component | player hud components/workbench', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{player-hud-components/workbench}}`);

  assert.equal(this.$().html().length > 0, true);

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#player-hud-components/workbench}}
      template block text
    {{/player-hud-components/workbench}}
  `);

  assert.equal(this.$().html().length > 0, true);
});
