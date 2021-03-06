import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
// import hbs from 'htmlbars-inline-precompile';

moduleForComponent('social-components/challenges-component', 'Integration | Component | social components/challenges component', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(0);

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

  // this.render(hbs`{{social-components/challenges-component me=me}}`);
  //
  // assert.equal(this.$().text().trim(), '');
  //
  // // Template block usage:
  // this.render(hbs`
  //   {{#social-components/challenges-component me=me}}
  //     template block text
  //   {{/social-components/challenges-component}}
  // `);
  //
  // assert.equal(this.$().text().trim(), 'template block text');
});
