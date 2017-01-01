
// IMPORTS
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';
  import { UserSchema } from '../models/user.model'

// CREATE USER COLLECTION
  var UsersCollection = new Mongo.Collection('users');
  UsersCollection.attachSchema(UserSchema);
  export const Users = new MongoObservable.Collection(UsersCollection);
