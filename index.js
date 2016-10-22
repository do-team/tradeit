var da = require('./dataAccess');
var mysql = require('mysql');
var common = require('./common');
var _ = require('lodash');
var market_depth = 5;

exports.handler = function(event, context) {
 da.historyRecord(event); // This is saving complete history of any command sent by user

 if (event === null || event.text === null) {
  context.succeed('You sent nothing!'); // Basic protection
 }
 if (event.text.toLowerCase() === 'products')
  da.getProductNames(function(err, data) // Special command to display available products on market
   {
    if (err !== null)
     context.fail(err);
    else {
     var result = '';
     _.forEach(data, function(value) {
      result += value.product_name + ', ';
     });
     context.succeed('Available products: ' + result.toUpperCase());
    }
   });
 if (event.text.toLowerCase() === 'help') // Special command to display complex help text
  context.succeed('HELP recognised!');
 if (event.text.toLowerCase() === 'test')
  context.succeed('TEST OK');
 else

  var data = common.parseInputOrder(event.text);
 da.confirmCommand(data, function(err, commandRows) {
  if (err !== null)
   context.fail(err);
  else {
   if (commandRows == null) {
    context.succeed('Order type ' + data.command + ' not available! Please try /TRD HELP first!');
   } else {
    // Add check, if order type / command exists here.
    da.confirmProductAvailable(data, function(err, dataRows) // Check, if product exists.
     {
      if (err !== null)
       context.fail(err);
      else {
       if (dataRows == null) {
        context.succeed('Product ' + data.product + ' not available! Please try /TRD PRODUCTS to see, what is available.');
       } else {
            if (!data.price) {
                da.getPrices(data, function(err, dataRows) {
                 if (err !== null)
                  context.fail(err);
                 else {
                  var result = '';
                  _.forEach(dataRows, function(value) {
                   result += value.price + ', ';
                  });
                  context.succeed(data.product + ' is available on ' + data.command + ' side for following prices: ' + result.toUpperCase());
                 }
                });
            }
// NOVY KOD
            else {
                da.insertOrder (data, function(err, dataRows) {
                    if (err !== null)
                    context.fail(err);
                        else {
                        var result = '';
                        _.forEach(dataRows, function(value) {
                        result += value.price + ', ';
                        });
                        context.succeed('Order successfully inserted! '+ data.command + ' ' + data.product + ' ' + data.price);
                        }




                });

            }



// ORIGINALNI KOD
//            else {
//               context.succeed('END... ' + data.command + ' ' + data.product + ' ' + data.price);                }
//


       }
      }
     });
   }
  }
 });
};