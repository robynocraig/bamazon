// read and set any environment variables with the dotenv package
require("dotenv").config();

// asking node to read keys.js file
var keys = require("./keys.js");

var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
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
  // prompt for info about the item they want to buy
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

        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          //console.log(res[i].item_id);
          //console.log(answer.userId);
          if (res[i].item_id == answer.userId) {
            chosenItem = res[i];
          }
        }
        console.log("Chosen Item: " + chosenItem.product_name);

        // determine if the quantity the user inputed is in stock
        if (chosenItem.stock_quantity > answer.quantity) {
          // if their input is less than the mysql amount, tell them it's in stock
          console.log("We have that in stock!");
        }
        else {
          // if their input is more than the mysql amount, tell them it's not in stock
          console.log("We don't have that many.");
        }

        connection.end();
    });
  });
}
