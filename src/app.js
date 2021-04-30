const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather Forecast",
    name: "Andrew Mead",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Andrew Mead",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "Help Page is here. Contact us at",
    email: "dani@mahilla.com",
    title: "Help Here",
    name: "Andrew Mead",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address for the weather search.",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (forecastError, forecastData) => {
        if (forecastError) {
          return res.send({
            error: forecastError,
          });
        }

        res.send({
          address: req.query.address,
          location,
          forecast: forecastData,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term.",
    });
  }

  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    message: "Help article not found.",
    title: "404. Page not found.",
    name: "Andrew Mead",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    message: "Page not found.",
    title: "404. Page not found.",
    name: "Andrew Mead",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
