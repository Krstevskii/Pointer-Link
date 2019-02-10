const express = require('express');
const request = require('request');
const passport = require('passport');
const router = express.Router();

// @route   GET /api/profiles/test || profile-service/test
// @desc    Test profiles route
// @access  Public route
router.get('/test', (req, res) => {
    request.get({
        url: 'http://profile-service:3002/test'
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body));
    })
});

// @route   GET /api/profiles
// @desc    Get Current Users Profile
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    request.post({
        url: 'http://profile-service:3002/current',
        form: req.user
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body));
    });
});

// @route   GET /api/profiles/all || profile-service/all
// @desc    GET All Profile by handle
// @access  Public
router.get('/all', (req, res) => {
    request.get({
        url: 'http://profile-service:3002/all'
    }, (err, resp, body) => {
       if(err) return res.status(503).json(err);
       res.status(resp.statusCode).json(JSON.parse(body));
    });
});

// @route   GET /api/profile/handle/:handle || profile-service/handle/:handle
// @desc    GET Profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
    request.get({
        url: `http://profile-service:3002/handle/${req.params.handle}`
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body));
    });
});

// @route   GET /api/profile/user/:user_id || profile-service/user/:user_id
// @desc    GET Profile by user_id
// @access  Public
router.get('/user/:user_id', (req, res) => {
    request.get({
        url: `http://profile-service:3002/user/${req.params.user_id}`
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body))
    });
});

// @route   POST /api/profile || profile-service
// @desc    Create or Edit User Profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const form = {
        ...req.body,
        user: {
            id: req.user._id
        }
    };
    request.post({
        url: 'http://profile-service:3002',
        form: {
            ...form
        }
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body));
    });
});

// @route   POST /api/profiles/experience || profile-service/experience
// @desc    Add Experience to Profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    request.post({
        url: 'http://profile-service:3002/experience',
        form: {
            ...req.body,
            user: {
                id: req.user._id
            }
        }
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body));
    })
});

// @route   POST /api/profiles/education || profile-service/education
// @desc    Add Education to Profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    request.post({
        url: 'http://profile-service:3002/education',
        form: {
            ...req.body,
            user: {
                id: req.user._id
            }
        }
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body));
    });
});

// @route   DELETE api/profile/experience/:exp_id || profile-service/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    request
        .delete({
            url: `http://profile-service:3002/experience/${req.params.exp_id}`,
            form: {
                user: {
                    id: req.user._id
                }
            }
            }, (err, resp, body) => {
            if(err) return res.status(503).json(err);
            res.status(resp.statusCode).json(JSON.parse(body));
        })
});

// @route   DELETE api/profile/education/:edu_id || profile-service/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    request
        .delete({
        url: `http://profile-service:3002/education/${req.params.edu_id}`,
        form: {
            user: {
                id: req.user._id
            }
        }
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body));
    })
});

// @route   DELETE api/profiles || profile-service/
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    request
        .delete({
            url: 'http://profile-service:3002',
            form: {
                user: {
                    id: req.user._id
                }
            }
        }, (err, resp, body) => {
            if(err) return res.status(503).json(err);
            res.status(resp.statusCode).json(JSON.parse(body));
        })
});

module.exports = router;