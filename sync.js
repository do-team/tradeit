var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;
var fun = require('./functions.js');
var async = require('async');


exports.handler = function(event, context) {

    var data = common.parseInputOrder(event.text); // Now we got data.command, data.product and data.price.

    console.log(data);

    async.series([
        function (skipCallback) {
         // 1. Writing to history must happen first, before everything else.
            da.historyRecord(event, context, fun.doNothing, skipCallback);
        },

        function (skipCallback) {
         // 2. This switch must happen after history record. Program ends after this switch.
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

        function (skipCallback) {
        // 3. Next step is parsing of event to data array.
            console.log('here');
            // We have to confirm, if data.command does exists.
            da.confirmCommand(data, context, fun.incomingCommand, skipCallback);
        },
/*
        function (skipCallback) {
        // 5. Then we have to rule out, that user is sending nonexistent product name. If yes, program ends.
            da.confirmProductAvailable(data, context, fun.incomingProduct, skipCallback);
        },

        function (skipCallback) {
        // 6. Now if user sends no price, we will tell him, what is available. Program ends after it.
            if (!data.price) {
                context.data = data;
                switch (data.command) {
                    case "BUY":
                        da.getAskPrices(data, context, fun.showPrices, skipCallback);
                        break;
                    case "SELL":
                        da.getBidPrices(data, context, fun.showPrices, skipCallback);
                        break;
                }
            return;
            }
        },

        function (skipCallback) {

        },

        function (skipCallback) {

        },
*/
    ], function(err, results) {
        context.succeed(results);
    });
}
