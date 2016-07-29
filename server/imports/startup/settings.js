nconf = require('nconf');

// Import from process.env and process.argv
  nconf.argv().env();

// Import from /private assets
  nconf.add('env', { type: 'literal', store: JSON.parse(Assets.getText("settings.env.json"))});
  nconf.add('domain', { type: 'literal', store: JSON.parse(Assets.getText("settings.domain.json"))});
  nconf.add('labvm', { type: 'literal', store: JSON.parse(Assets.getText("settings.labvm.json"))});
  nconf.add('google', { type: 'literal', store: JSON.parse(Assets.getText("settings.google.json"))});
// Set Defaults
