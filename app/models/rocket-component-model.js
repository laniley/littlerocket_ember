import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('String'),
  model: DS.attr('number'),
  costs: DS.attr('number', { defaultValue: 500 }),
  construction_time: DS.attr('number', { defaultValue: 120 }),
  description: DS.attr('String' , { defaultValue: '' }),
  is_active: DS.attr('Boolean', { defaultValue: true}),

  tooltip: function() {
    return "You need " + this.get('costs') + " stars to unlock this " + this.get('type') + " model.";
  }.property('costs', 'type'),

  icon: function() {
    if(this.get('type') === 'cannon') {
      if(this.get('model') === 1) {
        return "ellipsis-v";
      }
      else if(this.get('model') === 2) {
        return "wifi";
      }
      else if(this.get('model') === 3) {
        return "crosshairs";
      }
      else if(this.get('model') === 4) {
        return "flash";
      }
    }
    else if(this.get('type') === 'shield') {
      return "shield";
    }
    else if(this.get('type') === 'engine') {
      return "forward";
    }
  }.property('type'),

  rareness: function() {
    return 'common';
    // if(this.get('model') === 1) {
    //   return 'common';
    // }
    // else if(this.get('model') === 2) {
    //   return 'uncommon';
    // }
    // else if(this.get('model') === 3) {
    //   return 'rare';
    // }
    // else {
    //   return 'common';
    // }
  }.property('model')
});
