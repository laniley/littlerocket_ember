/* global LSM_Slot */
import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    new LSM_Slot({
        adkey: '6df',
        ad_size: '728x90',
        slot: 'slot126743',
        _render_div_id: 'footer_banner',
        _preload: true
    });
  }
});
