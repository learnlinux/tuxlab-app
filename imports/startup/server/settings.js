  nconf = require('nconf');

// Import from process.env and process.argv
  nconf.env().argv();

// Import from /private assets
  nconf.add('env', { type: 'literal', store: Assets.getText("settings.env.json")});
  nconf.add('google', { type: 'literal', store: Assets.getText("settings.google.json")});

// Set Defaults
