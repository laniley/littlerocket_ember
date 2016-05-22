import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  classNames: ['armada'],
  armadaSection: 'main',
  showCreateDialog: false,
  showConfirmDialog: false,
  showSuggestions: false,
  nameInput: '',
  newArmadaNameStatus: 'not_correct',
  timeout: null,

  armadas: Ember.computed(function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('user').then(user => {
        return this.store.query('armada', {
          'mode': 'suggestions'
        }).then(armadas => {
          armadas.forEach(armada => {
            this.store.query('armadaMembershipRequest', {
              armada_id: armada.get('id'),
              user_id: user.get('id')
            });
          });
          return armadas;
        });
      })
    });
  }),

  missing_requirements_message: Ember.computed('nameInput', 'newArmadaNameStatus', function() {
    if(this.get('nameInput.length') < 3) {
      return 'The name must contain a minimum of 3 characters.';
    }
    else if(/[^A-Za-z0-9_\-.]/g.test(this.get('nameInput'))) {
      return 'The name can only contain letters (A-Z, a-z), numbers (0-9), dashes (-), underscores (_), apostrophes (\'), and periods (.)';
    }
    else if(this.get('nameInput.length') > 50) {
      return 'The name cannot be longer than 50 characters.';
    }
    else if(this.get('newArmadaNameStatus') === 'already_in_use') {
      return 'This name is already in use.';
    }
  }),

  requirementsForNewArmadaFulfilled: Ember.computed('newArmadaNameStatus', function() {
    if(this.get('newArmadaNameStatus') === 'correct') {
      return true;
    }
    else {
      return false;
    }
  }),

  nameStatusIcon: Ember.computed('newArmadaNameStatus', function() {
    if(this.get('newArmadaNameStatus') === 'correct') {
      return 'check';
    }
    else if(this.get('newArmadaNameStatus') === 'unknown') {
      return 'fa-circle-o-notch';
    }
    else {
      return 'close';
    }
  }),

  nameStatusIconSpin: Ember.computed('newArmadaNameStatus', function() {
    if(this.get('newArmadaNameStatus') === 'unknown') {
      return true;
    }
    else {
      return false;
    }
  }),

  nameDidChange: function(){
    window.clearTimeout(this.get('timeout'));
    this.set('newArmadaNameStatus', 'unknown');
    var timeout = window.setTimeout(() => {
      if(this.get('nameInput.length') > 2 &&
        !/[^A-Za-z0-9_\-.]/g.test(this.get('nameInput')) &&
        this.get('nameInput.length') <= 50) {
        return DS.PromiseObject.create({
          promise: this.store.query('armada', {
              'mode': 'searchByName',
              'name': this.get('nameInput')
            }).then(results => {
              if(Ember.isEmpty(results)) {
                this.set('newArmadaNameStatus', 'correct');
              }
              else {
                this.set('newArmadaNameStatus', 'already_in_use');
              }
          })
        });
      }
      else {
        this.set('newArmadaNameStatus', 'not_correct');
      }
    },500);
    this.set('timeout', timeout);
  }.observes('nameInput'),

  actions: {
    openCreateDialog() {
      this.set('showCreateDialog', true);
    },
    openSuggestions() {
      this.set('showSuggestions', true);
    },
    closeCreateDialog() {
      this.set('showCreateDialog', false);
    },
    closeSuggestions() {
      this.set('showSuggestions', false);
    },

    save() {
      if(this.get('newArmadaNameStatus') === 'correct') {
        var armada = this.store.createRecord('armada', {
          'name': this.get('nameInput')
        });
        armada.save().then(() => {
          this.get('me').get('user').then(user => {
            user.set('armada', armada);
            user.set('armada_rank', 'Admiral');
            user.save();
          });
        });
      }
    },

    sendRequest(armada) {
      this.get('me').get('user').then(user => {
        this.store.queryRecord('armada-membership-request', {
          user_id: user.get('id'),
          armada_id: armada.get('id')
        }).then(request => {
          if(Ember.isEmpty(request)) {
            request = this.store.createRecord('armada-membership-request', {
              'armada': armada,
              'user': user
            });
            request.save();
          }
        });
      });
    },
    join(armada) {
      this.set('showSuggestions', false);
      this.set('showCreateDialog', false);
      this.get('me').get('user').then(user => {
        user.set('armada', armada);
        user.set('armada_rank', 'Private');
        user.save();
      });
    },
    open() {
      this.set('showConfirmDialog', true);
    },
    close() {
      this.set('showConfirmDialog', false);
    },

    leave() {
      this.set('showSuggestions', false);
      this.set('showCreateDialog', false);
      this.set('showConfirmDialog', false);
      this.get('me').get('user').then(user => {
        user.set('armada', null);
        user.set('armada_rank', null);
        user.save();
      });
    },

  }
});
