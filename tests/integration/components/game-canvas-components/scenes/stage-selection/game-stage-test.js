import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

var user;

moduleForComponent('game-canvas-components/scenes/stage-selection/game-stage', 'Integration | Component | game canvas components/scenes/stage selection/game stage', {
  integration: true,
  beforeEach() {
    user = new Ember.RSVP.Promise((resolve, reject) => {
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
  }
});

test('it renders a locked stage', function(assert) {
  this.render(hbs`{{game-canvas-components/scenes/stage-selection/game-stage me=me stage=1}}`);
  assert.equal(this.$('.stage-1 div:first img').attr('src'), 'assets/images/star.png');
});

test('it renders an unlocked stage', function(assert) {
  this.render(hbs`{{game-canvas-components/scenes/stage-selection/game-stage me=me stage=4}}`);
  assert.equal(this.$('.stage-4 div:first img').attr('src'), 'assets/images/star_locked.png');
});
