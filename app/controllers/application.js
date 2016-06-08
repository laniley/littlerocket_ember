/* global LSM_Slot */
import Ember from 'ember';

export default Ember.Controller.extend({
  didRender() {
    new LSM_Slot({
        adkey: '6df',
        ad_size: '728x90',
        slot: 'slot126743',
        _render_div_id: 'footer_banner',
        _preload: true
    });
  },

  actions: {
    close() {
      this.transitionToRoute('index', { queryParams: { overlay_section: 'none' }});
    }
  }
});
