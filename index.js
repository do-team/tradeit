var mysql = require('mysql');
var common = require('./common');


exports.handler = function(event, context) 
{
    if (event === null || event.text === null) {
        context.succeed('You sent nothing!');
    }
    else 
    {
        var data = common.parseInputOrder(event.text);

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

