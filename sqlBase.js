var mysql = require('mysql');
var Promise = require('promise');

function connectionStart() {
        var connection = mysql.createConnection({
                host: 'microexchange.cbhsjvpjrptr.us-west-2.rds.amazonaws.com',
                database: 'microexchange',
                user: 'microadmin',
                password: 'micropassword',
        });
        return connection;
}

exports.getStaticData = function (sqlQuery) {
        // Create new promise
        var promise = new Promise(function (resolve, reject) {
                var connection = connectionStart();
                connection.connect();
                console.log('State 1 - before query ' + connection.state);

                // create asynchronous query
                connection.query(sqlQuery, function (err, rows) {
                        console.log('State 2 - inside query ' + connection.state);
                        // resolve or reject promise asynchronously
                        if (err) reject(err);
                        else resolve(rows);
                });
                console.log('State 3 - after query ' + connection.state);
                connection.end();
        });
        // return synchronous promise
        return promise;
}

exports.getSingleRecord = function (sqlQuery, callback) {
        var promise = new Promise(function (resolve, reject) {

                var connection = connectionStart();
                //console.log(callback);

                connection.connect();

                // create asynchronous query
                connection.query(sqlQuery, function (err, rows, fields) {
                        console.log(sqlQuery);
                        // resolve or reject promise asynchronously
                        if (err) reject(err);
                        else resolve(rows[0]);
                });
                connection.end();
        });
        // return synchronous promise
        return promise;
}