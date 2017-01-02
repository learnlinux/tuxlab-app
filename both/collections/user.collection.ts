
/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { UserSchema } from '../schemas/user.schema'
  import { User } from '../models/user.model'

/**
  CREATE USER COLLECTION
**/
  export const Users = new Mongo.Collection<User>('users');
  Users.attachSchema(UserSchema);
  export const UsersObsv = new MongoObservable.Collection<User>(Users);
