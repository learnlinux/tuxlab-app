
// Confgiure Google Provider
  ServiceConfiguration.configurations.remove({
    service: "google"
  });

  ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: nconf.get("google_client"),
    secret: nconf.get("google_secret")
  });

// User Creation
Accounts.onCreateUser(function(options, user){

  // Copy Profile
  if (options.profile)
    user.profile = options.profile;

  // Create Roles Object
  user.roles = {
    'student' : [],
    'instructor' : [],
    'administrator' : []
  }

  // Return User
  return user;
});

// Login Validation
Accounts.validateNewUser(function(user){
  if(!user){
    TuxLog.log('warn', "user not found");
    return false;
  }
  if(!user.services){
    TuxLog.log('warn', "user.services not found");
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
  TuxLog.log('silly', "user logged in successfully");
  user.profile.picture = user.services.google.picture;
  user.profile.firstName = user.services.google.given_name;
  user.profile.lastName = user.services.google.family_name;
  user.profile.email = user.services.google.email;
  return true;
});
