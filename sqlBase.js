var mysql = require('mysql');

function connectionStart()
{
        var connection = mysql.createConnection({
        host     : 'zu697-microexchange.c4ghekdkimzt.eu-central-1.rds.amazonaws.com',
        database : 'microexchange',
        user     : 'mastertrader',
        password : 'micropassword',
        });
        return connection;
}

exports.executeScalar = function(sqlQuery, callback)
{
    var connection = connectionStart();
    connection.connect();
    connection.query(sqlQuery, function(err, rows, fields) {
        //console.log('Inside scalar query: ' + connection.state);
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
        //console.log('Inside Execute query: ' + connection.state);
        if (err) {
            callback('SQL error', null);
        } else {
            callback(null, 'ok', rows);
        }
        connection.end();
    });

}

exports.executeSingle = function(sqlQuery, callback)
{
    var connection = connectionStart();
    connection.connect();
    connection.query(sqlQuery, function(err, rows) {
        //console.log('Inside Execute query: ' + connection.state);
        if (err) {
            callback('SQL error', null);
        } else {
            callback(null, 'ok', rows[0]);
        }
        connection.end();
    });

}