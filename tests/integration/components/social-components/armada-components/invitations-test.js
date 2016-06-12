// import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import startMirage from '../../../../helpers/setup-mirage-for-integration';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('social-components/armada-components/invitations', 'Integration | Component | social components/armada components/invitations', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    window.server.shutdown();
  }
});

test('it renders - no invitations', function(assert) {
  this.render(hbs`{{social-components/armada-components/invitations}}`);
  assert.equal(this.$('.empty-info-text').html().length > 0, true);
});

test('it renders - with invitations', function(assert) {
  var armada = server.create('armada');
  var invitations = {};
  var content = server.createList('fb-app-request', 3, { type: 'armada-invitation', armada_id: armada.id });
  invitations.content = content;
  this.set('invitations', invitations);
  this.render(hbs`{{social-components/armada-components/invitations invitations=invitations}}`);
  assert.equal(this.$('.list-item').length, 3);
});
