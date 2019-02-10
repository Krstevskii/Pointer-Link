const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect(`mongodb://root:krstevski14@mongodb-service:27017/admin`, {useNewUrlParser: true})
    .then(() => console.log('MongoDB connected from Posts microservice..'))
    .catch(err => console.log(err));

// Load Profile Model
require('./models/Profile');
const Profile = mongoose.model('profile');

// Load Posts Model
require('./models/Post');
const Post = mongoose.model('posts');

// Validation
const validatePostInput = require('./validation/post');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// @route   GET /api/posts/test || posts-service/test
// @desc    Test post route
// @access  Public route
app.get('/test', (req, res) => res.json({msg: 'Posts works'}));

// @route   GET /api/posts || posts-service/
// @desc    Get Posts
// @access  Public
app.get('/', (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => {
            res.json(posts)
        })
        .catch(err => res.status(404).json({nopostfound: 'No posts found'}));
});

// @route   GET /api/posts/:id || posts-service/:id
// @desc    Get Post by id
// @access  Public
app.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            res.json(post)
        })
        .catch(err => res.status(404).json({nopostfound: 'No post found with that ID'}));
});

// @route   POST /api/posts || posts-service/
// @desc    Create Post
// @access  Private
app.post('/', (req, res) => {

    req.user = {};
    req.user.id = req.body['user[id]'];
    delete req.body['user[id]'];

    const {errors, isValid} = validatePostInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

// @route   DELETE /api/posts/:id || posts-service/:id
// @desc    Delete Post by id
// @access  Private
app.delete('/:id', (req, res) => {

    req.user = {};
    req.user.id = req.body['user[id]'];
    delete req.body['user[id]'];

    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({notauthorized: 'User not authorized'});
                    }

                    // Delete
                    post.remove().then(() => res.json({success: true}))
                }).catch(err => res.status(404).json({postnotfound: 'No post found'}));
        });
});

// @route   POST /api/posts/like/:id || posts-service/like/:id
// @desc    Like post
// @access  Private
app.post('/like/:id', (req, res) => {

    req.user = {};
    req.user.id = req.body['user[id]'];
    delete req.body['user[id]'];

    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({alreadyliked: 'User already liked this post'})
                    }

                    // Add user id to likes array
                    post.likes.push({user: req.user.id});
                    post.save()
                        .then(post => res.json(post));
                })
                .catch(err => res.status(404).json({postnotfound: 'No post found'}));
        });
});

// @route   POST /api/posts/unlike/:id || posts-service/unlike/:id
// @desc    Unlike post
// @access  Private
app.post('/unlike/:id', (req, res) => {

    req.user = {};
    req.user.id = req.body['user[id]'];
    delete req.body['user[id]'];

    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({notliked: 'You have not yet liked this post'})
                    }

                    // Get the remove index
                    const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

                    post.likes.splice(removeIndex, 1);
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({postnotfound: 'No post found'}));
        });
});

// @route   POST /api/posts/comment/:id || posts-service/comment/:id
// @desc    Comment on post
// @access  Private
app.post('/comment/:id', (req, res) => {

        req.user = {};
        req.user.id = req.body['user[id]'];
        delete req.body['user[id]'];

        console.log(req.body);

        const {errors, isValid} = validatePostInput(req.body);
        // Check Validation
        if (!isValid) {
            // If any errors, send 400 with errors object
            return res.status(400).json(errors);
        }

        Post.findById(req.params.id)
            .then(post => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.user.id
                };

                // Add to comments array
                post.comments.unshift(newComment);

                // Save
                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(404).json({postnotfound: 'No post found'}));
    }
);

// @route   DELETE /api/posts/comment/:id/:comment_id || posts-service/comment/:id/:comment_id
// @desc    Delete comment on post
// @access  Private
app.delete('/comment/:id/:comment_id', (req, res) => {
        req.user = {};
        req.user.id = req.body['user[id]'];
        delete req.body['user[id]'];

        Post.findById(req.params.id)
            .then(post => {
                // Check to see if comment exists
                if (
                    post.comments.filter(
                        comment => comment._id.toString() === req.params.comment_id
                    ).length === 0
                ) {
                    return res
                        .status(404)
                        .json({commentnotexists: 'Comment does not exist'});
                }

                // Get remove index
                const removeIndex = post.comments
                    .map(item => item._id.toString())
                    .indexOf(req.params.comment_id);

                // Splice comment out of array
                post.comments.splice(removeIndex, 1);

                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(404).json({postnotfound: 'No post found'}));
    }
);

const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`posts microservice listens on port ${port}`));