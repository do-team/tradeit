var da = require('./dataAccess');
var common = require('./common');
var fun = require('./resulteval.js');
var async = require('async');
var _ = require('lodash');
var market_depth = 5;

exports.handler = function(event, context) {

    var data = common.parseInputOrder(event.text); // Now we got data.command, data.product and data.price.
    exports.data = data;

    async.waterfall([

        function(nextStep) {
            console.log('Step 1 - Write into history');
            console.log(nextStep);
            da.myHistoryRecord(event, nextStep);
        },

        function(arg1, nextStep) {
            console.log('Step 2 - Identifying special command.');
            console.log(nextStep);
            if (arg1 == 'ok') {
                switch (event.text.toLowerCase()) {
                    case "products":
                        da.getMyProductNames(nextStep);
                        break;
                    case "help":
                        context.succeed('HELP recognised!');
                        break;
                    case "test":
                        context.succeed('TEST OK');
                        break;
                    default:
                        nextStep(null, 'skip', null);
                }
            } else
                nextStep('Special command failed.', null);
        },

        function(arg1, rows, nextStep) {
            console.log('Step 3 - product list.');
            console.log(nextStep);
            if (arg1 == 'ok') {
                var result = (fun.myDisplayProducts(rows));
                context.succeed('Available products: ' + result.toUpperCase());
            } else
                nextStep(null);
        },

        function(nextStep) {
            console.log('Step 4 - Confirming existence of command.');
            console.log(nextStep);
            da.confirmMyCommand(data, nextStep);
        },

        function(arg1, rows, nextStep) {
            console.log('Step 5 - In case of nonexistent command, it should stop here.');
            console.log(nextStep);
            if (arg1 == 'ok') {
                result = fun.myIncomingCommand(rows);
                if (result) context.succeed(result);
                nextStep(null);
            } else
                nextStep(null);
        },

        function(nextStep) {
            console.log('Step 6 - Confirming existence of product.');
            console.log(nextStep);
            da.confirmMyProduct(data, nextStep);
        },

        function(arg1, rows, nextStep) {
            console.log('Step 7 - In case of nonexistent product, it should stop here.');
            console.log(nextStep);
            if (arg1 == 'ok') {
                result = fun.myIncomingProduct(rows);
                if (result) context.succeed(result);
                nextStep(null);
            } else
                nextStep(null);
        },

        function(nextStep) {
            console.log('Step 8 - In case of no price sent, it should do the check.')
            console.log(nextStep);
            if (!data.price) {
                switch (data.command) {
                    case "BUY":
                        da.getAskPrices(data, nextStep);
                        break;
                    case "SELL":
                        da.getBidPrices(data, nextStep);
                        break;
                    default:
                        nextStep(null, 'skip', null);
                }
                return;
            } else nextStep(null, 'skip', null);
        },

        function(arg1, rows, nextStep) {
            console.log('Step 9 - Display prices on one of sides of orderbook.');
            console.log(nextStep);
            if (!data.price) {
                switch (data.command) {
                    case "BUY":
                        result = fun.showAskPrices(rows);
                        if (result) context.succeed(result);
                        nextStep(null);
                        break;
                    case "SELL":
                        result = fun.showBidPrices(rows);
                        if (result) context.succeed(result);
                        nextStep(null);
                        break;
                    default:
                        nextStep(null, 'skip', null);
                }
                return;
            } else nextStep(null);
        },

        function(nextStep) {
            console.log('Step 10 - Insert valid order into orderbook.');
            console.log(nextStep);
            da.insertOrder(data, nextStep);
            console.log('Your order ' + data.command + ' ' + data.product + ' ' + data.price + ' successfully inserted!');
            nextStep(null);
        },

        function(nextStep) {
            console.log('Step 11 - Matchmaking time!');
            console.log(nextStep);
            da.deleteMatchedOrders(data, nextStep);
            nextStep(null);
        },

        function(nextStep) {
            console.log('Step 12 - Counting order, maybe there are too many of them.')
            console.log(nextStep);
            da.countOrders(data, nextStep);
        },

        function(arg1, rows, nextStep) {
            console.log('Step 13 - Evaluating amount of orders, deleting irrelevant, if found.')
            var totalOrders = _.values(rows);
            console.log(totalOrders);
            if (totalOrders > market_depth) {
                switch (data.command) {
                    case "BUY":
                        console.log('Amount of orders in the book: ' + totalOrders);
                        da.deleteLowestBid(data, nextStep);
                        break;
                    case "SELL":
                        console.log('Amount of orders in the book: ' + totalOrders);
                        da.deleteHighestAsk(data, nextStep);
                        break;
                }

            }
            nextStep(null);
        }
        /*
                function(nextStep) {
                    console.log('Step 14 - Deleting irrelevant orders, if there are any.')
                    //nextStep(null);
                },

                function(nextStep) {
                    console.log('Step 15 - Final check.')
                    //nextStep();
                }
        */
    ], function(err, result) {
        if (err)
            console.log(err);
        context.succeed(result + ' = END.');
    });

}