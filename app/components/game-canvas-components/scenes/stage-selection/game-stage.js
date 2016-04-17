import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stage'],
  classNameBindings: ['stageClass'],

  Q: null,
  me: null,
  gameState: null,

  reached_level: 1,
  stage: 0,

  stageClass: Ember.computed('stage', function() {
    return "stage-" + this.get('stage');
  }),

  init() {
    this._super();
    this.get('me').get('user').then(user => {
      this.set('reached_level', user.get('reached_level'));
    });
  },

  actions: {
    loadStage() {
      if(this.get('reached_level') >= this.get('stage')) {
        this.get('gameState').set('level', this.get('stage'));
    		this.get('Q').clearStages();
    		this.get('Q').stageScene("mainMenu");
      }
    }
  }
});
