var _ = require('lodash');
var data = require('./index.js');

exports.doNothing = function(rows, fields, context) // Special command to display available products on market
    {
        // really do nothing
    }

exports.myDisplayProducts = function(rows) // Special command to display available products on market
    {
        var result = '';
        _.forEach(rows, function(value) {
            result += value.product_name + ', ';
        });
        return result;
    }

exports.myIncomingCommand = function(rows) // Check if command exists.
    {
        if (rows.length == 0) {
            return 'Order type ' + _.values(data.data.command) + ' not available! Please try /TRD HELP first!';
        } else return null;
    }

exports.myIncomingProduct = function(rows) // Check, if product exists.
    {
        if (rows.length == 0) {
            return 'Product ' + _.values(data.data.product) + ' not available! Please try /TRD PRODUCTS to see, what is available.';
        } else return null;
    }

exports.showBidPrices = function(rows) {
        var result = '';
        _.forEach(rows, function(value) {
            result += value.price + ', ';
        });
        return 'You can SELL ' + _.values(data.data.product) + ' for these prices: ' + result;
}

exports.showAskPrices = function(rows) {
        var result = '';
        _.forEach(rows, function(value) {
            result += value.price + ', ';
        });
        return 'You can BUY ' + _.values(data.data.product) + ' for these prices: ' + result;
}

exports.myOrder = function(data) {
        console.log('Order successfully inserted! ' + data.command + ' ' + data.product + ' ' + data.price);
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

