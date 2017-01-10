/*
 * config.service.ts
 * Imports configuration variables from the /private folder,
 * and saves them in an nconf object for use by other parts
 * of the application.
 */

  import * as _ from "underscore";
  import * as nconf from 'nconf';

  /*
    Files to be imported by nconf. Must be stored in
    settings.*.json, and must not have other namespace
    conflicts.
  */
  const configFiles = [
    "env",
    "labvm",
    "domain",
    "login"
  ]

  class TuxConfig extends nconf.Provider {
    constructor(){
      super([]);

      // Import from process.env and process.argv
      super.argv().env();

      // Import from assets specified abovse
      _.each(configFiles, function(name : string){
        this.add(name, {
          type: 'literal',
          store: JSON.parse(Assets.getText("settings."+name+".json"))
        });
      });
    }
  }

  export const ConfigService = new TuxConfig();
