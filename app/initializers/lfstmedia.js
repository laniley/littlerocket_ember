import injectScript from 'ember-inject-script';

export function initialize(/* application */) {
    injectScript("//ads.lfstmedia.com/getad?site=268210");
}

export default {
  name: 'lfstmedia',
  initialize
};
