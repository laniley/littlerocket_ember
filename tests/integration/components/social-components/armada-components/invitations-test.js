import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('social-components/armada-components/invitations', 'Integration | Component | social components/armada components/invitations', {
  integration: true
});

test('it renders - no invitations', function(assert) {
  this.render(hbs`{{social-components/armada-components/invitations}}`);
  assert.equal(this.$('.empty-info-text').html().length > 0, true);
});

test('it renders - with invitations', function(assert) {

  var armada = new Ember.RSVP.Promise((resolve, reject) => {
    // on success
    resolve(
      Ember.Object.extend({
        name: 'test'
      }).create()
    );

    // on failure
    reject();
  });

  armada.save = function() {
    console.log('armada has been saved');
  };

  var invitation = new Ember.RSVP.Promise((resolve, reject) => {
    // on success
    resolve(
      Ember.Object.extend({
        fb_id: 1,
        type: 'armada-invitation',
        armada: armada
      }).create()
    );

    // on failure
    reject();
  });

  invitation.save = function() {
    console.log('invitation has been saved');
  };

  var content = [];
  content.push(invitation);

  var invitations = new Ember.RSVP.Promise((resolve, reject) => {
    // on success
    resolve(
      Ember.Object.extend({
        content: content
      }).create()
    );

    // on failure
    reject();
  });

  invitations.save = function() {
    console.log('invitations has been saved');
  };

  this.render(hbs`{{social-components/armada-components/invitations invitations=invitations}}`);
  assert.equal(this.$().html().trim(), '');
});
