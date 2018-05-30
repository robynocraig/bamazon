DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR(50) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bird Seed", "Pets", "29.99", 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Batmobile", "Toys", 50.00, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Baseball Bat", "Sports", 19.50, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Video Game", "Electronics", 39.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Bible", "Books", 0.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dog Treats", "Pets", 5.00, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lego Minifigures", "Toys", 2.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ladybugs DVD", "Electronics", 10.00, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Catcher in the Rye", "Books", 11.95, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hockey Skates", "Sports", 150.00, 1);

SELECT * FROM products;


