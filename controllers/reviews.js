const Listing = require("../models/listing"); // file ka listing hai in model shraddha ka L hai 

const Review = require("../models/review");

module.exports.createReview =  async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;  // is se user account ka namm bhi aayega kis ne comment kiya
  
  await newReview.save();               // 🔥 pehle save

  listing.reviews.push(newReview._id);  // 🔥 sirf ID push
  await listing.save();

req.flash("success", "New Review Created");

  res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // listing se review id hatao
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    // review collection se delete karo
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
  }