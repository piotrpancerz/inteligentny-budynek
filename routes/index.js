/* Dependencies */
const express = require('express');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const crypto = require('crypto');
const mailer = require('pug-mailer');

const User = require('../models/User');
const Component = require('../models/Component');
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
        User.findOne({
            username: user.username
        }, function(err, userFromDatabase) {
            if (err || !userFromDatabase) {
                return res.json({
                    'logged': false
                })
            } else {
                return res.json({
                    'logged': true,
                    'user': {
                        'username': user.username,
                        'active': userFromDatabase.active,
                        'email': user.email
                    }
                })
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
                if (err.code === 11000) {
                    /* Email or username could violate the unique index. we need to find out which field it was. */
                    var usernameIndex = err.message.indexOf("username");
                    var emailIndex = err.message.indexOf("email");
                    if (usernameIndex >= 0) {
                        res.json({
                            registered: 'Username is already used!',
                            danger: ['username']
                        })
                    } else if (emailIndex >= 0) {
                        res.json({
                            registered: 'Email is already used!',
                            danger: ['email']
                        })
                    } else {
                        res.json({
                            registered: 'Oops! Something went wrong. Please try again!',
                            danger: ['username', 'email', 'password', 'passwordConfirm']
                        })
                    }
                }

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
                    .then(response => res.json({
                        registered: true
                    }))
                    .catch(err => {
                        res.json({
                            registered: 'Oops! Something went wrong. Please try again!',
                            danger: ['username', 'email', 'password', 'passwordConfirm']
                        })
                    });
            }
        });
    } else {
        res.json({
            registered: 'Provided email is invalid',
            danger: ['email']
        })
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

/* Get all user components */
router.get('/api/components/get', function(req, res) {
    if (!req.session.user) {
        res.json({
            found: false,
            message: 'User not logged!'
        });
    } else {
        var userId = req.session.user._id;
        Component.find({ user: userId }, function(err, components) {
            if (err) {
                res.json({
                    found: false,
                    message: 'Something went wrong. Please try again!'
                });
            } else {
                res.json({
                    found: true,
                    message: 'Successfully found components',
                    components: components
                });
            }
        });
    }
});


/* Add component */
router.post('/api/component/add', function(req, res) {
    var component = req.body;
    if (!req.session.user) {
        res.json({
            added: false,
            message: 'User not logged!'
        });
    } else {
        component.user = req.session.user._id;
        var newcomponent = new Component(component);

        newcomponent.save(function(err, savedComponent) {
            if (err) {
                if (err.code === 11000) {
                    res.json({
                        added: false,
                        message: 'This component name already exists!',
                        danger: ['componentName']
                    });
                } else {
                    console.log(err);
                    res.json({
                        added: false,
                        message: 'Something went wrong. Please try again!'
                    });
                }

            } else {
                res.json({
                    added: true,
                    message: 'Successfully added component. Resetting form...!'
                });
            }
        });
    }
});

/* Edit sensor */
router.post('/api/component/edit/:componentId', function(req, res) {
    var componentId = req.params.componentId;
    res.json(componentId);
});

/* Delete component */
router.post('/api/component/delete', function(req, res) {
    var component = req.body;
    Component.remove({ _id: component._id }, function(err, data) {
        if (err) {
            console.log(err);
            res.json({
                deleted: false,
                message: 'Something went wrong. Please try again!'
            });

        } else {
            res.json({
                deleted: true,
                message: 'Successfully removed component. Resetting form...!'
            });
        }
    });
});

module.exports = router;