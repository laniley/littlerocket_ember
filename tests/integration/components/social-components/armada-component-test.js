import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('social-components/armada-component', 'Integration | Component | social components/armada component', {
  integration: true
});

test('it renders - home / me.user undefined', function(assert) {
  // check if loader is shown when no user is set
  this.set('armadaMainSection', 'home');
  this.render(hbs`{{social-components/armada-component armadaSection=armadaSection}}`);
  var result = Ember.$('.loader').html().trim().length;
  assert.equal(result > 0, true);
});

// test('it renders - home / showInvitations', function(assert) {
//
//   this.set('armadaMainSection', 'home');
//   this.set('showInvitations', true);
//
//   var user = new Ember.RSVP.Promise((resolve, reject) => {
//     // on success
//     resolve(
//       Ember.Object.extend({
//         // exp_level: 3,
//         // experience: 3000,
//         // needed_exp_for_next_level: 5000
//       }).create()
//     );
//
//     // on failure
//     reject();
//   });
//
//   user.save = function() {
//     console.log('user has been saved');
//   };
//
//   var me = Ember.Object.extend({
//     id: 1,
//     user: user
//   }).create();
//
//   this.set('me', me);
//
//   this.render(hbs`{{social-components/armada-component
//                       me=me
//                       armadaSection=armadaSection
//                       armadaMainSection=armadaMainSection
//                       showInvitations=showInvitations}}`);
//
//   var result = this.$().html().trim();
//   assert.equal(result, '');
// });
