
// Get JSON Config
  var tuxconf = {};
  tuxconf = JSON.parse(Assets.getText("tuxlab.json"));

// Validate that Google Auth Users are from Domain

// Configure Google Auth
  ServiceConfiguration.configurations.remove({
    service: "google"
  });

  ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: tuxconf.google_client,
    secret: tuxconf.google_secret
  });

// Configure Login Validation
  Accounts.validateLoginAttempt(function(params){
    switch (params.type){
      case "google":

        // Verify Google Domain
        var google_user = params.user.services.google;
        return (google_user.email.match(new RegExp(tuxconf.google_domain)));

      default:
        throw new Meteor.Error(403, 'Non-Google Logins are not Supported.');
        return false;
    }
});
