var mysql = require('mysql');

function connectionStart()
{
        var connection = mysql.createConnection({
        host     : 'futuredb.cbhsjvpjrptr.us-west-2.rds.amazonaws.com',
        database : 'microexchange',
        user     : 'marty',
        password : 'martymarty',
        });
        return connection;
}

exports.getStaticData = function(sqlQuery, callback)
    {
        var connection = connectionStart();
        //console.log(callback);
        //console.log(sqlQuery);
        connection.connect();
        connection.query(sqlQuery, function(err, rows, fields){
        if (callback) {
              if (err)
              {
                callback(err,null);
              }
              else
              //console.log('ROWS ' + rows);
              //console.log('FIELDS ' + fields);
              callback(null, rows);}
      });
      connection.end();
}

exports.getSingleRecord = function(sqlQuery, callback)
{
        var connection = connectionStart();
        // console.log(callback);
        // console.log(sqlQuery);
        connection.connect();
        connection.query(sqlQuery, function(err, rows, fields){
                if (err)
                {
                  callback(err,null);
                }
                else
                  // console.log('ROWS ' + rows[0]);
                  // console.log('FIELDS ' + fields[0]);
                  callback(null, rows[0]);
        });
        connection.end();
}