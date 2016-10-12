var mysql = require('mysql');

exports.handler = function(event, context) {

    if (event === null || event.text === null) {
        context.succeed('You sent nothing!');
    }
    else 
    {
        var member = event.text;
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
                    connection.query("SELECT business_id FROM members WHERE member_id='"+member+"'",function(err,rows,fields){
                        if(err)
                        {
                           context.fail('Cannot read from database!' + err);
                        }
                        else
                        {
                            if(rows.length > 0)
                            {
                                context.succeed('Business ID of member '+member+' is '+rows[0].business_id+'.');
                            }
                            else
                            {
                                context.succeed('Member ID was not found.');
                            }
                            connection.end();
                        }
                    });
               }
            });

    }
};
