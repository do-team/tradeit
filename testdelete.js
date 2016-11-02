var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;

exports.handler = function(event, context) {

var data = common.parseInputOrder(event.text);


                                            da.deleteLowestBid(data, function(err, delRows) {
                                                if (err !== null) {
                                                    context.fail(err);
                                                } else {
                                                    console.log('Irrelevant BUY orders found!');
                                                }
                                            });
};