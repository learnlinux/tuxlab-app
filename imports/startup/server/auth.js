ServiceConfiguration.configurations.remove({
    service: "google"
  });

  ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: nconf.get("google_client"),
    secret: nconf.get("google_secret")
  });

// Configure Login Validation

Accounts.validateNewUser(function(user){
  if(!user){ 
    console.log("why is this happening!?")
  }
  if(!user.services){
    console.log("user.services not found wtf");
    return false;
  }
  if(!user.services.google){
    throw new Meteor.Error(403, 'Non-Google Logins not yet Supported.') 
    return false;
  }
  if(!user.services.google.email.match(new RegExp(nconf.get("google_domain")))){
    throw new Meteor.Error(403, 'only '+nconf.get("google_domain")+' emails permitted at this time');
    return false;
  }
  console.log("login success");
  user.profile.picture = user.services.google.picture;
  user.profile.firstName = user.services.google.given_name;
  user.profile.lastName = user.services.google.family_name;
  user.profile.email = user.services.google.email;
  return true;
});


/*
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
});*/
