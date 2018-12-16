var db = require("../models");
var passport = require("../config/passport");
var passport = require('passport');


module.exports = function (app) {

    // process the signup form ==============================================
    //=======================================================================

    app.post('/signup', function (req, res, next) {
        passport.authenticate('local-signup', function (err, user, info) {
            console.log("info", info);
            if (err) {
                console.log("passport err", err);
                return next(err); // will generate a 500 error
            }
            if (!user) {
                console.log("user error", user);
                return res.send({ success: false, message: 'authentication failed' });
            }
            req.login(user, loginErr => {
                if (loginErr) {
                    console.log("loginerr", loginerr)
                    return next(loginErr);
                }
                console.log('redirecting....');

                res.cookie('first_name', user.first_name);
                res.cookie('user_id', user.uuid);
                return res.redirect("/");
            });
        })(req, res, next);
    });

    //app.post('/passw', function (req, res, next) {
    //  db.Accounts.update({
    //    account_key: db.Accounts.generateHash(account_key)
    //});

    app.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            console.log("\n\n\n########userrrr", user)
            if (err) {
                console.log("passport err", err);
                return next(err); // will generate a 500 error
            }

            if (!user) {

                return res.send({ success: false, failureFlash: true, message: 'authentication failed' });
            }
            req.login(user, loginErr => {
                if (loginErr) {
                    console.log("loginerr", loginErr)
                    return next(loginErr);
                }

                console.log('redirecting....')
                res.cookie('first_name', user.first_name);
                res.cookie('user_id', user.uuid);

                return res.json(true);

            });
        })(req, res, next);
    });

}