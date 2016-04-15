import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('timer-component', 'Integration | Component | timer component', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  var component = Ember.Object.extend({
    construction_time: 100
  }).create();

  this.set('component', component);

  this.render(hbs`{{timer-component component=component}}`);

  assert.equal(this.$().html().length > 0, true);

  // Template block usage:
  this.render(hbs`
    {{#timer-component component=component}}
      template block text
    {{/timer-component}}
  `);

  assert.equal(this.$().html().length > 0, true);
});
