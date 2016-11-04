var mysql = require('mysql');

function connectionStart()
{
        var connection = mysql.createConnection({
        host     : 'microexchange.cbhsjvpjrptr.us-west-2.rds.amazonaws.com',
        database : 'microexchange',
        user     : 'microadmin',
        password : 'micropassword',
        });
        return connection;
}



exports.executeScalar = function(sqlQuery, context)
{
    var connection = connectionStart();
    connection.connect();
    //console.log(connection);


    connection.query(sqlQuery, function(err, rows){
                                           if (err){
                                               console.log(err);
                                            }
                                            console.log('written');
                                            context.succeed('OK');

                         });
    connection.end();

}