
// Get JSON Config
  var tuxconf = {};
  tuxconf = JSON.parse(Assets.getText("tuxlab.json"));

// Configure Google Auth
  ServiceConfiguration.configurations.remove({
    service: "google"
  });

  ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: tuxconf.google_client,
    secret: tuxconf.google_secret
  });
