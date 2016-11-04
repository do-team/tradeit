var _ = require('lodash');

exports.displayProducts = function(err, data, context) // Special command to display available products on market
    {
        //console.log(data);
        if (err !== null)
            context.fail(err);
        else {
            var result = '';
            _.forEach(data, function(value) {
                result += value.product_name + ', ';
            });
            context.succeed('Available products: ' + result.toUpperCase());
        }
    }

exports.incomingOrder = function(err, data, context) {
    if (err !== null)
        context.fail(err);
    else {
        context.succeed('Order successfully inserted! ' + data.command + ' ' + data.product + ' ' + data.price);
    }
}

exports.incomingCommand = function(err, commandRows, context) // Check if command exists.
    {
        if (err !== null)
            context.fail(err);
        else {
            if (commandRows == null) {
                context.succeed('Order type ' + data.command + ' not available! Please try /TRD HELP first!');
            }
        }
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
