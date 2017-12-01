#!/usr/bin/env node

var MCServer=require("./").MCServer;

var settings;

try {
  settings = require('./config/settings');
}
catch(err) {
  settings = require('./config/default-settings');
}

module.exports=new MCServer(settings).connect();


process.on('unhandledRejection', err => {
  console.log(err.stack);
});