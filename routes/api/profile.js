const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');
const normalize = require('normalize-url');
const request = require('request');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

//@route   GET api/profile/me
//@desc    get current user profile
//@access  private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        }).populate('user', ['name', 'avatar']); // {one in profile model : coming from body }

        if (!profile) {
            return res
                .status(400)
                .json({ msg: 'There is no profile for this user' });
        }

        // only populate user if profile exist
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

//@route    POST api/profile/
//@desc     Creat Profile and update it
//@access   Private
router.post(
    '/',
    [
        auth,
        [
            check('status', 'status is required').not().isEmpty(),
            check('skills', 'skills are required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            location,
            website,
            bio,
            skills,
            status,
            githubusername,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
        } = req.body;

        // build profile object

        const profileFields = {
            user: req.user.id,
            company,
            location,
            website:
                website === '' ? '' : normalize(website, { forceHttps: true }),
            bio,
            skills: Array.isArray(skills)
                ? skills
                : skills.split(',').map((skill) => skill.trim()),
            status,
            githubusername,
        };

        // building socialfields object and tol profilefield
        const socialfields = {
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
        };

        profileFields.social = socialfields;

        try {
            let profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true, upsert: true }
            );
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error');
        }
    }
);

//@route    Get api/profile/
//@desc     Get all profiles
//@access   Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', [
            'name',
            'avatar',
        ]);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});
// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        res.json(profile);
    } catch (err) {
        if (!mongoose.Types.ObjectId.isValid('ObjectId')) {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route     DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
    try {
        // remove post
        const post = await Post.deleteMany({ user: user.req.id });
        //remove profile
        const profile = await Profile.findOneAndRemove({ user: req.user.id });
        // remove user
        const user = await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'user removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

//@route     PUT api/profile/experience
// @desc     add & update Experience
// @access   Private
router.put(
    '/experience',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Company is required').not().isEmpty(),
            check('from', 'From date is require').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error');
        }
    }
);
// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        });
        //! here id is in object check mongodb
        profile.experience = profile.experience.filter(
            (exp) => exp._id.toString() !== req.params.exp_id
        );

        await profile.save();

        return res.status(200).json(profile);
    } catch (error) {
        console.log(err.message);
        res.status(500).send('server message');
    }
});
//@route     PUT api/profile/education
// @desc     add  education
// @access   Private
router.put(
    '/education',
    [
        auth,
        [
            check('school', 'School is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty(),
            check('from', 'From date is require').not().isEmpty(),
            check('fieldofstudy', 'Field of study is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEdu);

            await profile.save();

            res.status(200).json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error');
        }
    }
);
// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        });
        //! here id is in object check mongodb
        profile.education = profile.education.filter(
            (edu) => edu._id.toString() !== req.params.edu_id
        );

        await profile.save();

        return res.status(200).json(profile);
    } catch (error) {
        console.log(err.message);
        res.status(500).send('server message');
    }
});
// @route    GET api/profile/github/:username
// @desc     Get user repos for github
// @access   public

router.get('/github/:username', (req, res) => {
    try {
        const option = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientId'
            )}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' },
        };
        request(option, (error, response, body) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                res.status(404).json({ msg: 'github profile not found !' });
            }
            return res.json(JSON.parse(body));
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
});

module.exports = router;
