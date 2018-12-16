require("dotenv").config(); //
//Dependencies
var express = require("express"); //
var exphbs = require("express-handlebars");
var passport = require("passport");
var flash = require("connect-flash");
var session = require("express-session");



var app = express();
var PORT = process.env.PORT || 3002;
var db = require("./models");

require("./config/passport")(passport);
var credentials = require('./config/credentials.json');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(flash());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(session({
  key: 'user_sid',
  secret: credentials.cookieSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
require("./routes/accountRoutes")(app);

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("Listening on localhost:" + PORT);
  });
});

module.exports = app;
