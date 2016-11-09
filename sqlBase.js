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
        console.log('Inside scalar query: ' + connection.state);
        if (err) {
            callback('SQL error', null);
        } else {
            callback(null, 'ok');
        }
        connection.end();
    });

}

exports.executeQuery = function(sqlQuery, callback)
{
    var connection = connectionStart();
    connection.connect();
    connection.query(sqlQuery, function(err, rows) {
        console.log('Inside Execute query: ' + connection.state);
        if (err) {
            callback('SQL error', null);
        } else {
            console.log(callback);
            callback(null, 'ok', rows);
        }
        connection.end();
    });

}