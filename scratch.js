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

                da.getProductNames(fun.displayProducts); // Special command to display available products on market

                break;
            case "help":
                context.succeed('HELP recognised!');
                break;
            case "test":
                context.succeed('TEST OK');
                break;
            default:

                var data = common.parseInputOrder(event.text);

                da.confirmCommand(fun.incomingCommand);

                da.confirmProductAvailable(fun.incomingProduct);

                // For !data.price add switch

                da.insertOrder(fun.incomingOrder);

                da.countOrders(fun.countingOrders);

                if (totalOrders > market_depth) {
                    console.log('SANITY CHECK: market depth = ' + market_depth + ', counted orders = ' + totalOrders + ' and command is ' + data.command + '.');
                    // SWITCH pro rozeznani, zda-li potrebujeme smazat na buy nebo sell side.
                    switch (data.command) {
                        case "BUY":
                            console.log('Amount of orders in the book: ' + totalOrders); //Tohle se jeste vypise, takze potud se vse zda byt OK.
                            //Od tohoto okamziku program naprosto IGNORUJE nasledujici pasaz. SQL dotaz se
                            //posklada spravne, ale nevrati se ani vysledek, ani error.
                            da.deleteLowestBid(fun.deleteLow);

                            break;
                        case "SELL":
                            console.log('Amount of orders in the book: ' + totalOrders);
                            da.deleteHighestAsk(fun.deleteHigh);
                            break;
                        default:
                            console.log('Something went wrong!'); //Ani tohle se nevypise.
                    }
                    // End of Switch..

                } else {
                    console.log('No irrelevant orders found.');
                }
                context.succeed('Your order ' + data.command + ' ' + data.product + ' ' + data.price + ' was successfully inserted into orderbook, but it was not matched.');
        }
        // End of BIG switch

    }
};