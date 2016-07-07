import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['lr-progress'],

  classNameBindings: ['isCompleted:lr-progress--is-completed', 'success:lr-progress--success'],

  reached: 0,

  total: 100,

  withAchievementPoints: false,

  percentage: Ember.computed('reached', 'total', function () {

    return this.get('reached') / this.get('total') * 100;

  }),

  isCompleted: Ember.computed('percentage', function () {

    if (Number(this.get('percentage')) === 100) {

      return true;

    } else {

      return false;

    }

  }),

  inProgress: Ember.computed('percentage', function () {

    if (Number(this.get('percentage')) < 100 && Number(this.get('percentage')) > 0) {

      return true;

    } else {

      return false;

    }

  }),

  barWidth: Ember.computed('percentage', function () {

    return new Ember.Handlebars.SafeString('width:' + this.get('percentage') + '%');

  }),

});
