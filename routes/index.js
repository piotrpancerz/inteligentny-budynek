const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const emailValidator = require("email-validator");

// Get home page
router.get('/', function(req, res) {
    // console.log(req.session.user);
    if (!req.session.user) {
        res.status(401).send();
    } else {
        res.status(200).send();
    }
});

router.get('/dashboard', function(req, res) {
    // console.log(req.session.user);
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

    if (emailValidator.validate(email)) {
        var newuser = new User();
        newuser.username = username;
        newuser.password = password;
        newuser.email = email;
        newuser.active = active;

        newuser.save(function(err, savedUser) {
            if (err) {
                throw err;
                res.status(500).send();
            } else {
                res.status(200).send('Successfully registered!');
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
            return res.status(500).send();
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

module.exports = router;