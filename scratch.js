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
    else
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
    da.confirmCommand(data, function(err, commandRows) {
        if (err !== null)
            context.fail(err);
        else {
            if (commandRows == null) {
                context.succeed('Order type ' + data.command + ' not available! Please try /TRD HELP first!');
            } else {
                da.confirmProductAvailable(data, function(err, productRows) // Check, if product exists.
                    {
                        if (err !== null)
                            context.fail(err);
                            else {
                            if (productRows == null)
                            context.succeed('Product ' + data.product + ' does not exists. Try /TRD PRODUCTS to see, which products are available.');
                            else context.succeed('Product does exists, OK.');
                            }


            });
            }
        }
    });
    }
};