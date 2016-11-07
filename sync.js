var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;
var fun = require('./functions.js');
var async = require('async');
//import waterfall from 'async/waterfall';

exports.handler = function(event, context) {

async.series([
    function(callback) {
        da.historyRecord(event);
        callback(null, 'one');
    },
    function(callback) {
        // do some more stuff ...
        callback(null, 'two');
    }
],
// optional callback
function(err, results) {
console.log(results);
   context.succeed('test'); // results is now equal to ['one', 'two']
});



}