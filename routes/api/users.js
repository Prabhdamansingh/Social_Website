const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const normalize = require('normalize-url');

//@route   POST api/users
//@desc    Register user
//@access  public

router.post(
    '/',

    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid Email adress').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // now when validation is done we need to check other things
        const { name, email, password } = req.body;

        try {
            // tip - this try catch is here because moongoose return promise
            // info -we need to put asysnc infront of (req,res) and you will see many of them return promises and hence needed to use await

            // 1. see if user exist - send back error

            let user = await User.findOne({ email });
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Email already Exist' }] });
            }

            //2. get user gravitar and put it  //{ s =size r =rating pg d= display mm }
            const avatar = normalize(
                gravatar.url(email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm',
                }),
                { forceHttps: true }
            );

            user = new User({
                // tip -  this dosnt save right away first we have to encrypt
                name,
                email,
                avatar,
                password,
            });

            //3. encrypt the passwoord using bcrypt
            const salt = await bcrypt.genSalt(10); // info -creating salt for encryption with 10 rounds
            user.password = await bcrypt.hash(password, salt); //info -creates hash and put in password

            //4. now it save to mongoDB and we have to await
            await user.save();

            //5. return json webtoken - when it gets registerd
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
