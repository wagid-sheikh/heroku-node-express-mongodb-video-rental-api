const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const admin = require("../middleware/admin.js");
const asyncMiddleWare = require("../middleware/async.js");
const validateObjectId = require("../middleware/validateObjectId.js");
const { Genre, validate } = require("../models/genres.js");
const mongoose = require("mongoose");

router.get(
  "/",
  auth,
  asyncMiddleWare(async (req, res) => {
    const genres = await Genre.find().sort({ name: 1 });
    genres.length > 0
      ? res.status(200).send(genres)
      : res.status(404).json("No Records Found");
  })
);
router.get(
  "/WAGID",
  asyncMiddleWare(async (req, res) => {
    const genres = await Genre.find().sort({ name: 1 });
    genres.length > 0
      ? res.status(200).send(genres)
      : res.status(404).json("No Records Found");
  })
);
/* router.get(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    genre
      ? res.status(200).send(genre)
      : res.status(404).json("No such Record Found");
  })
); */
router.post(
  "/",
  auth,
  asyncMiddleWare(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.status(200).send(genre);
  })
);
router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const result = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.status(200).send(result);
  })
);
router.delete(
  "/:id",
  [auth, admin, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    const genere = await Genre.findByIdAndDelete(req.params.id);
    res.status(200).send(genere);
  })
);
module.exports = router;
