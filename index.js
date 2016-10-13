var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');


exports.handler = function(event, context) 
{
    if (event === null || event.text === null) {
        context.succeed('You sent nothing!');
    }
    else
    {
    if (event.text.toLowerCase() = 'product')
        da.getProductName(data.product_name,function(err,data)
        {
        if(err !== null)
                context.fail(err);
         else
                context.succeed('Available products: ' + data.product_name);
        });
    }
    else 
    {
        var data = common.parseInputOrder(event.text, context);
        
        //example of usage DB    
        da.getBusinessIdByMember(data.member,function(err, data)
        {
          if(err !== null)
                context.fail(err);
          else
                context.succeed('found member' + data.member);                  
        });

        switch(data.command){
            case 'BUY':
                context.succeed('insert into table (position, member , value) values (buy,'+data.member+','+data.value+')')
            break;
            case 'SELL':
                context.succeed('insert into table (position, member , value) values (sell,'+data.member+','+data.value+')')
            break;
        }
        context.fail('Unexpected command' + data.command );
    };
}

