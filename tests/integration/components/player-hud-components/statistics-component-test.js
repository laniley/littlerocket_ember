import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player-hud-components/statistics-component', 'Integration | Component | player hud components/statistics component', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{player-hud-components/statistics-component}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#player-hud-components/statistics-component}}
      template block text
    {{/player-hud-components/statistics-component}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
