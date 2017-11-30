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

    var newuser = new User();
    newuser.username = username;
    newuser.password = password;
    newuser.email = email;
    newuser.active = active;

    newuser.save(function(err, savedUser) {
        if (err) {
            throw err;
            res.status(500).send()
        } else {
            res.status(200).send(savedUser);
        }
    })
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
            return res.status(404).send();
        }

        user.comparePassword(password, function(err, isMatch) {
            if (isMatch && isMatch == true) {
                req.session.user = user;
                return res.status(200).send();
            } else {
                return res.status(401).send();
            }
        });
    })
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    return res.status(200).send();
})

module.exports = router;