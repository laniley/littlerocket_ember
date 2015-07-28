import Ember from 'ember';

export default Ember.Component.extend({
  me: null,

  actions: {
    buy: function(component) {
      if(stars_count >= component.costs) {
    		this.setCanonStatus('under_construction');
    		stars_count -= component.costs;
    		sendStars(stars_count, renderStars());
    		sendCanon('under_construction', component.capacity);
    	}
    }
  }
});
