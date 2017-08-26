/*
 * TuxLab Console Output Forwarding
 * @author Derek Brown
 */

import * as _ from "lodash";
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

    args = _.map(args, a => { return JSON.stringify(a) });

    this.consoleCollection.insert({
      createdAt: (new Date()),
      user_id: Meteor.userId(),
      type: type,
      args: JSON.stringify(args)
    })
  }

  public info(...args : Object[]){
    this.emit(ConsoleOutputType.info, args);
  }

  public log(...args : Object[]){
    this.emit(ConsoleOutputType.log, args);
  }

  public warn(...args : Object[]){
    this.emit(ConsoleOutputType.warn, args);
  }

  public error(...args : Object[]){
    this.emit(ConsoleOutputType.error, args);
  }
}

export var clientConsole = new ClientConsole();
