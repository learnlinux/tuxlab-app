// Configure Google Auth
  ServiceConfiguration.configurations.remove({
    service: "google"
  });

  ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: nconf.get("google_client"),
    secret: nconf.get("google_secret")
  });

// Configure Login Validation
  Accounts.validateLoginAttempt(function(params){
    switch (params.type){
      case "google":

        // Verify Google Domain
        var google_user = params.user.services.google;
        return (google_user.email.match(new RegExp(nconf.get("google_domain"))));

      default:
        throw new Meteor.Error(403, 'Non-Google Logins are not Supported.');
        return false;
    }
});
