const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const { secretOrKey } = require('./config/keys');
const app = express();

// Connect to mongoDB container
mongoose.connect('mongodb://root:krstevski14@mongodb-service:27017/admin', { useNewUrlParser: true })
    .then(() => console.log(`MongoDB connected from User microservice..`))
    .catch(err => console.log(err));

// Load User Model
require('./models/User');
const User = mongoose.model('users'); // assign User model to a variable

// Load Input Validation
const validateRegisterInput = require('./validation/register');
const validateLoginInput = require('./validation/login');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// @route   GET /api/users/test || users-service/test
// @desc    TEST users route
// @access  Public route
app.get('/test', (req, res) => {
    res.send({msg: 'It works'});
});

// @route   POST /api/users/register || users-service/register
// @desc    Register user
// @access  Public route
app.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    console.log(errors);
    // Check Validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then( user => {
            console.log(req.body);
            if(user){
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm' // Default
                });
                const newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                };

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        new User(newUser)
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});

// @route   POST /api/users/login || users-service/login
// @desc    Login User / Returning the JSON Web Token
// @access  Public
app.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find User by Email
    User.findOne({ email })
        .then(user => {
            if(!user){
                errors.email = 'User Not Found';
                return res.status(404).json( errors );
            }

            // Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        // User Matched
                        const payload = new Object({
                            id: user._id,
                            name: user.name,
                            avatar: user.avatar
                        }); // Create JWT Payload
                        // Sign Token
                        jwt.sign(payload, secretOrKey, { expiresIn: 60 * 60 }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        });
                    } else {
                        errors.password = 'Password Incorrect';
                        return res.status(400).json( errors );
                    }
                });
        });
});

// @route   POST /api/users/getUserById || users-service/getUserById
// @desc    Get user id for the passport authentication
// @route   Public route
app.post('/getuserbyid', (req, res) => {
    User.findById(req.body.userid)
        .then(user => {
            if(user)
                return res.json(user);
            res.status(400).json({msg: "No user available"});
        });
});

// @route   POST /api/users/current
// @desc    Return Current User
// @access  Private
app.post('/current', (req, res) => {
    res.json({
        id: req.body._id,
        name: req.body.name,
        email: req.body.email
    })
});


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`users-microservice listens on port ${port}`));