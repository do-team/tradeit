var da = require('./dataAccess');

exports.handler = function(event, context) {

        da.historyRecordAlt(event, context); // This is saving complete history of any command sent by user, whatever string he sends.

};

