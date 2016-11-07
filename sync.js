var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;
var fun = require('./functions.js');
var async = require('async');

exports.handler = function(event, context) {
async.series([

        da.historyRecord(event);
]);

};