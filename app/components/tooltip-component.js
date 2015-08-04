import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['tooltip-component'],
  tagName: 'span',
  tooltip: '',
  id: '',
  didInsertElement: function() {
    Ember.$(document).foundation();
    this.set('id', Ember.$('#' + this.get('elementId') + ' > .has-tip').attr('aria-describedby'));
  },
  willDestroyElement: function() {
    Ember.$('#' + this.get('id')).remove();
  }
});
