const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb://root:krstevski14@mongodb-service:27017/admin', { useNewUrlParser: true })
    .then(() => console.log(`MongoDB connected from Profile microservice..`))
    .catch(err => console.log(err));

// Load Profile Model
require('./models/Profile');
const Profile = mongoose.model('profile');

// Only load User Model for the mongoose caching between container
require('./models/User');
const User = mongoose.model('users');

// Load Validation
const validateProfileInput = require('./validation/profile');
const validateExperienceInput = require('./validation/experience');
const validateEducationInput = require('./validation/education');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// @route   GET /api/profiles/test || profile-service/test
// @desc    Test profiles route
// @access  Public route
app.get('/test', (req, res) => {
    res.status(200).json({msg: "Inside Profile Test"});
});

// @route   POST /api/profiles/current || profile-service/current
// @desc    Get Current Users Profile
// @access  Private
app.post('/current', (req, res) => {
    let errors = {};
    console.log(req.body);
    Profile.findOne({ user: req.body._id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err =>  res.status(404).json(err));
});

// @route   GET /api/profile/all || profile-service/all
// @desc    GET All Profile by handle
// @access  Public
app.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if((typeof(profiles) === "object") && (Object.keys(profiles).length === 0)){
                errors.noprofile = 'There are no profiles';
                return res.status(404).json({ errors })
            }
            res.json(profiles);
        })
        .catch(err =>  res.status(404).json({noprofile: 'There are no profiles' }));
});

// @route   GET /api/profile/handle/:handle || profile-service/handle/:handle
// @desc    GET Profile by handle
// @access  Public
app.get('/handle/:handle', (req, res) => {

    const errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            console.log(profile);
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json({ noprofile: 'There is no profile for this user' }));
});

// @route   GET /api/profile/user/:user_id
// @desc    GET Profile by user_id
// @access  Public
app.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {

            console.log(profile);
            if(!profile) {
                errors.noprofile = 'There is no profile for this usesr';
                return res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ noprofile: 'There is no profile for this usser' })
        });
});

// @route   POST /api/profiles || profile-service
// @desc    Create or Edit User Profile
// @access  Private
app.post('/', (req, res) => {

    req.user = {};
    req.user.id = req.body['user[id]'];
    delete req.body['user[id]'];

    const { errors, isValid } = validateProfileInput(req.body);
    // Check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills - split into array
    if(typeof req.body.skills !== undefined) {
        profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(profile){
                //Update
                Profile.findOneAndUpdate(
                    { user: req.user.id},
                    { $set: profileFields },
                    { new: true })
                    .then( profile => res.json(profile) )
            } else {
                // Create

                // Check if handle exists
                Profile.findOne({ handle: profileFields.handle })
                    .then( profile => {
                        if(profile) {
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }

                        new Profile(profileFields)
                            .save()
                            .then( profile => res.json(profile) );

                    })
            }
        })
});

// @route   POST /api/profile/experience || profile-service/experience
// @desc    Add Experience to Profile
// @access  Private
app.post('/experience', (req, res) => {

    req.user = {};
    req.user.id = req.body['user[id]'];
    delete req.body['user[id]'];

    const { errors, isValid } = validateExperienceInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            // Add to experience array
            profile.experience.unshift(newExp);
            profile.save()
                .then(profile => res.json(profile));
        })
});

// @route   POST /api/profile/education || profile-service/education
// @desc    Add Education to Profile
// @access  Private
app.post('/education', (req, res) => {

    req.user = {};
    req.user.id = req.body['user[id]'];
    delete req.body['user[id]'];

    const { errors, isValid } = validateEducationInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({user: req.user.id})
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            // Add to experience array
            profile.education.unshift(newEdu);
            profile.save()
                .then(profile => res.json(profile));
        });
});

// @route   DELETE api/profile/experience/:exp_id || profile-service/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
app.delete('/experience/:exp_id', (req, res) => {

    req.user = {};
    req.user.id = req.body['user[id]'];
    delete req.body['user[id]'];

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // Get remove index
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf( req.params.exp_id );

            // Splice out of array
            profile.experience.splice(removeIndex, 1);

            // Save
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
}
);

// @route   DELETE api/profile/education/:edu_id || profile-service/education/:edu_id
// @desc    Delete education from profile
// @access  Private
app.delete('/education/:edu_id', (req, res) => {

    req.user = {};
    req.user.id = req.body['user[id]'];
    delete req.body['user[id]'];

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // Get remove index
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id);

            // Splice out of array
            profile.education.splice(removeIndex, 1);

            // Save
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile || profile-service/
// @desc    Delete user and profile
// @access  Private
app.delete('/', (req, res) => {

    req.user = {};
    req.user.id = req.body['user[id]'];
    delete req.body['user[id]'];

    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
            res.json({ success: true })
        );
    });
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`profiles microservice listens on port ${port}`));