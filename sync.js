var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;
var fun = require('./functions.js');
var async = require('async');


exports.handler = function(event, context) {

async.waterfall([
    myFirstFunction,
    mySecondFunction,
    myLastFunction,
], function (err, result) {
    context.succeed(result);
    // result now equals 'done'
});
function myFirstFunction(callback) {
    da.historyRecord(event);
    callback(null, 'one', 'two');
}
function mySecondFunction(arg1, arg2, callback) {
    console.log(arg1, arg2); // arg1 now equals 'one' and arg2 now equals 'two'
    callback(null, 'three');
}
function myLastFunction(arg1, callback) {
    console.log(arg1);
    // arg1 now equals 'three'
    callback(null, 'four');
}

}