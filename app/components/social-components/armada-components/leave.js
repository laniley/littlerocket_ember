import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  conditions_to_leave_are_fulfilled: Ember.computed(
    'me.user.armada_rank',
    'me.user.armada.admirals.length',
    'me.user.armada.users.length',
    function() {
      return DS.PromiseObject.create({
        promise: this.get('me').get('user').then(user => {
          return user.get('armada').then(armada => {
            return armada.get('users').then(users => {
              return ( user.get('armada_rank') !== 'Admiral' ) ||
                     ( user.get('armada_rank') === 'Admiral' && (
                        ( users.get('length') <= 1 ) ||
                        ( users.get('length') > 1 && armada.get('admirals.length') > 1))
                     );
            });
          });
        })
      });
    }
  ),
  actions: {
    close() {
      history.back();
    },
    leave() {
      this.get('me').get('user').then(user => {
        user.set('armada', null);
        user.set('armada_rank', null);
        user.save();
        this.get('router').transitionTo('index', {queryParams: {armada_section: 'main'}});
      });
    },
  }
});
