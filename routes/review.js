const express  = require ("express");
const router =express.Router({mergeParams:true}); 
// review page me error tha kyu ki app.use se parent route ka id nhi ja raha tha islieye merge likha 

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {listingSchema } =require("../schema.js"); 
const {reviewSchema} =require("../schema.js")
const Listing =require('../models/listing.js')

const {validateReview,isLoggedIn,isReviewAuthor} =require("../middleware.js");
const { createReview } = require("../controllers/reviews.js");

// controller 
const reviewController = require("../controllers/reviews.js");


// const validateReview = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   if (error) {
//     let errmsg = error.details.map(el => el.message).join(",");
//     throw new ExpressError(400, errmsg);
//   } else {
//     next();
//   }
// };  // ye sab gaya in middleware



//review route 
 
// "/:id/reviews"

router.post("/",isLoggedIn,validateReview, wrapAsync (reviewController.createReview));


// const isReviewAuthor =require("../middleware.js"); upr karege 

router.delete(
  "/:reviewId",   // "/:id/reviews/:reviewId"
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router ;