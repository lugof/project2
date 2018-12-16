var passport = require("../config/passport");
const express = require("express");
const flash = require("connect-flash");
const app = express();
var myusername;
var myid;

// load up the user model & credentials
var db = require("../models");
var passport = require('passport');
var credentials = require('../config/credentials.json');

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(require('cookie-parser')());
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret
}));

module.exports = function (app) {
    app.get("/", function (req, res) {

        if (req.isAuthenticated()) {
            var user = {
                id: req.session.passport.user,
                isloggedin: req.isAuthenticated()
            }
            req.flash('loginMessage', 'login Success!');
            console.log("redirected to tasks - logged in");
            res.render("welcome", user);

        }
        else {
            res.render("enter");
            console.log("redirected to login - not logged in");
        }
    });

    // This is the task endpoint
    app.get("/task", function (req, res) {
        if (req._parsedOriginalUrl.query === null) {

            db.Tasks.findAll({ where: { assignedBy: myusername } }).then(function (dbTasks) {


                res.render("task", {
                    tareas: dbTasks
                })
            })
        }
        else {
            console.log("this is the assignedBy received by server ", req._parsedOriginalUrl.query);
            myusername = req._parsedOriginalUrl.query;
            //db.Tasks.findAll({}).then(function (dbTasks) {
        };
    });

    app.get("/profile", function (req, res) {
        if
        (req._parsedOriginalUrl.query === null) {

            db.Accounts.findAll({ where: { username: myusername } }).then(function (dbAccounts) {
                console.log("this is the dbtasks result: ", dbAccounts);
                res.render("profile", {
                    accounts: dbAccounts
                })
            })
        }
        else {
            console.log("this is the assignedBy received by server ", req._parsedOriginalUrl.query);
            myusername = req._parsedOriginalUrl.query;
            console.log("this is myusername: ", myusername);
        }

    });

    app.get("/accounts", function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect("task");
            console.log("redirected to tasks - logged in- from accounts");
        } else {
            res.render("accounts");
            console.log("redirected to accounts - not logged in");
        }
    });

    app.get("/recover", function (req, res) {
        res.render("recover");
    });

    app.get("/welcome", function (req, res) {
        res.render("welcome");
    });

    app.get("/notes2", function (req, res) {
        if (req.isAuthenticated()) {
            res.render("notes2");
            console.log(" notes - logged in");
        } else {
            res.render("enter");
            console.log("redirected from notes - not logged in");
        }
    });


    app.get('/auth/facebook/', passport.authenticate('facebook'//, { scope: "email" }
    ));

    app.get('/auth/facebook/callback/', passport.authenticate('facebook',
        { successRedirect: '/task', failureRedirect: '/enter' }));

    app.get('/auth/github',
        passport.authenticate('github'));

    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/enter' }),
        function (req, res) {
            res.redirect('/task');
        });
    // Load index page

    // Load tareas page and pass in an tareas by id
    app.get("/tareas/:id", function (req, res) {
        console.log(req.params.id + "id params")
        db.Tasks.findOne({ where: { id: req.params.id } }).then(function (
            dbTasks
        ) {
            res.render("tareas", {
                tareas: dbTasks
            });
        });
    });

    app.get("/create", function (req, res) {
        console.log("we are receiving the create route");
        res.render("create");
    });

    app.get("/edit", function (req, res) {
        console.log("we are on html edit");
        console.log(req._parsedOriginalUrl.query);
        if (req._parsedOriginalUrl.query != null) {
            myid = req._parsedOriginalUrl.query;
        }
        db.Tasks.findAll({ where: { id: myid } }).then(function (dbTasks) {
            console.log(dbTasks);
            res.render("edit", {
                tareas: dbTasks
            });
            console.log(dbTasks);
        });
    });

    // Render 404 page for any unmatched routes
    app.get("*", function (req, res) {
        res.render("404");
    });
};