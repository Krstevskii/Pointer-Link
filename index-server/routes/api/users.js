const express = require('express');
const request = require('request');
const passport = require('passport');
const router = express.Router();

// @route   GET /api/users/test || users-service/test
// @desc    TEST users route
// @access  Public route
router.get('/test', (req, res) => {
   request.get('http://users-service:3001/test', (err, resp, body) => {
       if(err) return res.status(503).json(err);
       res.json(JSON.parse(body))
   });
});

// @route   POST /api/users/register || users-service/register
// @desc    Register user
// @access  Public route
router.post('/register', (req, res) => {
    request.post({
        url: 'http://users-service:3001/register',
        form: req.body
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);

        res.status(resp.statusCode).json(JSON.parse(body));
    })
});

// @route   POST /api/users/login || users-service/register
// @desc    Login User / Returning the JSON Web Token
// @access  Public
router.post('/login', (req, res) => {
    request.post({
        url: 'http://users-service:3001/login',
        form: req.body
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body))
    });
});

// @route   POST /api/users/current
// @desc    Return Current User
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    request.post({
        url: 'http://users-service:3001/current',
        form: req.user
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body));
    });
});

module.exports = router;