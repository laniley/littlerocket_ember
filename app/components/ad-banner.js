/* global LSM_Slot */
import Ember from 'ember';

export default Ember.Component.extend({
    // web worker example https://github.com/remy/html5demos/blob/master/js/worker-main.js
    classNames: ['ad-banner'],
    classNameBindings: ['type'],
    elementId: 'ad-banner-footer',

    didInsertElement() {
        try{
            new LSM_Slot({
                adkey: this.get('adKey'),
                ad_size: this.get('adSize'),
                slot: this.get('slot'),
                _render_div_id: this.get('elementId'),
                _preload: true,
                // _guard: true
            });
        }
        catch(e) {
            console.log(e);
        }
    }
});
