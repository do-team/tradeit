var _ = require('lodash');

exports.displayProducts = function(err, data) // Special command to display available products on market
    {
        console.log(data);
        if (err !== null)
            context.fail(err);
        else {
            var result = '';
            _.forEach(data, function(value) {
                result += value.product_name + ', ';
            });
            console.log('Available products: ' + result.toUpperCase());
        }
    }

exports.incomingOrder = function(err, data) {
    if (err !== null)
        context.fail(err);
    else {
        console.log('Order successfully inserted! ' + data.command + ' ' + data.product + ' ' + data.price);
    }
}

exports.incomingCommand = function(err, commandRows) {
    if (err !== null)
        context.fail(err);
    else {
        if (commandRows == null) {
            console.log('Order type ' + data.command + ' not available! Please try /TRD HELP first!');
        }
    }
}

exports.incomingProduct = function(err, productRows) // Check, if product exists.
    {
        if (err !== null)
            context.fail(err);
        else {
            if (productRows == null) {
                console.log('Product ' + data.product + ' not available! Please try /TRD PRODUCTS to see, what is available.');
            }
        }
    }

exports.countingOrders = function(err, countRows) {
    if (err !== null)
        context.fail(err);
    else {
        var totalOrders = _.values(countRows);
    }
}

exports.deleteLow = function(err, delRows) {
    if (err !== null)
        context.fail(err);
    else {
        console.log('Irrelevant BUY orders found!');
    }
}

exports.deleteHigh = function(err, delRows) {
    if (err !== null)
        context.fail(err);
    else {
        console.log('Irrelevant SELL orders found!' + delRows);
    }
}