import Ember from 'ember';
import InjectorInitializer from '../../../initializers/injector';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | injector', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  InjectorInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
