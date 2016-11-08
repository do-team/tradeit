var _ = require('lodash');
var data = require('./sync.js');

exports.doNothing = function(rows, fields, context) // Special command to display available products on market
{
    // really do nothing
}

exports.displayProducts = function(rows, fields, context) // Special command to display available products on market
{
    var result = '';
    _.forEach(rows, function(value) {
        result += value.product_name + ', ';
    });
    context.succeed('Available products: ' + result.toUpperCase());
}

exports.incomingOrder = function(err, data, context)
    {
        if (err !== null)
            context.fail(err);
        else {
            console.log('Order successfully inserted! ' + data.command + ' ' + data.product + ' ' + data.price);
        }
    }

exports.incomingCommand = function(commandRows, fields, context) // Check if command exists.
    {
            if (commandRows == null) {
                //console.log (data);
                context.succeed('Order type ' + data.command + ' not available! Please try /TRD HELP first!');
            }
            console.log(commandRows);
    }

exports.incomingProduct = function(err, productRows, context) // Check, if product exists.
    {
        if (err !== null)
            context.fail(err);
        else {
            if (productRows == null) {
                if (context) context.succeed('Product ' + data.product + ' not available! Please try /TRD PRODUCTS to see, what is available.');
            }
        }
    }

exports.countingOrders = function(err, countRows, context) {
    exports.totalOrders = totalOrders;
    if (err !== null)
        context.fail(err);
    else {
        var totalOrders = _.values(countRows);
        exports.totalOrders = totalOrders;
        console.log('here');
    }
}

exports.deleteLow = function(err, delRows, context) {
    if (err !== null)
        context.fail(err);
    else {
        console.log('Irrelevant BUY orders found!');
    }
}

exports.deleteHigh = function(err, delRows, context) {
    if (err !== null)
        context.fail(err);
    else {
        console.log('Irrelevant SELL orders found!' + delRows);
    }
}

exports.showPrices = function(err, dataRows, context) {
    if (err !== null)
        context.fail(err);
    else {
        var result = '';
        _.forEach(dataRows, function(value) {
            result += value.price + ', ';
        });
        context.succeed('You can ' +  context.data.command + ' ' + context.data.product + ' for these prices: ' + result);
    }
}
