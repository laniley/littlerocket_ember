/* global LSM_Slot */
import injectScript from 'ember-inject-script';

export function initialize(/* application */) {
  var url = "//ads.lfstmedia.com/getad?site=268210";
  injectScript(url).then(function() {
    new LSM_Slot({
        adkey: '6df',
        ad_size: '728x90',
        slot: 'slot126743',
        _render_div_id: 'footer_banner',
        _preload: true
    });
  });
}

export default {
  name: 'lfstmedia',
  initialize
};
