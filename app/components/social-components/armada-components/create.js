import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({

  nameInput: '',
  newArmadaNameStatus: 'not_correct',
  timeout: null,

  missing_requirements_message: Ember.computed('nameInput', 'newArmadaNameStatus', function() {
    if(this.get('nameInput.length') < 3) {
      return 'The name must contain a minimum of 3 characters.';
    }
    else if(this.get('containsOnlyValidChars')) {
      return 'The name can only contain letters (A-Z, a-z), numbers (0-9), dashes (-), underscores (_), apostrophes (\'), whitespaces ( ), and periods (.)';
    }
    else if(this.get('nameInput.length') > 50) {
      return 'The name cannot be longer than 50 characters.';
    }
    else if(this.get('newArmadaNameStatus') === 'already_in_use') {
      return 'This name is already in use.';
    }
  }),

  containsOnlyValidChars: Ember.computed('nameInput', function() {
    if(/[^A-Za-z0-9_\-. ]/g.test(this.get('nameInput'))) {
      return true;
    }
    else {
      return false;
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
        !this.get('containsOnlyValidChars') &&
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
    close() {
      this.get('targetObject').set('showCreateDialog', false);
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
  }
});
