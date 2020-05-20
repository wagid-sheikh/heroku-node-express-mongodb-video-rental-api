const auth = require("../middleware/auth.js");
const asyncMiddleWare = require("../middleware/async.js");
const validateObjectId = require("../middleware/validateObjectId.js");
const admin = require("../middleware/admin.js");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {
  User,
  userSchema,
  validate,
  validateProfile,
} = require("../models/users.js");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get(
  "/",
  auth,
  asyncMiddleWare(async (req, res) => {
    const users = await User.find().sort({ name: 1 });
    users.length > 0
      ? res.status(200).send(users)
      : res.status(404).json("No Records Found");
  })
);
router.get(
  "/me",
  auth,
  asyncMiddleWare(async (req, res) => {
    //If we have reached this far in our code that means we have a valid
    //authorization token and req header would automatically contain user object
    if (mongoose.Types.ObjectId.isValid(req.user._id)) {
      const user = await User.findById(req.user._id).select("-password");
      user
        ? res.status(200).send(user)
        : res.status(404).json("No such Record Found");
    } else {
      res.status(400).json("Invalid User.");
    }
  })
);
router.get(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    const user = await User.findById(req.params.id);
    user
      ? res.status(200).send(user)
      : res.status(404).send("No such Record Found");
  })
);
router.post(
  "/",
  asyncMiddleWare(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .send(
          "A user with this email already exists. [" + req.body.email + "]"
        );

    user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(200)
      .send(_.pick(user, ["_id", "name", "email"]));
  })
);
router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true }
    );
    res.status(200).send(result);
  })
);
router.put(
  "/updateProfile/:id",
  [auth, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    const { error } = validateProfile(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      { new: true }
    );
    const token = result.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(200)
      .send(_.pick(result, ["_id", "name", "email"]));
  })
);
router.delete(
  "/:id",
  [auth, admin, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).send(user);
  })
);

module.exports = router;
