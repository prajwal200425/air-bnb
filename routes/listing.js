const express = require("express");
const app = express();
const router = express.Router();
const MyError = require("../utilities/MyError.js");
const wrapAsync = require("../utilities/WrapAsync.js");
const Listing = require("../models/listing.js");
const passport = require("passport")
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
let flash = require("connect-flash");

router.get(
    "/",
    wrapAsync(async (req, res) => {
      const allListing = await Listing.find({});
      res.render("listing/index.ejs", { allListing });
    })
  );
  
  // new listing route
  router.get("/new", (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash("error", "You must be logged in to create listings!")
      res.redirect("/login");
    } else {
      res.render("listing/new.ejs");
    }
  });
  
  // show route / READ
  
  router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id).populate("reviews");
      res.render("listing/show.ejs",{ listing });
      
    })
  );
  
  // create route`
  
  router.post(
    "/",
    wrapAsync(async (req, res, next) => {
      if (!req.body.listing) {
        throw new Error(400, "send valid data.");
      }
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      req.flash("success" , "New Listing Created!");
      res.redirect("/listing");
    })
  );
  
  // edit route
  
  router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      res.render("listing/edit.ejs", { listing });
    })
  );
  
  // update route
  router.put(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // object deconstruct
      req.flash("success" , " Listing Updated!");
      res.redirect(`/listing/${id}`);
    })
  );
  
  // delete route
  router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deleted = await Listing.findByIdAndDelete(id);
      req.flash("success" , "Listing Deleted!");
      console.log(deleted);
      res.redirect("/listing");
     
    })
  );
  

  module.exports = router;