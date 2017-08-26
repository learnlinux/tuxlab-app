/*
 * TuxLab Console Output Forwarding
 * @author Derek Brown
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { ConsoleOutput, ConsoleOutputType } from '../../../both/models/console_output.model';

export class ClientConsole {
  private consoleCollection;

  constructor(){
    // Create Console Collection
    this.consoleCollection = new Mongo.Collection<ConsoleOutput>('_console', {connection: null});

    // Publish Console Collection
    Meteor.publish('_console', () => {
      if(Meteor.userId()){
        return this.consoleCollection.find({
          user_id : Meteor.userId()
        });
      }
    })
  }

  private emit(type : ConsoleOutputType, args : Object[]){
    this.consoleCollection.insert({
      createdAt: (new Date()),
      user_id: Meteor.userId(),
      type: type,
      args: args
    })
  }

  public info(...args : string[]){
    this.emit(ConsoleOutputType.info, Array.from(arguments));
  }

  public log(...args : string[]){
    this.emit(ConsoleOutputType.log, Array.from(arguments));
  }

  public warn(...args : string[]){
    this.emit(ConsoleOutputType.warn, Array.from(arguments));
  }

  public error(...args : string[]){
    this.emit(ConsoleOutputType.error, Array.from(arguments));
  }
}
