/* Additional Information Schema that will be added to the user account */
addInfoSchema = new SimpleSchema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    andrewId: {
        type: String
    },
    role: {
        type: String
    }
});

/* Create Users Schema */
userSchema = new SimpleSchema({
    _id: {
        type: String
    },
    emails: {
        type: Array
    },
    username: {
        type: String,
        label: "Username"
    },
    'emails.$': { 
        type: Object 
    },
    'emails.$.address': { 
        type: String 
    },
    'emails.$.verified': { 
        type: Boolean 
    },
    createdAt: { 
        type: Date
    },
    services: { 
        type: Object, 
        blackbox: true 
    },
    newInfo: {
        type: addInfoSchema
    }
});

/* Example Data */
const myNewInfo = {
    firstName: 'Cem',
    lastName: 'Ersoz',
    andrewId: 'cersoz',
    role: 'Student'
}
const myUser = {
    username: 'cemersoz',
    password: '123456',
    email: 'cersoz@andrew.cmu.edu',
    newInfo: myNewInfo
};



/* This function creates a new user with additional information */
function createNewUser(user) {
    Accounts.createUser(user);
    Accounts.onCreateUser(function(ninfo, usr) {
        usr.newInfo = myUser.newInfo;
        return usr;
    });
}
