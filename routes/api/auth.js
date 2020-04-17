const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

//@route   GET api/auth
//@desc    giving back user by taking token from frontend
//@access  private

// end point for checking and finding user and sending it back
router.get('/', auth, async (req, res) => {
    // info = by just putting auth which is the middleware inside the arguments make it a protected route

    try {
        const user = await User.findById(req.user.id).select('-password'); // now we have the user from database by getting user from middleware and by selected we do not want the password to be sent back

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

//@route   POST api/auth
//@desc    authenticate user & giving token to frontend
//@access  public

router.post(
    '/',
    [
        check('email', 'Please include a valid Email ').isEmail(),
        check('password', 'Password is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // now when validation is done we will destruct email and password coming from the front end through request
        const { email, password } = req.body;

        try {
            // ! - this try catch is here because moongoose return promise
            // ! -we need to put asysnc infront of (req,res) and you will see many of them return promises and hence needed to use await

            // 1. see if user exist - if not then send error

            let user = await User.findOne({ email }); // we find object by email and get whole object
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            //2. return json webtoken - when it get logged in

            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                config.get('jwtToken'),
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    res.json({ token });
                }
            );
        } catch (err) {
            // this error here will be a server ethrow err;rror
            console.error(err.message);
            res.status(500).send('server error');
        }
    }
);
module.exports = router;
