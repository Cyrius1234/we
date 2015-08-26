#!/usr/bin/env node

/**
 * Script to install project stub data
 */

var requireAll = require('require-all');
var helpers = require('../lib/helpers');
var async = require('async');
var sget = require('sget');
var we;

module.exports = function run(program) {
  we = helpers.getWe();
  var projectFolder = process.cwd();

  var configs = {};
  if (program.resetdatabase) {
    configs = {
      database: { resetAllData: true }
    };
  }

  we.bootstrap(configs,function(err, we) {
    if (err) return doneAll(err);

    var scripts = requireAll({
      dirname     :  projectFolder + '/bin/install/',
      excludeDirs :  /^(data)$/,
      filter      :  /(.+)\.js$/
    });

    var scriptNames = Object.keys(scripts);
    async.eachSeries(scriptNames, function(scriptName, next) {
      scripts[scriptName](we, function(err){
        if (err) return next(err);
        we.log.info('DONE ' + scriptName);
        next();
      }, sget, program);
    }, doneAll);
  });
};

function doneAll(err) {
  if ( err ) {
    we.log.error('Error:', err);
  } else {
    we.log.info('DONE All');
  }

  we.exit(function(){
    process.exit();
  });
}