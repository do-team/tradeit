var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;
var fun = require('./functions.js');

exports.handler = function(event, context) {
        // 1. Writing to history must happen first, before everything else.
        da.historyRecord(event); // This is saving complete history of any command sent by user, whatever string he sends.

        if (event === null || event.text === null) {
            context.succeed('You sent nothing!'); // Basic protection, to rule out user sends nothing.
        } else {
            // 2. This switch must happen after history record. Program ends after this switch.
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
                default: // <- This DEFAULT might be removed, if program ends at this point.
                // 3. In case we would use certain kind of promises or waterfall, this must happen next.
                    var data = common.parseInputOrder(event.text); // Now we got data.command, data.product and data.price.
                // 4. Then we have to rule out, that user is sending nonexistent command. If yes, program ends.
                    da.confirmCommand(data, fun.incomingCommand, context);
                // 5. Then we have to rule out, that user is sending nonexistent product name. If yes, program ends.
                    da.confirmProductAvailable(data, fun.incomingProduct, context);
                // 6. Now if user sends no price, we will tell him, what is available. Program ends after it.
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
                // 7. OK, now we know, that user sent legal order, like BUY WOOD 100 or something. We must save it into database.
                        da.insertOrder(data, fun.incomingOrder, context);

                // 8. Desired place for Match function - program will try do do matching. If match is true, program ends.
                // Reserved space for matchmaking.

                // 9. Order was not matched? We have to test, if there are not too many orders in the book. First, count orders.
                        da.countOrders(data, fun.countingOrders, context);
                        var totalOrders = fun.totalOrders;
                        console.log(totalOrders);
                // 10. Now we got to compare values and DELETE irrellevant orders!
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
                // 11. And this is end of the program!
                        context.succeed('Your order ' + data.command + ' ' + data.product + ' ' + data.price + ' was successfully inserted into orderbook, but it was not matched.');
            }
            // <- Might be removed, if program ends on line 26.
        }



        //context.succeed('hmm');
};