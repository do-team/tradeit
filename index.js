var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;

exports.handler = function(event, context) {
    da.historyRecord(event); // This is saving complete history of any command sent by user, whatever string he sends.
    if (event === null || event.text === null) {
        context.succeed('You sent nothing!'); // Basic protection, to rule out user sends nothing.
    }
    if (event.text.toLowerCase() === 'products')
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
    if (event.text.toLowerCase() === 'help') // Special command to display complex help text (TODO).
        context.succeed('HELP recognised!');
    if (event.text.toLowerCase() === 'test')
        context.succeed('TEST OK');
    else
        var data = common.parseInputOrder(event.text);
    da.confirmCommand(data, function(err, commandRows) {
        if (err !== null)
            context.fail(err);
        else {
            if (commandRows == null) {
                context.succeed('Order type ' + data.command + ' not available! Please try /TRD HELP first!');
            } else {
                da.confirmProductAvailable(data, function(err, dataRows) // Check, if product exists.
                    {
                        if (err !== null)
                            context.fail(err);
                        else {
                            if (dataRows == null) {
                                context.succeed('Product ' + data.product + ' not available! Please try /TRD PRODUCTS to see, what is available.');
                            } else {
                                if (!data.price) { // If user send no price, it will list available orders for one of sides.
                                    switch (data.command) {
                                        case "BUY":
                                            da.getAskPrices(data, function(err, dataRows) {
                                                if (err !== null)
                                                    context.fail(err);
                                                else {
                                                    var result = '';
                                                    _.forEach(dataRows, function(value) {
                                                        result += value.price + ', ';
                                                    });
                                                    context.succeed('You can buy ' + data.product + ' for these prices: ' + result.toUpperCase());
                                                }
                                            });
                                            break;
                                        case "SELL":
                                            da.getBidPrices(data, function(err, dataRows) {
                                                if (err !== null)
                                                    context.fail(err);
                                                else {
                                                    var result = '';
                                                    _.forEach(dataRows, function(value) {
                                                        result += value.price + ', ';
                                                    });
                                                    context.succeed('You can sell ' + data.product + ' for these prices ' + result.toUpperCase());
                                                }
                                            });

                                            break;
                                    }
                                } else {
                                    da.insertOrder(data, function(err, dataRows) {
                                        if (err !== null)
                                            context.fail(err);
                                        else {
                                            console.log('Order successfully inserted! ' + data.command + ' ' + data.product + ' ' + data.price);

                                            da.deleteMatchedOrders(data, function(err, matchRows) {

                                                _.forEach(matchRows, function(value) {
                                                    if (value === 2) {
                                                        context.succeed('Congratulations! You have just traded ' + data.product + ' for the price of ' + data.price + '! You are getting very rich!');
                                                    } else {
                                                        da.countOrders(data, function(err, countRows) {
                                                            if (err !== null) {
                                                                context.fail(err);
                                                            } else {
                                                                var totalOrders = '';
                                                                _.forEach(countRows, function(value) {
                                                                    totalOrders = value;
                                                                    if (totalOrders > market_depth) {
                                                                        console.log('Irrelevant orders found!');
                                                                        da.deleteIrrelevantOrder(data, function(err, delRows) {
                                                                            if (err !== null) {
                                                                                context.fail(err);
                                                                            } else {
                                                                                console.log('Alles gut!');
                                                                            }
                                                                        });
                                                                    } else {
                                                                        console.log('No irrelevant orders.');
                                                                    }
                                                                });
                                                            }
                                                            context.succeed('Your order ' + data.command + ' ' + data.product + ' ' + data.price + ' was successfully inserted into orderbook, but it was not matched.');
                                                        });
                                                    }
                                                });

                                            });

                                        }
                                    });

                                }
                            }
                        }
                    });
            }
        }
    });
};