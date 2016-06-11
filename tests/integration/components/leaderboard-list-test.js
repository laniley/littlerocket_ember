import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('leaderboard-list', 'Integration | Component | leaderboard list', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{leaderboard-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#leaderboard-list}}
      template block text
    {{/leaderboard-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
