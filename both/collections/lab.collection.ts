
/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { LabSchema } from '../schemas/lab.schema'
  import { Lab } from '../models/lab.model'

/**
  CREATE USER COLLECTION
**/
  export const Labs = new Mongo.Collection<Lab>('labs');
  Labs.attachSchema(LabSchema);
  export const LabsObsv = new MongoObservable.Collection<Lab>(Labs);
