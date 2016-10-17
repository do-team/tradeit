var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');

exports.handler = function(event, context) 
{
    if (event === null || event.text === null) {
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
                _.forEach(data,function(value){
                result+=value.product_name+' ';
                });
                    context.succeed('Available products: ' + result.toUpperCase());
                }
        }) ;
        if (event.text.toLowerCase() === 'help')
                context.succeed('HELP recognised!');

     else
    {

context.succeed('Do not understand...');

     //example of usage DB
     //   da.getBusinessIdByMember(data.member,function(err, data)
     //  {
     //    if(err !== null)
     //           context.fail(err);
     //     else
     //           context.succeed('found member' + data.member);
     //   });

     //   switch(data.command){
     //      case 'BUY':
     //           context.succeed('insert into table (position, member , value) values ('data.command+','+data.product+','+data.price+')');
     //       break;
     //       case 'SELL':
     //           context.succeed('insert into table (position, member , value) values ('data.command','+data.product+','+data.price+')');
     //       break;
     //   }
     //   context.fail('Unexpected command or argument' + data.command + data.product + data.price);
    }
};