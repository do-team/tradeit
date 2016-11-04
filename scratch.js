var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;
var fun = require('./functions.js');

exports.handler = function(event, context) {

        da.historyRecord(event); // This is saving complete history of any command sent by user, whatever string he sends.

        if (event === null || event.text === null) {
            context.succeed('You sent nothing!'); // Basic protection, to rule out user sends nothing.
        } else {
            // BIG SWITCH FOR SPECIAL COMMANDS
            switch (event.text.toLowerCase()) {
                case "products":
                    da.getProductNames(fun.displayProducts, context); // Special command to display available products on market.
                    break;
                case "help":
                    console.log('HELP recognised!'); // Future redirect to external file with nice HELP page.
                    break;
                case "test":
                    console.log('TEST OK'); // Only test.
                    break;
                default:

                    var data = common.parseInputOrder(event.text);

                    da.confirmCommand(data, fun.incomingCommand, context);

                    da.confirmProductAvailable(data, fun.incomingProduct, context);

                    if (!data.price) { // If user send no price, it will list available orders for one of sides.
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
                        da.insertOrder(data, fun.incomingOrder, context);

                        // Desired place for Match function

                        da.countOrders(data, fun.countingOrders, context);
                        var totalOrders = fun.totalOrders;
                        console.log(totalOrders);
                        if (totalOrders > market_depth) {

                            console.log('SANITY CHECK: market depth = ' + market_depth + ', counted orders = ' + totalOrders + ' and command is ' + data.command + '.');

                            switch (data.command) {
                                case "BUY":
                                    console.log('Amount of orders in the book: ' + totalOrders);
                                    da.deleteLowestBid(data, fun.deleteLow, context);

                                    break;
                                case "SELL":
                                    console.log('Amount of orders in the book: ' + totalOrders);
                                    da.deleteHighestAsk(data, fun.deleteHigh, context);
                                    break;
                            }

                        } else {
                            console.log('No irrelevant orders found.');
                        }
                        context.succeed('Your order ' + data.command + ' ' + data.product + ' ' + data.price + ' was successfully inserted into orderbook, but it was not matched.');
            }
            // End of BIG switch
        }



        //context.succeed('hmm');
};