var express = require("express");
var mongoose = require("mongoose");
var app = express();
var database = require("./config/database");
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

mongoose.connect(database.url);

var Restaurant = require("./models/restaurant");

//get all Restaurant data from db
app.get("/api/restaurant", function (req, res) {
  // use mongoose to get all todos in the database
  console.log("Connection establishd");

  Restaurant.find(function (err, restaurants) {
    // if there is an error retrieving, send the error otherwise send data
    if (err) res.send(err);
    res.json(restaurants); // return all Restaurants in JSON format
  });
});

// get a Restaurant with ID of 1
app.get("/api/restaurant/:restaurant_id", function (req, res) {
  let id = req.params.restaurant_id;
  Restaurant.findById(id, function (err, restaurant) {
    if (err) res.send(err);

    res.json(restaurant);
  });
});

// create Restaurant and send back all Restaurants after creation
app.post("/api/restaurant", function (req, res) {
  // create mongose method to create a new record into collection
  console.log(req.body);

  Restaurant.create(
    {
      building: req.body.building,
      salary: req.body.salary,
      age: req.body.age,
    },
    function (err, restaurant) {
      if (err) res.send(err);

      // get and return all the restaurant after newly created restaurant record
      Restaurant.find(function (err, restaurants) {
        if (err) res.send(err);
        res.json(restaurants);
      });
    }
  );
});

// create Restaurant and send back all restaurant after creation
app.put("/api/restaurant/:restaurant_id", function (req, res) {
  // create mongose method to update an existing record into collection
  console.log(req.body);

  let id = req.params.restaurant_id;
  var data = {
    name: req.body.name,
    borough: req.body.borough,
  };

  // save the user
  Restaurant.findByIdAndUpdate(id, data, function (err, restaurant) {
    if (err) throw err;

    res.send("Successfully! restaurant updated - " + restaurant.name);
  });
});

// delete a restaurant by id
app.delete("/api/restaurant/:restaurant_id", function (req, res) {
  console.log(req.params.restaurant_id);
  let id = req.params.restaurant_id;
  Restaurant.remove(
    {
      _id: id,
    },
    function (err) {
      if (err) res.send(err);
      else res.send("Successfully! restaurant has been Deleted.");
    }
  );
});

app.listen(port);
console.log("App listening on port : " + port);
