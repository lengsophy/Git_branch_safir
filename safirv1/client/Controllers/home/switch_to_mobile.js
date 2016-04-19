// This function use for switching to the mobile saifir when open with mobile device
Tracker.autorun(function (computation) {
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      window.location = "http://m.safirperfumery.com";
    }
});