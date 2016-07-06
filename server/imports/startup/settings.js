  nconf = require('nconf');

// Import from process.env and process.argv
  nconf.argv().env();


//  nconf.file({file: '../../../private/setings.env.json'});
//  nconf.file({file: '../../../private/settings.google.json'});
// Import from /private assets
  nconf.add('env', { type: 'literal', store: JSON.parse(Assets.getText("settings.env.json"))});
  nconf.add('google', { type: 'literal', store: JSON.parse(Assets.getText("settings.google.json"))});
// Set Defaults
