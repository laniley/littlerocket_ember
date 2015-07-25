import DS from 'ember-data';

export default DS.Model.extend({
  hasAShield: DS.attr('boolean', { defaultValue: false }),
  hasASpecialEngine: DS.attr('boolean', { defaultValue: false }),
  user: DS.belongsTo('user', { async: true }),
  canon: DS.belongsTo('canon', { async: true }),

  hasACanon: function() {
    this.get('canon').then(canon => {
      if(Ember.isEmpty(canon)) {
        return false;
      }
      else {
        return true;
      }
    })
  }.property('canon')
});
