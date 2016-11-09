var da = require('./dataAccess');
var common = require('./common');
var async = require('async');
var fun = require('./functions.js');


exports.handler = function(event, context) {

    async.waterfall([

            function (nextStep) {
                    console.log('Step 1 - Write into history');
                    da.myHistoryRecord(event, nextStep);
             },

            function(arg1, nextStep) {
                 console.log('Step 2 ' + arg1);
                 if(arg1 == 'ok')
                 {
                    switch (event.text.toLowerCase()) {
                            case "products":
                            //context.succeed('Products recognised!' );
                                da.getMyProductNames(nextStep);
                            break;
                            case "help":
                                context.succeed('HELP recognised!' );
                                break;
                            case "test":
                                context.succeed('TEST OK');
                            break;
                            default:
                                nextStep(null, 'skip', null);
                    }
                 }
                 else
                    nextStep('Special command failed.', null);
             },

             function (arg1, rows, nextStep) {
                console.log('Step 3 ');
                if(arg1 == 'ok')
                {
                    var result = ('Available products: ' + fun.myDisplayProducts(rows));
                    context.succeed(result.toUpperCase());
                }
                else
                    nextStep(null);

             },

             function (nextStep) {
                 console.log('Step 4 ' + event.text);
                 var data = common.parseInputOrder(event.text); // Now we got data.command, data.product and data.price.
                 exports.data = data;
                 console.log(data);
                 da.confirmMyCommand(data, nextStep);
             },

             function (arg1, rows, nextStep) {
                 console.log('Step 5 ');
                 if(arg1 == 'ok')
                 {
                     result = fun.myIncomingCommand(rows);
                     if (result) context.succeed(result);
                     nextStep(null, 'OK');
                 }
                 else
                     nextStep(null);

              }


    ], function (err, result) {
        if (err)
            console.log(err);
        context.succeed(result);
    });

}
