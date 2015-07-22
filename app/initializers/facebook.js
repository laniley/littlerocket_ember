import ENV from '../config/environment';

export function initialize(container, application) {
  var debug = true;

  // Wait for Facebook to load before allowing the application
  // to fully boot. This prevents `ReferenceError: FB is not defined`
  application.deferReadiness();

  var fbAsyncInit = function() {
      initFacebook(window.FB);
      application.advanceReadiness();
  };

  loadFacebookSDK(debug);

  window.fbAsyncInit = fbAsyncInit;
}

function initFacebook(FB) {
    FB.init({
        appId      : ENV.fb_app_id,
        xfbml      : true,
        version    : 2.4
    });
}

function loadFacebookSDK(debug) {
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = debug ? "//connect.facebook.net/en_US/all/debug.js" : "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

export default {
  name: 'facebook',
  initialize: initialize
};
