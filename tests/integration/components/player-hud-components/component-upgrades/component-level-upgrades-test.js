import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player-hud-components/component-upgrades/component-level-upgrades', 'Integration | Component | player hud components/component upgrades/component level upgrades', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{player-hud-components/component-upgrades/component-level-upgrades}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#player-hud-components/component-upgrades/component-level-upgrades}}
      template block text
    {{/player-hud-components/component-upgrades/component-level-upgrades}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
