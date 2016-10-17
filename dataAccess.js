
var sqlBase  = require('./sqlBase');


exports.getBusinessIdByMember = function(member,callback)
{
        var query = "SELECT business_id FROM members WHERE member_id='"+member+"'";

        sqlBase.getSingleRecord(query, callback);
}

exports.getProductNames = function(callback)
{
        var query = "SELECT product_name FROM products";

        sqlBase.getStaticData(query, callback);
}

exports.getAskPrices = function(callback)
{
        var query = "SELECT * FROM orderbook WHERE product_name='WOOD' AND order_type='sell' ORDER BY price DESC";

        sqlBase.getStaticData(query, callback);
}

exports.getBidPrices = function(callback)
{
        var query = "SELECT * FROM orderbook WHERE product_name='OIL' AND order_type='buy' ORDER BY price ASC";

        sqlBase.getStaticData(query, callback);
}

exports.deleteLowestBid = function(callback)
{
        var query = "DELETE FROM orderbook WHERE product_name='wood' AND order_type='buy' ORDER BY price ASC LIMIT 1";

        sqlBase.getStaticData(query, callback);
}

exports.deleteHighestAsk = function(callback)
{
        var query = "DELETE FROM orderbook WHERE product_name='wood' AND order_type='sell' ORDER BY price DESC LIMIT 1";

        sqlBase.getStaticData(query, callback);
}

exports.insertBid = function(callback)
{
        var query = "INSERT INTO orderbook (order_type, product_name, price) VALUES ('buy','wood',98)";

        sqlBase.getStaticData(query, callback);
}

exports.insertAsk = function(callback)
{
        var query = "INSERT INTO orderbook (order_type, product_name, price) VALUES ('sell','wood',98)";

        sqlBase.getStaticData(query, callback);
}

exports.countBids = function(callback)
{
        var query = "SELECT COUNT(*) FROM orderbook WHERE product_name='wood' AND order_type='buy'";

        sqlBase.getStaticData(query, callback);
}

exports.countAsks = function(callback)
{
        var query = "SELECT COUNT(*) FROM orderbook WHERE product_name='wood' AND order_type='sell'";

        sqlBase.getStaticData(query, callback);
}

exports.deleteMatchedOrders = function(callback)
{
        var query = "DELETE t1,t2 FROM orderbook t1, orderbook t2 WHERE t1.product_name = t2.product_name AND t1.price = t2.price AND t1.order_type <> t2.order_type";

        sqlBase.getStaticData(query, callback);
}

exports.confirmOrderType = function(callback)
{
        var query = "SELECT type FROM order_types WHERE type='BUY'";

        sqlBase.getSingleRecord(query, callback);
}

exports.confirmProductAvailable = function(callback)
{
        var query = "SELECT type FROM products WHERE product_name='data.product'";

        sqlBase.getStaticData(query, callback);
}

exports.historyRecord = function(callback)
{
        var query = "INSERT INTO history ('order_type','product_name','price') VALUES ('BUY', 'WOOD', 100)";

        sqlBase.getStaticData(query, callback);
}