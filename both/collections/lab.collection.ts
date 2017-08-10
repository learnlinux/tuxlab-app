
/**
  IMPORTS
**/
  import * as _ from 'lodash';
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { LabSchema } from '../schemas/lab.schema';
  import { Lab } from '../models/lab.model';
  import { Role } from '../models/user.model';
  import { Users } from '../collections/user.collection';

/**
  CREATE USER COLLECTION
**/
  class LabCollection extends Mongo.Collection<Lab> {
    public observable : MongoObservable.Collection<Lab>;

    constructor(){
      super('labs');
      this.attachSchema(LabSchema);

      // Create Observable
      this.observable = new MongoObservable.Collection(this);

      // Permissions
      const allowed_fields = ['name', 'description', 'status', 'updated' ];
      super.allow({
        update: (user_id : string, lab : Lab, fields : string[]) => {
          return _.reject(fields, key => _.includes(allowed_fields, key)).length === 0 &&
          Users.getRoleFor(lab.course_id, user_id) >= Role.instructor;
        },
        fetch: ["course_id"]
      });
    }
  }
  export const Labs = new LabCollection();
