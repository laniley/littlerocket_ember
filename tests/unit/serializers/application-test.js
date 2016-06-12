import { moduleFor, test } from 'ember-qunit';
import Pretender from 'pretender';
import Ember from 'ember';

var server_pretender;

moduleFor('serializer:application', 'Unit | Serializer | application', {
  // Specify the other units that are required for this test.
  needs: ['serializer:application', 'model:user', 'model:lab'],
  beforeEach() {
    server_pretender = new Pretender(function() {
      this.get('/users', function() {
        var users = { "users": [
            { "id": 1, "first_name": "Melanie", "lab_id": 1 }
        ]};
        return [200, { "Content-Type": "application/json" }, JSON.stringify(users)];
      });
    });
  },
  afterEach() {
    server_pretender.shutdown();
  }
});

test('belongsTo relationship uses foreign keys in the format XXX_id', function(assert) {

  let store = this.container.lookup('service:store');

  Ember.run(() => {
    store.push({
      data: {
        id: '1',
        type: 'lab',
        attributes: {}
      }
    });
  });

  return store.findAll('user').then((users) => {
    assert.equal(users.objectAt(0).get('lab.id'), '1');
  });
});
