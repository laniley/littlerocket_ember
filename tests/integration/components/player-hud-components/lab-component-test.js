import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player-hud-components/lab-component', 'Integration | Component | lab component', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{player-hud-components/lab-component}}`);

  assert.equal(this.$().html().length > 0, true);

  // Template block usage:
  this.render(hbs`
    {{#player-hud-components/lab-component}}
      template block text
    {{/player-hud-components/lab-component}}
  `);

  assert.equal(this.$().html().length > 0, true);
});
