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

exports.getStaticData = function(sqlQuery, callback, context)
    {
        var connection = connectionStart();
        //console.log(callback);
        //console.log(sqlQuery);
        connection.connect();
        console.log('State 1 - before query');
        connection.query(sqlQuery, function(err, rows, fields){
        console.log('State 2 - inside query');
              if (err)
              {
                console.log(err);
                if (callback) callback(err, null, context);
              }
              else {
              //console.log('ROWS ' + rows);
              //console.log('FIELDS ' + fields);
              if (callback) callback(null, rows, context);
              }

      });
    console.log('State 3 - after query');
    connection.end();
}

exports.getSingleRecord = function(sqlQuery, callback)
{
        var connection = connectionStart();
        //console.log(callback);

        connection.connect();
        connection.query(sqlQuery, function(err, rows, fields){
                console.log(sqlQuery);
                if (err)
                {
                  callback(err,null);
                }
                else
                {
                 //console.log('ROWS ' + rows);
                 //console.log('FIELDS ' + fields[0]);
                 callback(null, rows[0]);
                }
        });
        connection.end();
}