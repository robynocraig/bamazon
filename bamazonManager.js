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
  managerActions();
});

function managerActions() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View Products For Sale",
        "View Low Inventory",
        "Add To Inventory",
        "Add New Product",
        "Quit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Products For Sale":
        viewProducts();
        break;

      case "View Low Inventory":
        lowInventory();
        break;

      case "Add To Inventory":
        addInventory();
        break;

      case "Add New Product":
        newProduct();
        break;

      case "Quit":
        quit();
        break;

      }
    });
}

function viewProducts() {

  // displays all items
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id + " || " + "Product: " + res[i].product_name + " || " + "Department: " + res[i].department_name + " || " + "Price: $" + res[i].price + " || " + "Price: $" + res[i].price);
      console.log("------------------");
    }

    // runs prompt function
    managerActions();

  });
}

function lowInventory() {

  // displays all items
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 5) {
        console.log(res[i].product_name + ": " + res[i].stock_quantity);
      }
    }

    // runs prompt function
    managerActions();

  });
}

// update the quantity in mysql with items purchased
function addInventory() {
  inquirer
    .prompt([
      {
        name: "userId",
        type: "input",
        message: "What is the item ID you would like to add inventory to?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to add?"
      },
    ])
    .then(function(answer) {
      // getting information from the item ID the user inputed
      connection.query("SELECT * FROM products", function(err, res) {

        if (err) throw err;

        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id == answer.userId) {
            chosenItem = res[i];
          }
        }

        //console.log("Chosen Item: " + chosenItem.product_name);
        var updatedStock = (parseFloat(chosenItem.stock_quantity) + parseFloat(answer.quantity))
        console.log("Updated Stock: " + updatedStock);
        updateQuantity();

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

        // runs prompt function
        managerActions();

    });
  });
}

function newProduct() {

  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the product name?"
      },
      {
        name: "department",
        type: "input",
        message: "What department is the product in?"
      },
      {
        name: "price",
        type: "input",
        message: "How much does this item cost? (do not include '$' i.e. 0.99)"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many items are in stock?"
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.item,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function(err) {
          if (err) throw err;
          console.log("Your item was added successfully!");
          // runs prompt function
          managerActions();
        }
      );

    });
}

function quit(){
  connection.end();
}
