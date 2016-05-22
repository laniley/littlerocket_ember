import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['tooltip-component'],
  tagName: 'span',
  hover_delay: 50,
  id: '',
  tooltip: '',
  direction: 'bottom',

  didInsertElement: function() {
    Ember.$('#' + this.get('elementId')).foundation();
    this.set('id', Ember.$('#' + this.get('elementId') + ' > .has-tip').attr('aria-describedby'));
    Ember.$('#' + this.get('id')).html(this.get('tooltip'));
  },

  onTooltipChange: function() {
    if(this.get('tooltip').toString().indexOf('PromiseObject') !== -1) {
      this.get('tooltip').then(tooltip => {
        Ember.$('#' + this.get('id')).html(tooltip);
      });
    }
    else {
      Ember.$('#' + this.get('id')).html(this.get('tooltip'));
    }
  }.observes('tooltip').on('init'),

  willDestroyElement: function() {
    Ember.$('#' + this.get('id')).remove();
  }
});
