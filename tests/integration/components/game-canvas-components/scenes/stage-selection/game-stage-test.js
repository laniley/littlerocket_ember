import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('game-canvas-components/scenes/stage-selection/game-stage', 'Integration | Component | game canvas components/scenes/stage selection/game stage', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"
  var user = new Ember.RSVP.Promise((resolve, reject) => {
    // on success
    resolve(
      Ember.Object.extend({
        reached_level: 3
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

  this.render(hbs`{{game-canvas-components/scenes/stage-selection/game-stage me=me stage=1}}`);

  assert.equal(this.$().text().trim(), '1');
});
