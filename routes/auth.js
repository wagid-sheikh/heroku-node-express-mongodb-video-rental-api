const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/users.js");
const asyncMiddleWare = require("../middleware/async.js");

const express = require("express");
const router = express.Router();

router.post(
  "/",
  asyncMiddleWare(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .send("Invalid Email/Password/No Such Account Exist");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) return res.status(400).send("Invalid Email/Password.");

    const token = user.generateAuthToken();
    res.status(200).send(token);
    //res.header("user", _.pick(user, ["_id", "name", "email"]));
    /* res
      .header("x-auth-token", token)
      .status(200)
      .send(_.pick(user, ["_id", "name", "email"]));
    res.status(200).send(token); */
  })
);
router.post(
  "/changePassword/:id",
  asyncMiddleWare(async (req, res) => {
    if (
      !(
        req.body.currentPassword &&
        req.body.newPassword &&
        req.body.reEnteredPassword
      )
    )
      return res.status(400).send("Required Parameters missing");
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return status(400).send("Invalid Account/No Such Account Exists");
    const validPassword = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!validPassword) return res.status(400).send("Invalid Password.");

    if (req.body.newPassword !== req.body.reEnteredPassword)
      return res.status(400).send("New Passwords do not match.");

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(req.body.newPassword, salt);
    await User.findByIdAndUpdate(
      user._id,
      {
        password: user.password,
      },
      { new: true }
    );
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(200)
      .send(_.pick(user, ["_id", "name", "email"]));
  })
);
function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(256).required().email(),
    password: Joi.string().min(5).max(256).required(),
  };
  return Joi.validate(req, schema);
}
module.exports = router;
