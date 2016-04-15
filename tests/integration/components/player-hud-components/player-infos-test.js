import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player-hud-components/player-infos', 'Integration | Component | player infos', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  var user = new Ember.RSVP.Promise((resolve, reject) => {
    // on success
    resolve(
      Ember.Object.extend({
        exp_level: 3,
        experience: 3000,
        needed_exp_for_next_level: 5000
      }).create()
    );

    // on failure
    reject();
  });

  var me = Ember.Object.extend({
    id: 1,
    user: user
  }).create();

  this.set('me', me);

  this.render(hbs`{{player-hud-components/player-infos me=me}}`);

  assert.equal(this.$().html().length > 0, true);

  // Template block usage:
  this.render(hbs`
    {{#player-hud-components/player-infos me=me}}
      template block text
    {{/player-hud-components/player-infos}}
  `);

  assert.equal(this.$().html().length > 0, true);
});
