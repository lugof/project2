
// load all the things we need
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const express = require("express");
const flash = require("connect-flash");
const app = express();

// load up the user model & credentials
var db = require("../models");
var passport = require('passport');
var credentials = require('./credentials.json');

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(require('cookie-parser')());
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret
}));


// expose this function to our app using module.exports
module.exports = function (passport) {
    passport.serializeUser(function (user, done) { done(null, user.uuid); });
    // passport.serializeUser((user, done) => done(null, user));

    passport.deserializeUser(function (uuid, done) {
        db.Accounts.findById(uuid).then(function (user) {

            if (user) {

                done(null, user.get());

            } else {
                //console.log("user.errors", user.errors)
                done(user.errors, null);
            }
        });
    });

    //passport.serializeUser((user, done) => done(null, user));
    //passport.deserializeUser((user, done) => done(null, user));

    // =========================================================================
    // SOCIAL SIGNIN ===========================================================
    // =========================================================================

    passport.use(new FacebookStrategy({
        clientID: credentials.facebook.app_id,
        clientSecret: credentials.facebook.app_secret,
        callbackURL: credentials.facebook.callback //,
        //profileFields: ['id', 'displayName', 'emails']
    },
        function (accessToken, refreshToken, profile, cb) {
            console.log(profile);
            db.Accounts.findOne({
                where: {
                    email: profile.email
                }

            }).then(function (user, err) {
                if (err) {
                    //console.log("err", err)
                    return done(err);

                }

                if (user) {

                    //console.log('signupMessage', 'That username is already taken.');
                    req.flash('signupMessage', 'That username is already taken.');
                    return done(null, false, req.flash('signupMessage 2', 'That username is already taken.'));

                } else {
                    db.Accounts.create({
                        first_name: "Facebook",
                        last_name: "last",
                        email: profile.email,
                        username: profile.name
                        //account_key: db.Accounts.generateHash(account_key)

                    }).then(function (dbUser) {
                        //console.log("created result: ", dbUser);
                        return done(null, dbUser);

                    }).catch(function (err) {
                        //console.log(err);
                    });
                }
            });

            return cb(null, profile);
        }
    ));

    passport.use(new GitHubStrategy({
        clientID: credentials.github.consumer_key,
        clientSecret: credentials.github.consumer_secret,
        callbackURL: credentials.github.callback
    },
        function (accessToken, refreshToken, profile, cb) {
            console.log(profile)
            return cb(null, profile);

        }
    ));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({

        usernameField: 'username',
        passwordField: 'account_key',
        passReqToCallback: true // entire request to callback
    },
        function (req, username, account_key, done) {
            process.nextTick(function () {

                db.Accounts.findOne({
                    where: {
                        username: username
                    }
                }).then(function (user, err) {
                    if (err) {
                        //console.log("err", err)
                        return done(err);
                    }

                    if (user) {

                        //console.log('signupMessage', 'That username is already taken.');
                        req.flash('signupMessage', 'That username is already taken.');
                        return done(null, false, req.flash('signupMessage 2', 'That username is already taken.'));

                    } else {
                        db.Accounts.create({
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            email: req.body.email,
                            username: req.body.username,
                            account_key: db.Accounts.generateHash(account_key)

                        }).then(function (dbUser) {
                            //console.log("created result: ", dbUser);
                            return done(null, dbUser);

                        }).catch(function (err) {
                            //console.log(err);
                        });
                    }
                });
            });

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'account_key',
        passReqToCallback: true
    },
        function (req, username, account_key, done) { // callback with username and account_key from our form

            // check user
            db.Accounts.findOne({
                where: {
                    username: req.body.username
                }
            }).then(function (user, err) {
                console.log("user", user);
                console.log("&&&", err);
                console.log("****", !user)
                console.log("^^^", (!user.validPassword(req.body.account_key)));
                console.log('cookie', req.cookies.myCookie);

                if (err) {
                    //console.log("err", err);
                    return done(err);
                }

                // if no user is found, return the message
                if (!user) {
                    console.log("no user found - manuel");
                    console.log(req);
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // user right but passw wrong
                if (user && !user.validPassword(req.body.account_key)) {

                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                }
                return done(null, user);

            });

        }));





    //=======================================================================



};