
const express  = require ("express");
const router =express.Router();

const wrapAsync =require("../utils/wrapAsync.js");
// const {listingSchema } =require("../schema.js");  // middleware me shift kiya 
// const ExpressError =require("../utils/ExpressError.js"); // middleware me shift kiya 
const {reviewSchema} =require("../schema.js") // middleware me shift kiya 
const Listing =require('../models/listing.js')

const Review = require("../models/review.js");
const {isLoggedIn,isOwner,validateListing, validateReview} = require("../middleware.js");
 
const User = require("../models/user.js"); // populate("owner use krne ke liye")
const listingController = require("../controllers/listing.js");
// const {validateReview} =require("../middleware.js")


// upload se phale require kru isse  waise ye cloudinary wala sab kuch hai
const {storage} = require("../cloudConfig.js")

// multer ek parser ke jaisa kam karega file wale form ke sab data ko lega 
// so npm i multer
// require kro

const multer =require("multer");  // form ke data ko parse karega
// const upload =multer({dest:'uploads/'}) // ye sab uploaded ko ek upload name folder me save karega automatic store karega baad me 3 party app use karege for store
// ab hum local me na upload kar ke cloud pe kr rahe hai 
const upload = multer({ storage});

//----------------- route.route use krege


router.route("/") // get and post router same route pr ja rahe hai  "/",isbhi remove kr diya .. ye
.get (wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync (listingController.createListing));
// .post(upload.single('listing[image]'),(req,res)=>{     // koisi field ka data save karna hai = upload.single('e9of.. or efac..')
// //  console.log(req.file);

//   res.send(req.file);
// })

router.get("/new",isLoggedIn,listingController.renderNewForm) // isse /:id se upr likhna jarurai hai 

router.route("/:id") 
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


// index route and ab compact ke vajah se coomemtn kiya isse 

// const listingController = require("../controllers/listing.js"); // upr likha bcz compact krne wajah se
// router.get ("/",wrapAsync(listingController.index)); -ye tha ab work  //( is ka likha ) gaya to controller= async(req,res)=>{
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs",{allListings});
// }


// new route

// router.get("/new",isLoggedIn,listingController.renderNewForm)   ;    //(req,res)=>{
 
  // if(!req.isAuthenticated()){                // is ko middleware banay diya 
  //   req.flash("error","you must be loged in");
  //   return res.redirect("/login");
  // }
  //  console.log(req.user);
  // niche ka ek line bas is route me active tha or sab commented
  // res.render("listings/new.ejs");    // ye bhi gaya to controller
// })

//create route and router.route laga is leye commented

// router.post("/",isLoggedIn,wrapAsync (listingController.createListing));

//edit route



router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

//update route

//router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))



//show route

// router.get("/:id",
//   wrapAsync(listingController.showListing))

//delete route

//router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));







// //review route 

// router.post("/:id/reviews", validateReview, wrapAsync ( async (req, res) => {
//   let listing = await Listing.findById(req.params.id);

//   let newReview = new Review(req.body.review);
//   await newReview.save();               // 🔥 pehle save

//   listing.reviews.push(newReview._id);  // 🔥 sirf ID push
//   await listing.save();

//   res.redirect(`/listings/${listing._id}`);
// }));


// router.delete(
//   "/:id/reviews/:reviewId",
//   wrapAsync(async (req, res) => {
//     let { id, reviewId } = req.params;

//     // listing se review id hatao
//     await Listing.findByIdAndUpdate(id, {
//       $pull: { reviews: reviewId }
//     });

//     // review collection se delete karo
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
//   })
// );

module.exports = router ;



// ---- theory of 2-d of auth and auth

// Authentication is the process of verifying who someone is 
// Authorization is the process of verifying what spefic application ,file, data a user can access to


// storing password = we never store the password as it is we store thier hashed form 
// password =hello  =>[hasing function = user password leta hai or unreadable form me bana deta hai] = > how it is stored "13kn324n434235n544bb6k4k4jcclr"
// login or sign  work kaise karta hai sign ke time jo password daala hota hai wo hashing function ban kr save hua hota hai isliye jab login karege tab password ka output  val same hona chciaye with db me store uss id se related password ka output se 

// hashing funct charactertic = 

// -for every input there is fixed output
// - they are one-way function we can't get input from output (modulus funct or absolute function |-5|=5 and  |5|=5  output se hum input nhi bata sakte hai  antother example 2%2 =0 6%2=0 8%2=0 batna nhi sakte 0 kis input se aaya hai )
// -for a different input there is a  different output but of same length 
// -for small change in input there is large change in output 

// AHA256 well know hashing function MD5 HAI, hasing any website  web site bhi visit kar ke dekh sakte hai 

//salting = password salting is a technique to protect password stored in db by adding a string of 32 or more character and then hashing 

// manlo password hai = hello  
// toh salt = %20@ hai 
// final password = hello%20@ or %20@hello or he%20@llo 

// salting daalne ke baad ab hashing function apply krege 
// passportig.org visi tkaro taki login karane from differnt differrnt field me help karega first npm install karo
// passport ke liye npm ke side pe bhi jao or jo bhi passpord like facebok ya local chiye wo install karo lo
//npm i passport
// npm i passport-local
// npm i passport-local-mongoose 

//alag stratgies hote hai like username and password se login karwana  ya phir sirf username se login karwana 
// local stratagies ko use krne se phale hume 

