var mysql = require('mysql');


function GetCommand(str, context){
        var data = str.toUpperCase().split();
        if(data.length != 3)
        {
            context.fail("put command in correct format [buy/sell]] [member] [value]");
            return null;
        }
        else{
            return  new {
                command: data[0],
                member: data[1],
                value: data[2]
            }
        }
}

exports.handler = function(event, context) {

    if (event === null || event.text === null) {
        context.succeed('You sent nothing!');
    }
    else 
    {

        var data = GetCommand(event.text, context);

        var connection =  mysql.createConnection({
          host   : 'futuredb.cbhsjvpjrptr.us-west-2.rds.amazonaws.com',
          user   : 'marty',
          password : 'martymarty',
          database : 'Member'
        });
       connection.connect(function(err){
                if(err){
                    context.fail('Database connection failed' + err);
                }    
                else
                {
                    switch(data.command){
                        case 'BUY':
                            context.succeed('insert into table (position, member , value) values (buy,'+data.member+','+data.value+')')
                        break;
                        case 'SELL':
                            context.succeed('insert into table (position, member , value) values (sell,'+data.member+','+data.value+')')
                        break;
                    }
                    context.fail('Unexpected command' + data.command );
                }
            });
            
        }
};

