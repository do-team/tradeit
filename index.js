var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');

exports.handler = function(event, context) 
{
    if (event === null || event.text === null)
     {
        context.succeed('You sent nothing!');
     }
        if (event.text.toLowerCase() === 'products')
        da.getProductNames(function(err,data)
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
        if (event.text.toLowerCase() === 'help')
                context.succeed('HELP recognised!');

     else
     da.historyRecord(event.text);
     var data = common.parseInputOrder(event.text);
     da.getBidPrices(data,function(err,datarows)
             {
                 if(err !== null)
                     context.fail(err);
                 else
                     {
                     var result = '';

                     /**/
                     if(_.isEmpty(datarows))
                     {
                     context.succeed('zero len');
                     }
                     /**/
                     else
                     _.forEach(datarows,function(value)
                         {
                         result+=value.price+', ';
                         });
                         context.succeed(data.product+' is being sold for ' + result.toUpperCase());
                     }
             }) ;

}

