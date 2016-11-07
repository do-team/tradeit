var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;
var fun = require('./functions.js');
var async = require('async');


exports.handler = function(event, context) {

    async.series([
            function(event, context) {
                da.historyRecord(event);
                if (event === null || event.text === null) {
                    context.succeed('You sent nothing!'); // Basic protection, to rule out user sends nothing.
                }
            },
            function(event, context) {
                switch (event.text.toLowerCase()) {
                    case "products":
                        da.getProductNames(fun.displayProducts, context); // Special command to display available products on market.
                        break;
                    case "help":
                        console.log('HELP recognised!'); // Future redirect to external file with nice HELP page.
                        break;
                    case "test":
                        console.log('TEST OK'); // Only for test.
                        break;
                }
            },
            function(event, context) {

                var data = common.parseInputOrder(event.text);

                da.confirmCommand(data, fun.incomingCommand, context);

            },

            function(event, context) {
                da.confirmProductAvailable(data, fun.incomingProduct, context);
            },

            function(event, context) {
                if (!data.price) {
                    context.data = data;
                    switch (data.command) {
                        case "BUY":
                            da.getAskPrices(data, fun.showPrices, context);
                            break;
                        case "SELL":
                            da.getBidPrices(data, fun.showPrices, context);
                            break;
                    }
                    return;
                }
            },


        ],

        // optional callback
        function(err, results) {
            console.log(results);
            // results is now equal to ['one', 'two']
        });



}