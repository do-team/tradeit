var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;
var fun = require('./functions.js');
var async = require('async');

exports.handler = function(event, context) {



    async.series([
        function (resultCallback) {
         // 1. Writing to history must happen first, before everything else.
            da.historyRecord(event, context, fun.doNothing, resultCallback);
            resultCallback(null, 'History record.');
        },

        function (resultCallback) {
         // 2. This switch must happen after history record. Program ends after this switch.
            switch (event.text.toLowerCase()) {
                case "products":
                    da.getProductNames(context, fun.displayProducts, resultCallback);
                    break;
                case "help":
                    context.succeed('HELP recognised!'); // Future redirect to external file with nice HELP page.
                    break;
                case "test":
                    context.succeed('TEST OK');
                    break;
            }
            resultCallback(null, 'Special command not identified.');
        },

        function (resultCallback) {
        // 3. We have to confirm, if data.command does exists on the market.
            var data = common.parseInputOrder(event.text, context); // Now we got data.command, data.product and data.price.
            exports.data = data;
            //console.log(data);
            da.confirmCommand(data, context, fun.incomingCommand, resultCallback);
            resultCallback(null, 'Confirm command.');
        },
/*
        function (resultCallback) {
        // 5. Then we have to rule out, that user is sending nonexistent product name. If yes, program ends.
            da.confirmProductAvailable(data, context, fun.incomingProduct, resultCallback);
            resultCallback(null, 'Confirm products.');
        },

        function (resultCallback) {
        // 6. Now if user sends no price, we will tell him, what is available. Program ends after it.
            if (!data.price) {
                context.data = data;
                switch (data.command) {
                    case "BUY":
                        da.getAskPrices(data, context, fun.showPrices, resultCallback);
                        break;
                    case "SELL":
                        da.getBidPrices(data, context, fun.showPrices, resultCallback);
                        break;
                }
            return;
            }
            resultCallback(null, 'Show available prices on both sides.');
        },

        function (resultCallback) {
        resultCallback(null, 'test');
        },
*/
        function (resultCallback) {
        resultCallback(null, 'If I see this, I know it is not running synchroniously...');
        },

    ], function(err, results) {
        if (err) context.fail(err);
        console.log(results);
    });
}
