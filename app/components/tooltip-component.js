import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'tooltip-component',
  tagName: 'span',
  tooltip: '',
  didInsertElement: function() {
    Ember.$(document).foundation();
  }
});
