import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('social-components/leaderboard-component', 'Integration | Component | social components/leaderboard component', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{social-components/leaderboard-component}}`);

  assert.equal(this.$().text().trim(), '');
  //
  // // Template block usage:"
  // this.render(hbs`
  //   {{#social-components/leaderboard-component}}
  //     template block text
  //   {{/social-components/leaderboard-component}}
  // `);
  //
  // assert.equal(this.$().text().trim(), 'template block text');
});
