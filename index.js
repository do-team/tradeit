var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;

exports.handler = function(event, context) { //1
    da.historyRecord(event); // This is saving complete history of any command sent by user

    if (event === null || event.text === null) {
        context.succeed('You sent nothing!'); // Basic protection
    }
    if (event.text.toLowerCase() === 'products') { // 2
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
    if (event.text.toLowerCase() === 'help') // Special command to display complex help text
        context.succeed('HELP recognised!');
    if (event.text.toLowerCase() === 'test')
        context.succeed('TEST OK');
        else { // 3
            var data = common.parseInputOrder(event.text);
            da.confirmCommand(data, function(err, commandRows) { // 4
                    if (err !== null)
                        context.fail(err);
                    else { // 5
                        if (commandRows == null)
                            context.succeed('Order type ' + data.command + ' not available! Please try /TRD HELP first!');
                        else { // 6
                            da.confirmProductAvailable(data, function(err, dataRows) { // 7
                                    if (err !== null)
                                        context.fail(err);
                                    else { // 8
                                        if (dataRows == null)
                                            context.succeed('Product ' + data.product + ' not available! Please try /TRD PRODUCTS to see, what is available.');
                                        else { // 9
                                            if (!data.price) {
                                                da.getPrices(data, function(err, dataRows) {
                                                    if (err !== null)
                                                        context.fail(err);
                                                    else {
                                                        var result = '';
                                                        _.forEach(dataRows, function(value) {
                                                            result += value.price + ', ';
                                                        });
                                                        context.succeed(data.product + ' is available on ' + data.command + ' side for following prices: ' + result);
                                                    }
                                                });
                                            }
                                            else { // 10
                                                da.insertOrder(data, function(err, dataRows) { // 11
                                                    if (err !== null)
                                                        context.fail(err);
                                                    var countRows = 0;
                                                    da.countOrders(data, function(err, countRows) {
                                                        if (err !== null)
                                                            context.fail(err);
                                                        var countRows = 0;
                                                        if (countRows > market_depth) {
                                                            context.succeed('Order ' + data.command + ' ' + data.product + ' ' + data.price + ' is IN. COUNT: ' + countRows);
                                                        } else {
                                                            context.succeed('Order ' + data.command + ' ' + data.product + ' ' + data.price + ' is IN. COUNT: ' + countRows);
                                                        }
                                                    });
                                                }); // 11
                                            } // 10
                                        } // 9
                                    } // 8
                            }); // 7
                        } // 6
                    } // 5
            }); // 4
        } // 3
    } // 2
}; // 1