var mysql = require('mysql');


var connection =  mysql.createConnection({
            host   : 'futuredb.cbhsjvpjrptr.us-west-2.rds.amazonaws.com',
            user   : 'marty',
            password : 'martymarty',
            database : 'microexchange'
});


exports.getStaticData = function(sqlQuery, callback)
{
        connection.query(sqlQuery, function(err, rows, fields){
                if (err)
                {
                  callback(err,null);
                }
                else
                  callback(null, rows);
        });
        connection.end();
}


exports.getSingleRecord = function(sqlQuery, callback)
{
        connection.query(sqlQuery, function(err, rows, fields){
                if (err)
                  callback(err,null);
                else
                  callback(null, rows[0]);
        });
        connection.end();
}
