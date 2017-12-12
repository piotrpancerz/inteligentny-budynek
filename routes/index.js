/* Dependencies */
const express = require('express');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const emailValidator = require('email-validator');
const crypto = require('crypto');
const mailer = require('pug-mailer');

/* Configuration files */
const mailerConfig = require('../config/mailerConfig.json');

/* Mongoose Promise */
mongoose.Promise = global.Promise;

/* Initialize mailing */
mailer.init({
    service: "gmail",
    secure: false,
    port: 25,
    auth: {
        user: mailerConfig.mailUser,
        pass: mailerConfig.mailPass
    },
    tls: {
        rejectUnauthorized: false
    }
});

/* Get home page */
router.get('/', function(req, res) {
    // console.log(req.session.user);
    if (!req.session.user) {
        res.status(401).send();
    } else {
        res.status(200).send();
    }
});

router.get('/dashboard', function(req, res) {
    console.log(req.session.user);

    if (!req.session.user) {
        res.status(401).send();
    } else {
        res.status(200).send();
    }
});

router.post('/register', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var active = false;
    /* Creating activation hash */
    var confirmationHash = crypto.randomBytes(20).toString('hex');

    if (emailValidator.validate(email)) {
        var newuser = new User();
        newuser.username = username;
        newuser.password = password;
        newuser.email = email;
        newuser.active = active;
        newuser.confirmationHash = confirmationHash;

        newuser.save(function(err, savedUser) {
            if (err) {
                throw err;
                res.status(500).send('Unable to add user to database!'); // dodać catch errora z mongoose
            } else {
                /* Sending authentication email */
                mailer.send({
                        from: '"Inteligentny Budynek" <intellig.building@gmail.com>',
                        to: email,
                        subject: 'User activation',
                        template: '../../views/authenticationEmail',
                        data: {
                            username: username,
                            url: 'http://localhost:3000/authenticate/' + username + '/' + confirmationHash
                        }
                    })
                    .then(response => res.status(200).send('Successully registered!'))
                    .catch(err => {
                        throw err;
                        res.status(500).send('Oops! Something went wrong. Please try again!');
                    });
            }
        });
    } else {
        res.status(500).send('Provided email is invalid!');
    };


});

router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            throw err;
            return res.status(500).send('Oops! Something went wrong. Please try again!');
        }

        if (!user) {
            return res.status(404).send('Invalid username or password!');
        }

        user.comparePassword(password, function(err, isMatch) {
            if (isMatch && isMatch == true) {
                req.session.user = user;
                return res.status(200).send('Succesfully logged in!');
            } else {
                return res.status(401).send('Invalid username or password!');
            }
        });
    })
});

router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            return res.status(200).send();
        } else {
            return res.status(200).send();
        }
    });
});

router.get('/authenticate/:user/:hash', function(req, res) {
    var user = req.params.user;
    var hash = req.params.hash;
    User.findOne({
        username: user,
        confirmationHash: hash,
        active: false
    }, function(err, doc) {
        if (err) {
            throw err;
            res.status(500).send('Something went wrong. Please try again later.');
        }
        if (doc) {
            doc.active = true;
            doc.confirmationHash = undefined;
            doc.save(function(err, savedObject) {
                if (err) {
                    throw err;
                    res.status(500).send('Something went wrong. Please try again later.')
                } else {
                    res.status(200).send('Successfully authenticated!');
                }
            });
        } else {
            res.status(404).send('Authentication failed. Either your account is already authenticated or authentication link is broken');
        }
    })
});

module.exports = router;