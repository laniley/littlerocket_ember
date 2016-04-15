import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player-hud-components/component-upgrades/component-level-upgrades', 'Integration | Component | player hud components/component upgrades/component level upgrades', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  var rocketComponentModel = Ember.Object.extend({
    description: 'description'
  }).create();

  this.set('myComponentModelMm', Ember.Object.extend({
    rocketComponentModel: rocketComponentModel
  }).create());

  this.render(hbs`{{player-hud-components/component-upgrades/component-level-upgrades myComponentModelMm=myComponentModelMm}}`);

  assert.equal(this.$().text().trim(), '%');
});
