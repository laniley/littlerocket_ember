import Ember from 'ember';
import DS from 'ember-data';
import { memberAction /*, collectionAction */ } from 'ember-api-actions';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  user: belongsTo('user'),
  current: attr('number', { defaultValue: 10}),
  max: attr('number', { defaultValue: 10}),
  last_recharge: attr('date'),

  buy: memberAction({ path: 'buy' }),

  isFull: Ember.computed('current', 'max', function() {
    return this.get('current') === this.get('max');
  })
});
