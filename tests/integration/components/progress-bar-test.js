// import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('progress-bar', 'Integration | Component | progress bar', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"
  // var reached_progress_points = new Ember.RSVP.Promise((resolve, reject) => {
  //   // on success
  //   resolve(10);
  //
  //   // on failure
  //   reject();
  // });
  //
  // var achievement = Ember.Object.extend({
  //   reached_progress_points: reached_progress_points,
  //   needed_progress_points: 100,
  //   in_progress: true,
  //   achievement_points: 50
  // }).create();
  //
  // this.set('achievement', achievement);

  this.render(hbs`{{progress-bar}}`);

  assert.equal(this.$().text().trim(), '/');

  // Template block usage:"
  this.render(hbs`
    {{#progress-bar}}
      template block text
    {{/progress-bar}}
  `);

  assert.equal(this.$().text().trim(), '/');
});
