// Publish Roles and Sessions to Client
  Meteor.methods({
    'getUserProfile': function(uid : string){
     if(Roles.isGlobalAdministrator(this.userId)){
        return Meteor.users.findOne(uid).profile;
     }
     else{
        throw new Meteor.Error("Auth", "Must be global admin to access user profile.");
     }
   }
  })

// getUserProfile Method for Administrators
  if(Meteor.isServer) {
    Meteor.startup(function() {
      Meteor.publish('userRoles', function() {
        this.autorun(function(computation) {
          return Meteor.users.find(this.userId, { fields: { "roles": 1, "sessions": 1} });
        });
      });
    });
  }
