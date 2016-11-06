var sqlBase  = require('./sqlBase');

// Any command is saved into global history for later troubleshooting etc.
exports.historyRecord = function(event)
{
        var query = "INSERT INTO history (full) VALUES ('" + event.text + "')";
        //console.log(query);
        return sqlBase.getStaticData(query);
}

// This shall inform customer about available products on the market.
exports.getProductNames = function (callback, context) {
        var query = "SELECT product_name FROM products";
        // return promise
        return sqlBase.getStaticData(query);
}

// First we have to confirm, that order type exists. It can be BUY and SELL from the start, but more order types can be added.
exports.confirmCommand = function(data)
{
        var query = "SELECT * FROM order_types WHERE type='" + data.command + "'";
        console.log(query);
        return sqlBase.getStaticData(query);
}

// Then we have to confirm, that product is really available.
exports.confirmProductAvailable = function(data)
{
        var query = "SELECT * FROM products WHERE product_name='" + data.product + "'";
        console.log(query);
        return sqlBase.getStaticData(query);
}

// When user sends no specific price, it shall give him list of available orders.
exports.getAskPrices = function(data)
{
        var query = "SELECT * FROM orderbook WHERE product_name='" + data.product + "' AND order_type='SELL' ORDER BY price ASC";
        console.log(query);
        return sqlBase.getStaticData(query);
}

// When user sends no specific price, it shall give him list of available orders.
exports.getBidPrices = function(data)
{
        var query = "SELECT * FROM orderbook WHERE product_name='" + data.product + "' AND order_type='BUY' ORDER BY price ASC";
        console.log(query);
        return sqlBase.getStaticData(query);
}

// Correctly defined order shall be added into right place in the database table.
exports.insertOrder = function(data)
{
        var query = "INSERT INTO orderbook (order_type, product_name, price) VALUES ('" + data.command + "','" + data.product + "', " + data.price + ")";
        console.log(query);
        return sqlBase.getStaticData(query);
}

// After order successfully added, we have to check, if there are not so many orders, defined by variable market_depth (this is defined per product).
exports.countOrders = function(data)
{
        var query = "SELECT COUNT(*) FROM orderbook WHERE product_name='" + data.product + "' AND order_type='" + data.command + "'";
        console.log(query);
        return sqlBase.getStaticData(query);
}

// If there are too many orders on buy side, it will delete lowest price order in the book.
exports.deleteLowestBid = function(data)
{
        var query = "DELETE FROM orderbook WHERE product_name='" + data.product + "' AND order_type='" + data.command + "' ORDER BY price ASC LIMIT 1";
        console.log(query);
        return sqlBase.getStaticData(query);
}

// If there are too many orders on sell side, it will delete highest price in the book.
exports.deleteHighestAsk = function(data)
{
        var query = "DELETE FROM orderbook WHERE product_name='" + data.product + "' AND order_type='" + data.command + "' ORDER BY price DESC LIMIT 1";
        console.log(query);
        return sqlBase.getStaticData(query);
}
// This is actually match making. If this succeeds, it will inform user about successful trade!
exports.deleteMatchedOrders = function(data)
{
        var query = "delete from microexchange.orderbook where order_id in ( select order_id from ( (select  order_id from microexchange.orderbook where price = " + data.price + " and product_name = '" + data.product +"' and order_type='SELL' limit 1) union (select  order_id from microexchange.orderbook where price = " + data.price + " and product_name = '" + data.product +"' and order_type='BUY' limit 1) )  as t1 )";
        console.log(query);
        return sqlBase.getStaticData(query);
}