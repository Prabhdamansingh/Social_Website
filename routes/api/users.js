const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//@route   POST api/users
//@desc    Register user
//@access  public

router.post(
  "/",
  [
    check("name", "Name is required").not().notEmpty(),
    check("email", "Please include a valid Email adress").isEmail(),
    check(
      "password",
      "Pleas enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    // now when validation is done we need to check other things
    const { name, email, password } = req.body;

    try {
      // this try catch is here because moongoose return promise
      // we need to put asysnc infront of (req,res) and you will many of them return promises and hence needed to use await

      //see if user exist - send back error

      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email already Exist" }] });
      }
      //get user gravitar and put it  //{ s =size r =rating pg d= display mm }
      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

      user = new User({
        // this dosnt save right away first we have to encrypt
        name,
        email,
        avatar,
        password,
      });
      //encrypt the passwoord using bcrypt
      const salt = await bcrypt.genSalt(10); // creating salt for encryption with 10 rounds
      user.password = await bcrypt.hash(password, salt); // creates hash and put in password

      await user.save(); // now it save to mongo and we have to await

      //return json webtoken - if user is able to logged in its because of this
      res.send("User Registerd");
    } catch (err) {
      // this error here will be a server error
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);
module.exports = router;
