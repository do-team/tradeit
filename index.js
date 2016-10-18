var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');


exports.handler = function(event, context) 
{
    da.historyRecord(event); // This is saving complete history of any command sent by user

    if (event === null || event.text === null)
     {
        context.succeed('You sent nothing!'); // Basic protection
     }
        if (event.text.toLowerCase() === 'products')
        da.getProductNames(function(err,data) // Special command to display available products on market
        {
            if(err !== null)
                context.fail(err);
            else
                {
                var result = '';
                _.forEach(data,function(value)
                    {
                    result+=value.product_name+', ';
                    });
                    context.succeed('Available products: ' + result.toUpperCase());
                }
        }) ;
        if (event.text.toLowerCase() === 'help') // Special command to display complex help text
                context.succeed('HELP recognised!');

     else

     var data = common.parseInputOrder(event.text);

          da.getBidPrices(data,function(err,datarows)
             {
                 if(err !== null)
                     context.fail(err);
                 else
                    {
                    var result = '';
                     _.forEach(datarows,function(value)
                         {
                         result+=value.price+', ';
                         });
                         context.succeed(data.product+' is being sold for ' + result.toUpperCase());
                     }
             }) ;

}

