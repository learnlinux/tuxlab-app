
/**
  IMPORTS
**/
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { CourseSchema } from '../schemas/course.schema'
  import { Course } from '../models/course.model'

/**
  CREATE USER COLLECTION
**/
  export const Courses = new Mongo.Collection<Course>('courses');
  Courses.attachSchema(CourseSchema);
  export const CoursesObsv = new MongoObservable.Collection<Course>(Courses);
