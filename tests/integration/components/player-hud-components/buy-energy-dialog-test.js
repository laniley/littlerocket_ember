import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player-hud-components/buy-energy-dialog', 'Integration | Component | player hud components/buy energy dialog', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{player-hud-components/buy-energy-dialog}}`);

  assert.equal(this.$().html().length > 0, true);

  // Template block usage:"
  // this.render(hbs`
  //   {{#player-hud-components/buy-energy-dialog}}
  //     template block text
  //   {{/player-hud-components/buy-energy-dialog}}
  // `);
  //
  // assert.equal(this.$().text().trim(), 'template block text');
});
