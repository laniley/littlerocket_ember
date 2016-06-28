/* global LSM_Slot */
import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['ad-banner'],

  didInsertElement() {
    try{
      new LSM_Slot({
          adkey: '6df',
          ad_size: '728x90',
          slot: 'slot126743',
          _render_div_id: this.get('id'),
          _preload: true
      });
    }
    catch(e) {
      console.log(e);
    }
  }
});
