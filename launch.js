var _ = require("underscore");
var settings = require("./settings");

console.log("************************")
console.log("Preparing launch...")
console.log("************************")
console.log("Configuring environment variables.");
/* Set NODE_ENV
 * Checks if already set or passed as parameter.
 * Defaults to dev
 */
if(! process.env.NODE_ENV) {
  var env = process.argv[2];
  if(! _.contains(["dev", "prod", "test"], env) ) {
      env = settings.env;
  }
  if(! _.contains(["dev", "prod", "test"], env) ) {
          env = "dev";
  }
  process.env.NODE_ENV = env;
  console.log(">> setting : NODE_ENV = "+process.env.NODE_ENV);
} else {
  console.log(">>   found : NODE_ENV = "+process.env.NODE_ENV);
}

/*
 * Set the NODE_CONFIG_DIR if not set
 */ 
if(! process.env.NODE_CONFIG_DIR) {
  process.env.NODE_CONFIG_DIR = settings.root+"/configs";
  console.log(">> setting : NODE_CONFIG_DIR = "+process.env.NODE_CONFIG_DIR);
} else {
  console.log(">>   found : NODE_CONFIG_DIR = "+process.env.NODE_CONFIG_DIR);
}

/*
 * Load the application config and merge with settings
 */
CONFIG = require("config");
for(var key in settings) {
  if(settings.hasOwnProperty(key)) {
    CONFIG[key] = settings[key];
  }
}
CONFIG["env"] = env;

/*
 * Launch the application
 */
console.log("Launching app...");
var app = require("./app");
app.run(CONFIG.port);
