/* Dependencies */
const express = require('express');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const crypto = require('crypto');
const mailer = require('pug-mailer');

const User = require('../models/User');
const Sensor = require('../models/Sensor');
const Actuator = require('../models/Actuator');
const House = require('../models/House');


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




/* Check if user is logged in */
router.get('/api/user/checklog', function(req, res) {
    if (!req.session.user) {
        res.json({
            'logged': false
        });
    } else {
        user = req.session.user;
        return res.json({
            'logged': true,
            'user': {
                'username': user.username,
                'active': user.active,
                'email': user.email
            }
        })
    }
});

/* Register user */
router.post('/api/user/register', function(req, res) {
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
                            url: 'http://localhost:3000/api/user/authenticate/' + username + '/' + confirmationHash
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

/* Log in user */
router.post('/api/user/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            throw err;
            return res.json({
                'logged': false
            })
        }

        if (!user) {
            return res.json({
                'logged': false
            })
        }

        user.comparePassword(password, function(err, isMatch) {
            if (isMatch && isMatch == true) {
                req.session.user = user;
                return res.json({
                    'logged': true,
                    'user': {
                        'username': user.username,
                        'active': user.active,
                        'email': user.email
                    }
                })
            } else {
                return res.json({
                    'logged': false
                })
            }
        });
    })
});

/* Log out user */
router.get('/api/user/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            return res.json({
                'logged': true
            });
        } else {
            return res.json({
                'logged': false
            });
        }
    });
});

/* Authenticate user */
router.get('/api/user/authenticate/:user/:hash', function(req, res) {
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

/* Get user home schema */
router.get('/api/home', function(req, res) {

})

/* Edit user home schema */
router.post('/api/home', function(req, res) {

})

/* Get all user sensors */
router.get('/api/sensor', function(req, res) {

});

/* Get all user actuators */
router.get('/api/actuator', function(req, res) {

});

/* Add sensor */
router.post('/api/sensor', function(req, res) {

});

/* Add actuator */
router.post('/api/actuator', function(req, res) {

});

/* Edit sensor */
router.put('/api/sensor/:sensorId', function(req, res) {

});

/* Edit actuator */
router.put('/api/actuator/:actuatorId', function(req, res) {

});

/* Delete sensor */
router.delete('/api/sensor/:sensortId', function(req, res) {

});

/* Delete actuator */
router.delete('/api/actuator/:actuatorId', function(req, res) {

});

/* Get chart data for specific sensor */
router.get('/api/sensor/data/:sensorId', function(req, res) {

});

/* Get chart data for specific actuator */
router.get('/api/actuator/data/:actuatorId', function(req, res) {

});

module.exports = router;