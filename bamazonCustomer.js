// read and set any environment variables with the dotenv package
require("dotenv").config();

// npm packages being used
var keys = require("./keys.js");
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // username
  user: "root",

  // password (which is in the .env file)
  password: (keys.mysqlpass.password),
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  //console.log("connected as id " + connection.threadId);
  start();
});

function start() {

  // displays all items
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id + " || " + "Product: " + res[i].product_name + " || " + "Department: " + res[i].department_name + " || " + "Price: $" + res[i].price);
      console.log("------------------");
    }

    // runs prompt function
    userPrompt();

  });
}

// function to ask users what item they want to buy
function userPrompt() {
  // inquirer prompting
  inquirer
    .prompt([
      {
        name: "userId",
        type: "input",
        message: "What is the item ID you would like to buy?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?"
      },
    ])
    .then(function(answer) {
      // getting information from the item ID the user inputed
      connection.query("SELECT * FROM products", function(err, res) {

        if (err) throw err;

        // selecting the item the user inputed
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id == answer.userId) {
            chosenItem = res[i];
          }
        }

        // determine if the quantity the user inputed is in stock
        if (chosenItem.stock_quantity > answer.quantity) {
          // if their input is less than the mysql amount, tell them it's in stock
          console.log("We have that in stock!");
          var updatedStock = (chosenItem.stock_quantity - answer.quantity)
          var cost = (chosenItem.price * answer.quantity)
          console.log("Your Total Cost: $" + parseFloat(cost).toFixed(2));
          updateQuantity();
        }
        else {
          // if their input is more than the mysql amount, tell them it's not in stock
          console.log("We don't have that many.");
        }

        // update the quantity in mysql with items purchased
        function updateQuantity() {
          var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: updatedStock
              },
              {
                item_id: answer.userId
              }
            ],
          );
        }

        // stop the app
        connection.end();
    });
  });
}
