const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Error = require("./utilities/MyError.js");
const wrapAsync = require("./utilities/WrapAsync.js");
const Reviews = require("./models/reviews.js");
const { reviewSchema } = require("./Schema.js");
const MyError = require("./utilities/MyError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const passportLocalMongoose = require("passport-local-mongoose");

app.set("views", path.join(__dirname, "views"));
app.set("view Engine", "ejs ");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => {
    console.log("connect to DB");
  })
  .catch((err) => {
    console.log(err);
  });
  async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    
  }
  
// session implementation
  const sessionOption = {
    secret : "supersecretcode",
    resave: false,
    saveUninitialized: true,
    Cookie : {
      expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge : 7 * 24 * 60 * 60 * 1000,
      httpOnly :true,
    },
  }
  app.use(session(sessionOption));
app.use(flash());

// flash message middlewere
app.use((req , res , next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

// accessing  listings routes
const listings = require("./routes/listing.js");
app.use("/listing", listings);

// accessing  review routes
const reviews = require("./routes/reviews.js");
app.use("/listing", reviews);

const userRoute = require("./routes/user.js");
app.use("/" , userRoute);


app.get("/", (req, res) => {
  res.send("root working");
});

// Authenticates and Authorization middlewere
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());








// middlewares

// send err message and ststus code.
app.all("*", (req, res, next) => {
  next(new Error(404, " Page not found."));
});

// err middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong !" } = err;
  res.status(status).render("listing/error.ejs", { err });
});

app.listen(8080, () => {
  console.log("port running at 8080");
});
