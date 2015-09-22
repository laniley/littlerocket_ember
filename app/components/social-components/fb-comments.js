/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'fb-comments-container',
  didInsertElement: function() {
    document.getElementById(this.get('elementId')).setAttribute('fb-xfbml-state', 'rendered');

    // This makes FB-SDK render the HTML-stubs inserted by the ember components
    Ember.run.debounce(this, FB.XFBML.parse, 100);
  }
});
