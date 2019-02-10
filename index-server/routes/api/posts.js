const express = require('express');
const request = require('request');
const passport = require('passport');
const router = express.Router();

// @route   GET /api/posts/test || posts-service/test
// @desc    Test post route
// @access  Public route
router.get('/test', (req, res) => {
    request.get({
        url: 'http://posts-service:3003/test'
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body));
    })
});

// @route   GET /api/posts || posts-service/
// @desc    Get Posts
// @access  Public
router.get('/', (req, res) => {
    request.get({
        url: 'http://posts-service:3003'
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body));
    });
});

// @route   GET /api/posts/:id || posts-service/:id
// @desc    Get Post by id
// @access  Public
router.get('/:id', (req, res) => {
    request.get({
        url: `http://posts-service:3003/${req.params.id}`
    }, (err, resp, body) => {
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body));
    })
});

// @route   POST /api/posts || posts-service/
// @desc    Create Post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    request.post({
        url: 'http://posts-service:3003',
        form: {
            ...req.body,
            user: {
                id: req.user._id
            }
        }
    }, (err, resp, body) => {
        console.log(body);
        if(err) return res.status(503).json(err);
        res.status(resp.statusCode).json(JSON.parse(body));
    })
});

// @route   DELETE /api/posts/:id || posts-service/:id
// @desc    Delete Post by id
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    request.delete({
        url: `http://posts-service:3003/${req.params.id}`,
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

// @route   POST /api/posts/like/:id || posts-service/like/:id
// @desc    Like post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    request.post({
        url: `http://posts-service:3003/like/${req.params.id}`,
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

// @route   POST /api/posts/unlike/:id || posts-service/unlike/:id
// @desc    Unlike post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    request.post({
        url: `http://posts-service:3003/unlike/${req.params.id}`,
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

// @route   POST /api/posts/comment/:id || posts-service/comment/:id
// @desc    Comment on post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    request
        .post({
            url: `http://posts-service:3003/comment/${req.params.id}`,
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

// @route   DELETE /api/posts/comment/:id/:comment_id || posts-service/comment/:id/:comment_id
// @desc    Delete comment on post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    request
        .delete({
            url: `http://posts-service:3003/comment/${req.params.id}/${req.params.comment_id}`,
            form: {
                user: {
                    id: req.user._id
                }
            }
        }, (err, resp, body) => {
            if(err) return res.status(503).json(err);
            res.status(resp.statusCode).json(JSON.parse(body));
        });
});

module.exports = router;