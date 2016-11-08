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



exports.executeScalar = function(sqlQuery, callback)
{
    var connection = connectionStart();
    connection.connect();
    connection.query(sqlQuery, function(err, rows, fields) {
        console.log('auth query ' + connection.state);
        if (err) {
            callback('error',null);
        } else {
            callback(null,'ok');
        }
        connection.end();
    });

}



exports.executeQuery = function(sqlQuery, callback)
{
    var connection = connectionStart();
    connection.connect();
    connection.query(sqlQuery, function(err, rows) {
        console.log('inside Execute query' + connection.state);
        if (err) {
            callback('error',null);
        } else {
            callback(null,'ok', rows);
        }
        connection.end();
    });

}



exports.getSyncData = function(sqlQuery, context, callback, resultCallback)
{
    var connection = connectionStart();
    connection.connect();
    console.log('State 1 - before query ' + connection.state);
    connection.query(sqlQuery, function(err, rows, fields) {
        console.log('State 2 - inside query ' + connection.state);
        if (err) {
            context.fail(err);
        } else {
            callback(rows, fields, context);
            console.log(callback);
        }
    });
    console.log('State 3 - after query ' + connection.state);
    connection.end();
}


exports.getStaticData = function(sqlQuery, callback, context)
{
        var connection = connectionStart();
        connection.connect();
        console.log('State 1 - before query ' + connection.state);
        connection.query(sqlQuery, function(err, rows, fields){
        console.log('State 2 - inside query ' + connection.state);
              if (err)
              {
                console.log(err);
                callback(err, null, context);
              }
              else {
              console.log (callback);
              if (callback) callback(null, rows, context);
              }

      });
    console.log('State 3 - after query ' + connection.state);
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