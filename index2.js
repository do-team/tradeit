var da = require('./dataAccess');
var common = require('./common');
var async = require('async');
var fun = require('./functions.js');


exports.handler = function(event, context) {



    async.waterfall([

            (nextStep) => {
                    console.log('Step 1 - Write into history');
                    da.myHistoryRecord(event, nextStep);
             },

            function(arg1, nextStep) {
                 console.log('Step 2 ' + arg1);
                 if(arg1 == 'ok')
                 {
                    switch (event.text.toLowerCase()) {
                            case "products":
                                da.getMyProductNames(nextStep);
                            break;
                            case "help":
                                //nextStep(null, 'HELP recognised!' ); // Future redirect to external file with nice HELP page.
                                context.succeed('HELP recognised!' );
                                break;
                            case "test":
                                context.succeed('TEST OK');
                            break;
                    }
                 }
                 else
                    nextStep('ERROOOORR', null);
             },

             (arg1, rows, nextStep) => {
                console.log('Step 3 ');
                if(arg1 == 'ok')
                {
                    var result = fun.myDisplayProducts(rows);
                    nextStep(null, result);
                }
                else
                    nextStep('error', null);

             }

    ], function (err, result) {
        if (err)
            console.log(err);
        context.succeed(result);
    });

}
