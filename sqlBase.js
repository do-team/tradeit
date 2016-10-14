var mysql = require('mysql');


//var connection =  mysql.createConnection({
//            host   : 'futuredb.cbhsjvpjrptr.us-west-2.rds.amazonaws.com',
//            user   : 'marty',
//            password : 'martymarty',
//            database : 'microexchange'
//});

function ConnectionStart()
{
        var connection = mysql.createConnection({
         host     : 'futuredb.cbhsjvpjrptr.us-west-2.rds.amazonaws.com',
         database : 'microexchange',
         user     : 'marty',
         password : 'martymarty',
       });
       connection.connect();
       return connection;
}

//exports.getStaticData = function(sqlQuery, callback)
//{
//        connection.query(sqlQuery, function(err, rows, fields){
//                if (err)
//                {
//                  callback(err,null);
//                }
//                else
//                  callback(null, rows);
//        });
//        connection.end();
//}

exports.getStaticData = function(sqlQuery, callback)
{
        var connection = ConnectionStart();
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


//exports.getSingleRecord = function(sqlQuery, callback)
//{
//        connection.query(sqlQuery, function(err, rows, fields){
//                if (err)
//                  callback(err,null);
//                else
//                  callback(null, rows[0]);
//        });
//        connection.end();
//}

exports.getSingleRecord = function(sqlQuery, callback)
{
        var connection = ConnectionStart();
        connection.query(sqlQuery, function(err, rows, fields){
                if (err)
                {
                  callback(err,null);
                }
                else
                  callback(null, rows[0]);
        });
        connection.end();
}