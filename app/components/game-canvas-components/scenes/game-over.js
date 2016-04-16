/* global FB */
/* global LSM_Slot */
import Ember from 'ember';
import FacebookLoginMixin from './../../../mixins/facebook-login';

export default Ember.Component.extend(FacebookLoginMixin, {

  gameState: null,
  me: null,
  tryAgainAction: null,
  selectedAction: 'tryAgainAction',
  selectStageAction: null,
  hasPostPermission: false,
  hasBeenPosted: false,
  newScore: 0,
  oldScore: 0,

  init() {
    this._super();
    Ember.$(document).on('keyup', { _self: this }, this.reactToKeyUp);
    this.get('gameState').set('speed', 0);

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

    this.set('me', this.store.peekRecord('me', 1));

    this.get('me').get('user').then(user => {
      this.set('oldScore', user.get('score'));
      if(this.get('newScore') > user.get('score')) {
        user.set('score', this.get('newScore'));
        this.set('isNewHighscore', true);
      }
      else {
        this.set('isNewHighscore', false);
      }

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

      var new_stars_amount = user.get('stars') + (this.get('gameState').get('stars') * this.get('gameState').get('level'));
      var new_experience = user.get('experience') + this.get('newScore');
      user.set('stars', new_stars_amount);
      user.set('stars_all_time', user.get('stars_all_time') + (this.get('gameState').get('stars') * this.get('gameState').get('level')));
      user.set('experience', new_experience);
      user.set('flights', user.get('flights') + 1);

      user.save();

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
    this.set('hasBeenPosted', true);

    // FB.api('/me/scores/', 'post', { score: this.get('newScore') }, response => {
    //   if( response.error ) {
    //     console.error('sendScoreToFB failed', response);
    //     this.set('hasBeenPosted', false);
    //   }
    //   else {
    //     console.log('Score posted to Facebook', response);
    //   }
    // });

    var old_score = this.get('oldScore');
    var new_score = this.get('newScore');

    FB.ui({
      method: 'share_open_graph',
      action_type: 'games.highscores',
      action_properties: JSON.stringify({
      game:'https://apps.facebook.com/little_rocket/',
        old_high_score: old_score,
        new_high_score: new_score
      })
    }, response => {
      if( response.error_code ) {
        console.error('sendScoreToFB failed', response);
        this.set('hasBeenPosted', false);
      }
      else {
        console.log('Score posted to Facebook', response);
      }
    });
  },

  reactToKeyUp(e) {
    // console.log('key pressed', e);
    // arrow up
    if(e.keyCode === 38) {
      Ember.$(".try-again").addClass("active");
      Ember.$(".select-stage").removeClass("active");
      e.data._self.set('selectedAction', 'tryAgainAction');
    }
    // arrow down
    else if(e.keyCode === 40) {
      Ember.$(".try-again").removeClass("active");
      Ember.$(".select-stage").addClass("active");
      e.data._self.set('selectedAction', 'selectStageAction');
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
          this.sendScoreToFB();
        }
        else {
          this.reRequestPostPermission(() => {
            this.sendScoreToFB();
          });
        }
      });
    },
    tryAgain() {
      this.get('tryAgainAction')();
    },
    selectStage() {
      this.get('selectStageAction')();
    }
  }

});
