var db = require("../models");
var nodemailer = require("nodemailer");
var mandrillTransport = require('nodemailer-mandrill-transport');
var credentials = require('../config/credentials.json');

var smtpTransport = nodemailer.createTransport(mandrillTransport({
    auth: {
        apiKey: "xNXejxVy1GvbYwRtvSnN7Q"
    }
}));

module.exports = function (app) {
    // Get all Tareass
    app.get("/api/tareas", function (req, res) {
        db.Tasks.findAll({}).then(function (dbTasks) {
            res.json(dbTasks);
        });
    });

    // Create a new Tareas
    app.post("/api/tareas", function (req, res) {
        console.log("posting!!!");
        db.Tasks.create(req.body).then(function (dbTasks) {
            res.json(dbTasks);
        });
    });

    app.put("/api/edit/:id", function (req, res) {
        // Update takes in an object describing the properties we want to update, and
        // we use where to describe which objects we want to update
        console.log("we are on api route edit");
        console.log(req);
        db.Tasks.update({
            assignedUser: req.body.assignedUser,
            assignedBy: req.body.assignedBy,
            task: req.body.task,
            taskStatus: req.body.taskStatus,
            deadline: req.body.deadline,
            progress: req.body.progress
        }, {
                where: {
                    id: req.body.id
                }
            }).then(function (dbTasks) {
                res.json(dbTasks);
            });
    });

    app.get("/logout", function (req, res) {
        req.session.destroy(function (err) {
            req.logout();
            res.clearCookie('user_sid');
            res.clearCookie('first_name');
            res.clearCookie('user_id');
            res.redirect('/');
            console.log("loggedout and redirected");
        });
    });

    // Delete an Tareas by id
    app.delete("/api/delete/:id", function (req, res) {
        db.Tasks.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbTasks) {
            res.json(dbTasks);
        });
    });

    app.get('/send', function (req, res) {
        var mailOptions = {
            from: 'task@reminderapp.com.mx',
            to: req.query.mail,
            subject: "You have a new task",
            html: req.query.text
        }
        console.log("mailoptions" + mailOptions);

        // Sending email.
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                res.end("error");
            } else {
                console.log("Message sent route: ");
                res.end("sent");
                //console.log(req);
            }
        });
    });


};