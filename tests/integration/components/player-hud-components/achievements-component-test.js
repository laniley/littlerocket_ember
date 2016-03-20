import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player-hud-components/achievements-component', 'Integration | Component | player hud components/achievements component', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{player-hud-components/achievements-component}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#player-hud-components/achievements-component}}
      template block text
    {{/player-hud-components/achievements-component}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
