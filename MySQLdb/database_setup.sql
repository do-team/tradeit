CREATE SCHEMA `microexchange` ;

CREATE TABLE `history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full` varchar(45) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`full`)
) ENGINE=InnoDB AUTO_INCREMENT=561 DEFAULT CHARSET=latin1;

CREATE TABLE `orderbook` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_type` varchar(4) NOT NULL,
  `product_name` varchar(10) NOT NULL,
  `price` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`,`order_type`,`price`,`product_name`)
) ENGINE=InnoDB AUTO_INCREMENT=233 DEFAULT CHARSET=latin1;

CREATE TABLE `order_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(4) NOT NULL,
  PRIMARY KEY (`id`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(45) NOT NULL,
  PRIMARY KEY (`product_id`,`product_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

INSERT INTO `microexchange`.`order_types`
(`type`)
VALUES
('buy'), ('sell');

INSERT INTO `microexchange`.`products`
(
`product_name`)
VALUES
('wood'), ('stone'), ('gold'), ('oil');
