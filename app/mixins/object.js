import Ember from 'ember';

export default Ember.Mixin.create({

  needed_stars: 0,
  not_enough_stars: false,

  needed_level: 0,
  level_not_reached: false,

  show_missing_requirements_message: false,

  missing_requirements_message: function() {

    var text = 'You need ';

    if(this.get('not_enough_stars')) {
      text += this.get('needed_stars') + ' stars';
      if(this.get('level_not_reached')) {
        text += ' and';
      }
    }

    if(this.get('level_not_reached')) {
      text += ' to reach level ' + this.get('needed_level');
    }

    text += '!';

    return text;

  }.property('not_enough_stars', 'level_not_reached'),

  buy: function(user, object) {
    this.set('level_not_reached', false);
    this.set('not_enough_stars', false);
    if(user.get('stars') >= object.get('costs') &&
       user.get('exp_level') >= this.get('needed_level')) {

        var now = Math.floor(new Date().getTime() / 1000); // current timestamp in seconds

        object.set('construction_start', now);
        object.set('status', 'under_construction');
        object.save().then(component => {
          user.set('stars', user.get('stars') - component.get('costs'));
          user.save();
        });
    }
    else {
      if(user.get('exp_level') < this.get('needed_level')) {
        this.set('level_not_reached', true);
      }
      if(user.get('stars') < object.get('costs')) {
        this.set('needed_stars', object.get('costs'));
        this.set('not_enough_stars', true);
      }
      this.set('show_missing_requirements_message', true);
    }
  }
});
