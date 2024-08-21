const express = require("express");
const router = express.Router();
const { reviewSchema } = require("../Schema.js");
const MyError = require("../utilities/MyError.js");
const wrapAsync = require("../utilities/WrapAsync.js");
const Reviews = require("../models/reviews.js");
const Listing = require("../models/listing.js");
// review rout / Post route.

router.post(
  "/:id/reviews",

  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);

    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();
    req.flash("success" , "Review Submited!");
    res.redirect(`/listing/${listing._id}`);
  })
);

module.exports = router;
