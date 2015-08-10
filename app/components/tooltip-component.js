import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['tooltip-component'],
  tagName: 'span',
  tooltip: '',
  id: '',

  didInsertElement: function() {
    Ember.$(document).foundation();
    this.set('id', Ember.$('#' + this.get('elementId') + ' > .has-tip').attr('aria-describedby'));
    Ember.$('#' + this.get('id')).html(this.get('tooltip'));
  },

  onTooltipChange: function() {
    Ember.$('#' + this.get('id')).html(this.get('tooltip'));
  }.observes('tooltip').on('init'),

  willDestroyElement: function() {
    Ember.$('#' + this.get('id')).remove();
  }
});
