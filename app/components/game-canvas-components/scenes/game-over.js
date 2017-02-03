/* global FB */
/* global LSM_Slot */
import Ember from 'ember';
import FacebookLoginMixin from './../../../mixins/facebook-login';
import ENV from './../../../config/environment';

export default Ember.Component.extend(FacebookLoginMixin, {
  classNames: ['menu', 'gameOver'],
  // classNameBindings: ['congratzMessageExists:big:small'],
  gameState: null,
  me: null,
  tryAgainAction: null,
  selectStageAction: null,
  isNewHighscore: false,
  hasPostPermission: false,
  highscoreHasBeenPosted: false,
  newStageHasBeenPosted: false,
  newStage: 0,
  newScore: 0,
  oldScore: 0,
  currentCongratzSection: '',

  selectedButton: 'button-1',

  outOfEnergy: Ember.computed('me.user.energy.current', function() {
    return this.get('me.user.energy.current') <= 0;
  }),

  selectedAction: Ember.computed('outOfEnergy', 'selectedButton', function() {
    if(Ember.$("#button-1").hasClass("active")) {
      if(this.get('outOfEnergy')) {
        return 'openBuyEnergyDialogAction';
      }
      else {
        return 'tryAgainAction';
      }
    }
    else {
      return 'selectStageAction';
    }
  }),

  reachedNewStage: Ember.computed('gameState.new_stage_reached', function() {
    return this.get('gameState').get('new_stage_reached');
  }),

  congratzMessageExists: Ember.computed('isNewHighscore', 'reachedNewStage', 'gameState.reached_end', function() {
    if(this.get('isNewHighscore') || this.get('reachedNewStage') || this.get('gameState.reached_end')) {
      return true;
    }
    else {
      return false;
    }
  }),

  updateCurrentCongratzSection: Ember.observer('isNewHighscore', 'reachedNewStage', function() {
    if(this.get('isNewHighscore') === true) {
      this.set('currentCongratzSection', 'highscore');
    }
    else if(this.get('currentCongratzSection') === '' && this.get('reachedNewStage') === true) {
      this.set('currentCongratzSection', 'new_stage');
    }
  }).on('init'),

  init() {
    this._super();

    Ember.$(document).on('keyup', { _self: this }, this.reactToKeyUp);

    this.set('gameState', this.store.peekRecord('gameState', 1));
    this.get('gameState').set('speed', 0);
    this.set('newStage', this.get('gameState').get('level'));

    this.reloadAdBanner();

    this.set('me', this.store.peekRecord('me', 1));

    this.get('me').get('user').then(user => {

      // score
      this.set('oldScore', user.get('score'));
      if(this.get('newScore') > user.get('score')) {
        user.set('score', this.get('newScore'));
        this.set('isNewHighscore', true);
        this.sendScoreToFB();
      }
      else {
        this.set('isNewHighscore', false);
      }

      // challenges
      if(this.get('me').get('activeChallenge')) {
        if(this.get('me').get('activeChallenge').get('iAm') === 'from_player') {
          this.get('me').get('activeChallenge').set('from_player_score', this.get('newScore'));
          this.get('me').get('activeChallenge').set('from_player_has_played', true);
        }
        else {
          this.get('me').get('activeChallenge').set('to_player_score', this.get('newScore'));
          this.get('me').get('activeChallenge').set('to_player_has_played', true);
        }
        this.get('me').get('activeChallenge').save();
        this.get('me').set('activeChallenge', null);
      }

      // stars
      var new_stars_amount = user.get('stars') + (this.get('gameState').get('stars') * this.get('gameState').get('level'));
      var new_experience = user.get('experience') + this.get('newScore');
      user.set('stars', new_stars_amount);
      user.set('stars_all_time', user.get('stars_all_time') + (this.get('gameState').get('stars') * this.get('gameState').get('level')));

      // experience
      user.set('experience', new_experience);

      // flights
      user.set('flights', user.get('flights') + 1);

      user.save();

      // quests
      user.get('unlocked_user_quest').then(userQuests => {
        userQuests.forEach(currentUserQuest => {
          currentUserQuest.get('quest').then(quest => {
            quest.get('quest_fulfillment_conditions').then(conditions => {
              conditions.forEach(condition => {
                if(condition.get('action') === 'collect' && condition.get('object') === 'stars') {
                  var new_amount = currentUserQuest.get('current_amount') + this.get('gameState').get('stars');
                  console.log(new_amount, " <= ", condition.get('amount'));
                  if(new_amount < condition.get('amount')) {
                    currentUserQuest.set('current_amount', new_amount);
                  }
                  else {
                    currentUserQuest.set('current_amount', condition.get('amount'));
                  }
                }
              });
            });
          });
        });
      });
    });
  },

  checkForPostPermission: function(callback) {
    this.set('hasPostPermission', false);
    FB.api('/me/permissions', response => {
      if( !response.error ) {
        for( var i=0; i < response.data.length; i++ ) {
    	    if(response.data[i].permission === 'publish_actions' && response.data[i].status === 'granted' ) {
            this.set('hasPostPermission', true);
          }
      	}
        if(callback) {
          callback();
        }
	    }
	    else {
	      console.error('ERROR - /me/permissions', response);
        if(callback) {
          callback();
        }
	    }
  	});
  },

  sendScoreToFB: function() {
    this.checkForPostPermission(() => {
      if(this.get('hasPostPermission')) {
        FB.api('/me/scores/', 'post', { score: this.get('newScore') }, response => {
          if( response.error ) {
            console.error('sendScoreToFB failed', response);
            this.set('hasBeenPosted', false);
          }
          else {
            console.log('Score posted to Facebook', response);
          }
        });
        // FB.ui({
        //   method: 'share_open_graph',
        //   action_type: 'games.highscores',
        //   action_properties: JSON.stringify ({
        //     game: 'https://apps.facebook.com/little_rocket/',
        //     old_high_score: this.get('oldScore'),
        //     new_high_score: this.get('newScore')
        //   }),
        // },
        // response => {
        //   if(response.error_code) {
        //     console.error('sendHighscoreToFB failed', response);
        //   }
        //   else {
        //     console.log('Highscore posted to FB', response);
        //   }
        // });
      }
    });
  },

  postScoreToFB: function() {
    this.set('highscoreHasBeenPosted', true);

    var app_id = ENV.fb_app_id;
    var old_score = this.get('oldScore');
    var new_score = this.get('newScore');

    this.get('me').get('user').then(user => {
      FB.ui({
        method: 'feed',
        app_id: app_id,
        link: 'http://apps.facebook.com/little_rocket/',
        name: user.get('first_name') + ' achieved a new highscore in Little Rocket',
        description: 'old highscore: ' + old_score + '  ----  new highscore: ' + new_score,
        caption: 'Little Rocket',
      }, response => {
        if( response.error_code ) {
          console.error('sendScoreToFB failed', response);
          this.set('highscoreHasBeenPosted', false);
        }
        else {
          console.log('Score posted to Facebook', response);
        }
      });
    });
  },

  postNewStageToFB: function() {
    this.set('newStageHasBeenPosted', true);

    var new_stage = this.get('gameState').get('level');
    var app_id = ENV.fb_app_id;

    this.get('me').get('user').then(user => {
      FB.ui({
        method: 'feed',
        app_id: app_id,
        link: 'http://apps.facebook.com/little_rocket/',
        name: user.get('first_name') + ' reached stage ' + new_stage + ' in Little Rocket',
        description: 'I reached a new stage in Little Rocket. Can you beat me?',
        caption: 'Little Rocket',
      }, function(response) {
        if( response.error_code ) {
          console.error('sendNewStageToFB failed', response);
          this.set('newStageHasBeenPosted', false);
        }
        else {
          console.log('New stage posted to Facebook', response);
        }
      });
    });
  },

  reactToKeyUp(e) {
    // console.log('key pressed', e);
    // arrow up
    if(e.keyCode === 38) {
      Ember.$("#button-1").addClass("active");
      Ember.$("#button-2").removeClass("active");
      e.data._self.set('selectedButton', 'button-1');
    }
    // arrow down
    else if(e.keyCode === 40) {
      Ember.$("#button-1").removeClass("active");
      Ember.$("#button-2").addClass("active");
      e.data._self.set('selectedButton', 'button-2');
    }
    // enter
    else if(e.keyCode === 13) {
      e.data._self.get(e.data._self.get('selectedAction'))();
    }
  },

  willDestroyElement: function(){
    Ember.$(document).off('keyup', this.reactToKeyUp);
  },

  actions: {
    postScoreToFB() {
      this.checkForPostPermission(() => {
        if(this.get('hasPostPermission')) {
          this.postScoreToFB();
        }
        else {
          this.reRequestPostPermission(() => {
            this.postScoreToFB();
          });
        }
      });
    },
    postNewStageToFB() {
      this.checkForPostPermission(() => {
        if(this.get('hasPostPermission')) {
          this.postNewStageToFB();
        }
        else {
          this.reRequestPostPermission(() => {
            this.postNewStageToFB();
          });
        }
      });
    },
    tryAgain() {
      this.get('tryAgainAction')();
    },
    selectStage() {
      this.get('selectStageAction')();
    },
    openSection(section) {
      this.set('currentCongratzSection', section);
    },
    openBuyEnergyDialog() {
      this.get('openBuyEnergyDialogAction')();
    }
  },

  reloadAdBanner() {
    try {
      new LSM_Slot({
          adkey: '6df',
          ad_size: '728x90',
          slot: 'slot126743',
          _render_div_id: 'footer_banner',
          _preload: true
      });
    }
    catch(e) {
      console.log(e);
    }
  }

});
