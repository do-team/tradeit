var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;
var fun = require('./functions.js');
var async = require('async');


exports.handler = function(event, context) {
    async.series([
        function (skipCallback) {
            da.historyRecord(event, context, fun.doNothing, skipCallback);
        },
        function (skipCallback) {
            switch (event.text.toLowerCase()) {
                case "products":
                    da.getProductNames(context, fun.displayProducts, skipCallback);
                     // Special command to display available products on market.
                    break;
                case "help":
                    console.log('HELP recognised!'); // Future redirect to external file with nice HELP page.
                    break;
                case "test":
                    context.succeed('test');
                    break;
            }
        },
    ], function(err, results) {
        context.succeed(results);
    });
}
