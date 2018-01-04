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

/*Updating sensors' values */
var iterationIntervalInSeconds = 60;
setInterval(function() {
    Component.find({}, function(err, components) {
        if (err) {
            console.log(err);
        } else {
            for (eachComponent in components) {
                var tmpComponent = components[eachComponent];
                var newDataArray = defineNewComponentValues(tmpComponent, iterationIntervalInSeconds);
                Component.findOneAndUpdate({ _id: tmpComponent._id }, { $set: { data: newDataArray[0], regulation_history: newDataArray[1] } }, function(err, data) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        }
    });
}, 1000 * iterationIntervalInSeconds)

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
                            url: 'http://localhost:3000/#!/authentication/' + username + '/' + confirmationHash
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
            console.log(err);
            res.json({ message: 'Something went wrong. Please try again later.' });
        }
        if (doc) {
            doc.active = true;
            doc.save(function(err, savedObject) {
                if (err) {
                    console.log('err');
                    res.json({ message: 'Something went wrong. Please try again later.' });
                } else {
                    res.json({ message: 'Successfully authenticated!' });
                }
            });
        } else {
            res.json({ message: 'Authentication failed. Either your account is already authenticated or authentication link is broken' });
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

/* Get component by id */
router.get('/api/component/get/:componentId', function(req, res) {
    var componentId = req.params.componentId;
    if (!req.session.user) {
        res.json({
            found: false,
            message: 'User not logged!'
        });
    } else {
        var userId = req.session.user._id;
        Component.findOne({ user: userId, _id: componentId }, function(err, component) {
            if (err) {
                res.json({
                    found: false,
                    message: 'Something went wrong. Please try again!'
                });
            } else {
                res.json({
                    found: true,
                    message: 'Successfully found component',
                    component: component
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
        newcomponent.creation_date = new Date();
        newcomponent.data = [];
        newcomponent.data.push(defineComponentInitVal(newcomponent.range, newcomponent.resolution));
        newcomponent.regulation_history = [];
        newcomponent.regulation_history.push(newcomponent.regulation);

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
                    message: 'Successfully added component. Redirecting to Component List...!'
                });
            }
        });
    }
});

/* Edit component */
router.post('/api/component/edit', function(req, res) {
    var component = req.body;
    var componentId = req.body._id;

    var componentKeys = Object.keys(component);
    for (eachKey in componentKeys) {
        switch (componentKeys[eachKey]) {
            case 'desired':
            case 'icon':
            case 'name':
            case 'range':
            case 'regulation':
            case 'resolution':
                break;
            default:
                delete component[componentKeys[eachKey]];
        }
    }

    Component.findOneAndUpdate({ _id: componentId }, { $set: component }, function(err, updatedComponent) {
        if (err) {
            if (err.code === 11000) {
                res.json({
                    added: false,
                    message: 'This component name already exists!',
                    danger: ['componentName']
                });
            } else {
                throw err;
                console.log(err);
                res.json({
                    edited: false,
                    message: 'Something went wrong. Please try again!'
                });
            }
        } else {
            res.json({
                edited: true,
                message: 'Changes saved!',
            });
        }
    });
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
                message: 'Successfully removed component. Redirecting to Component List...'
            });
        }
    });
});

function decimalPlaces(num) {
    var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
        0,
        // Number of digits right of decimal point.
        (match[1] ? match[1].length : 0)
        // Adjust for scientific notation.
        -
        (match[2] ? +match[2] : 0));
}

function defineComponentInitVal(range, resolution) {
    return parseFloat(Math.round((Math.random() * (range[1] - range[0]) + range[0]) / resolution) * resolution).toFixed(decimalPlaces(resolution))
}

function defineNewComponentValues(component, iterationIntervalInSeconds) {
    var currentValue = component.data[component.data.length - 1];
    var range = component.range;
    var resolution = component.resolution;
    var regulation = component.regulation;
    var type = component.type;
    var data = component.data;
    var regulationHistory = component.regulation_history;

    var currentDate = new Date();
    var createDate = component.creation_date;
    var timeDiff = Math.abs(currentDate.getTime() - createDate.getTime());
    var desiredDataArrayLength = Math.ceil(timeDiff / (1000 * 60));
    var currentDataArrayLength = component.data.length;

    var lackingIterations = desiredDataArrayLength - currentDataArrayLength;
    for (var lackingIterationsIndex = 0; lackingIterationsIndex < lackingIterations; lackingIterationsIndex++) {
        if (type == 'Temperature') {
            valueChangeMaxTempo = Math.floor((range[1] - range[0]) / 10);
        } else if (type == 'Humidity') {
            valueChangeMaxTempo = Math.floor((range[1] - range[0]) / 10);
        } else if (type == 'Pressure') {
            valueChangeMaxTempo = 3;
        } else if (type == 'Binary Switch') {
            valueChangeMaxTempo = 1;
        }
        if (regulation === true) {
            var desiredValue = component.desired;
            if (currentValue < desiredValue) {
                /* Set current value by adding positive factor ( 0, +valueChangeMaxTempo ) */
                if (type == 'Binary Switch') {
                    newCurrentValue = 1
                } else {
                    newCurrentValue = +(+currentValue) + +(parseFloat(Math.round((Math.random() * valueChangeMaxTempo) / resolution) * resolution).toFixed(decimalPlaces(resolution)));
                }
            } else if (currentValue > desiredValue) {
                /* Set current value by adding negative factor ( -valueChangeMaxTempo, 0 ) */
                if (type == 'Binary Switch') {
                    newCurrentValue = 0
                } else {
                    newCurrentValue = +(+currentValue) + +(parseFloat(Math.round(-(Math.random() * valueChangeMaxTempo) / resolution) * resolution).toFixed(decimalPlaces(resolution)));
                }
            } else {
                /* Set current value directly as desired */
                newCurrentValue = desiredValue;
            }
        } else {
            /* Set current value by adding random factor ( -valueChangeMaxTempo, +valueChangeMaxTempo ) */
            if (type == 'Binary Switch') {
                newCurrentValue = Math.round(Math.random());
            } else {
                newCurrentValue = +(+currentValue) + +(parseFloat(Math.round((Math.random() * valueChangeMaxTempo * 2 - valueChangeMaxTempo) / resolution) * resolution).toFixed(decimalPlaces(resolution)));
            }

        }
        newCurrentValue = parseFloat(newCurrentValue).toFixed(decimalPlaces(resolution));
        newCurrentValue = Number(newCurrentValue);

        if (newCurrentValue > range[1]) {
            newCurrentValue = range[1];
        } else if (newCurrentValue < range[0]) {
            newCurrentValue = range[0];
        }
        data.push(newCurrentValue);
        regulationHistory.push(regulation);
    }
    return [data, regulationHistory];
}

module.exports = router;