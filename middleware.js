// module.exports.isLoggedIn = (req,res,next) =>{
//   // console.log("isLoggedIn middleware hit");

//     // console.log(req.path,"..",req.originalUrl);
//     console.log(req.path)
//     if(!req.isAuthenticated()){
//     req.flash("error","you must be loged in");
//     return res.redirect("/login");
//   };
//   next()
// } 



module.exports.isLoggedIn = (req,res,next) =>{
    console.log("Middleware hit!");  // sabse pehle check
    console.log("req.path:", req.path,".." ,req.originalUrl);
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl; // jaise user login kare toh /listing url pr na jake /jobhipath access ki koshish ki wala url me jaye
        req.flash("error","you must be logged in");
        return res.redirect("/login");
    }
    next();
}

// passport ek aisa kam kar deta hai ki middleware ke value ko relaod hone pr reset kar deta hai redirscturl isliye delete ho jata hai toh local middleware banye taki local reset nhi ho pata hai is me save kiye sare redirecturl value
module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl;
  }
  next();
}

const Listing =require("./models/listing");

module.exports.isOwner = async(req,res,next)=>{
   let {id}=req.params;
    let listing = await Listing.findById(id); // model ki jarurat hogi
    if(! listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","you don't have access to do so");
      return res.redirect(`/listings/${id}`); // rerutn krna jarur warn acrash hhtp header sent error menas i req ke liye 2 res bhej tune
    }
    next();
}

const ExpressError =require("./utils/ExpressError.js");
// listing toh kiya hai upar require
const {listingSchema } =require("./schema.js"); 
module.exports.validateListing =(req,res,next)=>{
   
    let {error} = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
      let errmsg =error.details.map((el)=>el.message).join(",");
      // throw new ExpressError (404,result.error);
      throw new ExpressError (400,errmsg);
    }else{  
      next(); 
    }

}




// niche wale ko upr me middleare bana diya 

// const validateListing =(req,res,next)=>{
   
//     let {error} = listingSchema.validate(req.body);
//     // console.log(result);
//     if(error){
//       let errmsg =error.details.map((el)=>el.message).join(",");
//       // throw new ExpressError (404,result.error);
//       throw new ExpressError (400,errmsg);
//     }else{  
//       next(); 
//     }

// }




const {reviewSchema} =require("./schema.js")

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};


// const validateReview = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   if (error) {
//     let errmsg = error.details.map(el => el.message).join(",");
//     throw new ExpressError(400, errmsg);
//   } else {
//     next();
//   }
// };

const Review = require("./models/review.js");

module.exports.isReviewAuthor = async(req,res,next)=>{
   let {id,reviewId}=req.params;
    let review = await Review.findById(reviewId); // model ki jarurat hogi
    if(! review.author._id.equals(res.locals.currUser._id)){
      req.flash("error","you don't have access to do so");
      return res.redirect(`/listings/${id}`); // rerutn krna jarur warn acrash hhtp header sent error menas i req ke liye 2 res bhej tune
    }
    next();
}