var sqlBase  = require('./sqlBase');

// Any command is saved into global history for later troubleshooting etc.
exports.myHistoryRecord = function(event, callback)
{
        var query = "INSERT INTO history (full) VALUES ('" + event.text + "')";
        //console.log(query);
        return sqlBase.executeScalar(query, callback);
}

// This shall inform customer about available products on the market.
exports.getMyProductNames = function(callback)
{
        var query = "SELECT product_name FROM products";
        sqlBase.executeQuery(query, callback);
}

// First we have to confirm, that order type exists. It can be BUY and SELL from the start, but more order types can be added.
exports.confirmMyCommand = function(data, callback)
{
        var query = "SELECT * FROM order_types WHERE type='" + data.command + "'";
        console.log(query);
        sqlBase.executeQuery(query, callback);
}

// Then we have to confirm, that product is really available.
exports.confirmMyProduct = function(data, callback)
{
        var query = "SELECT * FROM products WHERE product_name='" + data.product + "'";
        console.log(query);
        sqlBase.executeQuery(query, callback);
}

// When user sends no specific price, it shall give him list of available orders.
exports.getAskPrices = function(data, callback)
{
        var query = "SELECT * FROM orderbook WHERE product_name='" + data.product + "' AND order_type='SELL' ORDER BY price ASC";
        console.log(query);
        sqlBase.executeQuery(query, callback);
}

// When user sends no specific price, it shall give him list of available orders.
exports.getBidPrices = function(data, callback)
{
        var query = "SELECT * FROM orderbook WHERE product_name='" + data.product + "' AND order_type='BUY' ORDER BY price DESC";
        console.log(query);
        sqlBase.executeQuery(query, callback);
}

// Correctly defined order shall be added into right place in the database table.
exports.insertOrder = function(data, callback)
{
        var query = "INSERT INTO orderbook (order_type, product_name, price) VALUES ('" + data.command + "','" + data.product + "', " + data.price + ")";
        console.log(query);
        sqlBase.executeQuery(query, callback);
}

// After order successfully added, we have to check, if there are not so many orders, defined by variable market_depth (this is defined per product).
exports.countOrders = function(data, callback, context)
{
        var query = "SELECT COUNT(*) FROM orderbook WHERE product_name='" + data.product + "' AND order_type='" + data.command + "'";
        console.log(query);
        sqlBase.getSyncData(query, callback, context);
}

// If there are too many orders on buy side, it will delete lowest price order in the book.
exports.deleteLowestBid = function(data, callback, context)
{
        var query = "DELETE FROM orderbook WHERE product_name='" + data.product + "' AND order_type='" + data.command + "' ORDER BY price ASC LIMIT 1";
        console.log(query);
        sqlBase.getSyncData(query, callback, context);
}

// If there are too many orders on sell side, it will delete highest price in the book.
exports.deleteHighestAsk = function(data, callback, context)
{
        var query = "DELETE FROM orderbook WHERE product_name='" + data.product + "' AND order_type='" + data.command + "' ORDER BY price DESC LIMIT 1";
        console.log(query);
        sqlBase.getSyncData(query, callback, context);
}
// This is actually match making. If this succeeds, it will inform user about successful trade!
exports.deleteMatchedOrders = function(data, callback)
{
        var query = "delete from microexchange.orderbook where order_id in ( select order_id from ( (select  order_id from microexchange.orderbook where price = " + data.price + " and product_name = '" + data.product +"' and order_type='SELL' limit 1) union (select  order_id from microexchange.orderbook where price = " + data.price + " and product_name = '" + data.product +"' and order_type='BUY' limit 1) )  as t1 )";
        console.log(query);
        sqlBase.executeQuery(query, callback);
}