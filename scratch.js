var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;

exports.handler = function(event, context) {
    da.historyRecord(event); // This is saving complete history of any command sent by user, whatever string he sends.
    if (event === null || event.text === null) {
        context.succeed('You sent nothing!'); // Basic protection, to rule out user sends nothing.
    } else
    // BIG SWITCH FOR SPECIAL COMMANDS
        switch (event.text.toLowerCase()) {
        case "products":

            da.getProductNames(function(err, data) // Special command to display available products on market
                {
                    if (err !== null)
                        context.fail(err);
                    else {
                        var result = '';
                        _.forEach(data, function(value) {
                            result += value.product_name + ', ';
                        });
                        context.succeed('Available products: ' + result.toUpperCase());
                    }
                });
            break;
        case "help":
            context.succeed('HELP recognised!');
            break;
        case "test":
            context.succeed('TEST OK');
            break;
        default:

            var data = common.parseInputOrder(event.text);

            da.insertOrder(data, function(err, orderRows) {
                if (err !== null)
                    context.fail(err);
                else {
                    console.log('Order successfully inserted! ' + data.command + ' ' + data.product + ' ' + data.price);
                    da.countOrders(data, function(err, countRows) {
                        if (err !== null) {
                            context.fail(err);
                        } else {
                                var totalOrders = _.values(countRows);
                                if (totalOrders > market_depth) {
                                console.log('SANITY CHECK: market depth = ' + market_depth + ', counted orders = ' + totalOrders + ' and command is ' + data.command + '.');
                                    // SWITCH pro rozeznani, zda-li potrebujeme smazat na buy nebo sell side.
                                    switch (data.command) {
                                        case "BUY":
                                            console.log('HERGOT'); //Tohle se jeste vypise, takze potud se vse zda byt OK.
                                            //Od tohoto okamziku program naprosto IGNORUJE nasledujici pasaz. SQL dotaz se
                                            //posklada spravne, ale nevrati se ani vysledek, ani error.
                                            da.deleteLowestBid(data, function(err, delRows) {
                                                if (err !== null) {
                                                    console.log(err + 'ERROR');
                                                    context.fail(err);
                                                } else {
                                                    console.log('Irrelevant BUY orders found!');
                                                }
                                            });

                                            break;
                                        case "SELL":
                                            console.log('Amount of orders in the book: ' + totalOrders);
                                            da.deleteHighestAsk(data, function(err, delRows) {
                                                if (err !== null) {
                                                    console.log(err + 'here');
                                                    context.fail(err);
                                                } else {
                                                    console.log('Irrelevant SELL orders found!' + delRows);
                                                }
                                            });
                                            break;
                                        default:
                                            console.log('Something went wrong!'); //Ani tohle se nevypise.
                                    }
                                    // End of Switch..

                                } else {
                                    console.log('No irrelevant orders.');
                                }

                        }
                        context.succeed('Your order ' + data.command + ' ' + data.product + ' ' + data.price + ' was successfully inserted into orderbook, but it was not matched.');
                    });

                }
            });

    }
};