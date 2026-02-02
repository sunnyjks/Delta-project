// enviromental varaiable ek credential store file [.env ] hota hai .env file ko load krne ke liye ek 3party package lagat hai npm i doltenv ye .env ko ->proccess.env
//  require('dotenv').config();
// console.log(process.env);   // terminal me ye bahut sare kuch print karwa dega hum toh sirf secret chahiye
// console.log(process.env.SECRET); 


// condition laga sakte hai upr wale me  kyu ki develop phase dikhe cred.. but production [jab deploy ho] tab na dikhge 
if (process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
// console.log(process.env.SECRET); 


//mongo altas  link = mongodb+srv://delta-student:<db_password>@cluster0.iu3lfvd.mongodb.net/?appName=Cluster0
//mongodb+srv://delta-student:Sunny@123@cluster0.iu3lfvd.mongodb.net/?appName=Cluster0  



//basic setup
// sab ko wrapAsync kiya error handlinng ke liye 
const express = require("express");
const app = express();
// const wrapAsync =require("./utils/wrapAsync.js"); ye gaya
// const ExpressError =require("./utils/ExpressError.js"); ye gya
// const {listingSchema} =require("./schema.js");  ye gaya
//    // joi concept 

const Review =require("./models/review.js")

const ejsmate = require("ejs-mate"); // boiler plate concept hum app.js bas intna likhe  // 
app.engine("ejs",ejsmate); // <body> tag ke bhr cheez likhne ki jarurat nhi deta ek jagah banao and use other place same temaplate


const methodOverride = require("method-override"); 
const { nextTick } = require("process");
app.use(methodOverride("_method"));

//session
const session = require("express-session");

// npm i connect-mongo package install karo taki session ab ache se store for more scaleable or express session ke niche he karo
const MongoStore =require('connect-mongo');

// npm i connect-flash install kiya phir  require
const flash = require("connect-flash");


const passport = require("passport");
const  LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const ExpressError =require("./utils/ExpressError.js"); //ye gya


const path =require("path");
// static file serve krne ke liye like public css ka file use krne ke liye
app.use(express.static(path.join(__dirname,"/public")));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

const { isLoggedIn } = require("./middleware.js"); // adjust path if needed

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");






// app.use("/listings", listings);
// app.use("/listings/:id/reviews", reviews); 
// // merge pareams kiya in review ab id jayega idhar se 



// const mongoose = require("mongoose");

// const MONGO_URL ='mongodb://127.0.0.1:27017/Wanderlust'
// async function main() {
//     await mongoose.connect(MONGO_URL);
    
// }

// main()

// .then(()=>{
// console.log('connected DB sucessfully')
// })
//       .catch((err)=>{
//     console.log(err);
// })


//--- after altas connection aise bana 

const mongoose = require("mongoose");

// const MONGO_URL ='mongodb://127.0.0.1:27017/Wanderlust'
const dburl =process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dburl);
    // console.log("DB URL =", process.env.ATLASDB_URL);

    
}

main()

.then(()=>{
console.log('connected DB sucessfully')
})
      .catch((err)=>{
    console.log(err);
})

// basic setup end here


// mongostore  means ab session ka store hogi altas me 

// const store = MongoStore.create({
//   mongourl:dburl,
//   crypto:{
//     secret:"musupersecretcode"  
//   },
//   touchAfter:24*3600, // web page like facebook reload br br ho toh session bhi br br update na ho isliye kiya 
// })


const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,   // 🔥 mandatory
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});



store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE");
})

// session ke bare me 
const sessionOptions ={
  store,
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24* 60 * 60 * 1000,  // aaj se 7 din ka expriring date diya 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};






// session use krne ke liye
app.use(session(sessionOptions));

//flash 
app.use(flash())  // rember router se phale likhna ise 






// passport flsh session ke just baad aayega   and npm se liya ye sab 
app.use(passport.initialize());  // middleware that initialized passport 
app.use(passport.session()); // ek session me user ko br br login na karna pade 
passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser()); // seriali.. means ek br login kiya in a session toh br br login nhi karna padega 
// passport.deserializeUser(User.deserializeUser());  // deser .. means session ek br khatam kiya toh deserila.. krna padega 

  passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// cookie ka kam hota hai 1 session ko track krna cookie ki expire date nhi hoti
// brower ban hone pr he cookie delete hoti hai pr expire date 

// basic home route 
// app.get("/", (req, res) => {
//   res.send("hi kaisa hai bhai");
// });

// local ko define kr ke liye middleware humne define kiya hai 
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // console.log(success);
  next();
});


// app.get("/demouser",async(req,res)=>{
// let fakeUser = new User({
//   email:"student@gmail.com",
//   username:"delta-student"
// })

//  let registerUser = await User.register(fakeUser,"helloworld"); // register ek method hai jo pass kiya hai iss me hum oassword or kuch sab bhi pass kar saktge hai 
// // register method automatic check kar lega username unique hai ya nhi 
// // console.log(registerUser);
// res.send(registerUser);
// })


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);
// merge pareams kiya in review ab id jayega idhar se



// centralized error handler
app.use((err, req, res, next) => {
  console.error("Error handler caught:", err);
  if (res.headersSent) {
    console.warn("Headers already sent for", req.originalUrl);
    return next(err);
  }
  res.status(err.status || 500).render("error", { err });
});

app.listen(8080, () => {
  console.log("server is working");
});














// const Listing =require('./models/listing.js') ye gaya // require kiya model folder se Listing

// app.get(('/testlisting'),async (req,res)=>{
//   let sampleListing =new Listing ({
//     title:'my new villa',
//     description: 'buy the beaches',
//     price:1200,
//     location:'goa',
//     country : 'india'
//   })

//   await sampleListing.save();
//  console.log('sample was saved')
//   res.send('successfull');

// });


// working haia upr likha 

// const path =require("path");
// // static file serve krne ke liye like public css ka file use krne ke liye
// app.use(express.static(path.join(__dirname,"/public")));

// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"));
// app.use(express.urlencoded({extended:true}));

// ----




// const validateListing =(req,res,next)=>{
   
//     let {error} = listingSchema.validate(req.body);
//     // console.log(result);
//     if(error){
//       let errmsg =error.details.map((el)=>el.message).join(",");
//       // throw new ExpressError (404,result.error);
//       throw new ExpressError (404,errmsg);
//     }else{  
//       next(); 
//     }

// }












// index route=working

// app.get ("/listings",wrapAsync(async(req,res)=>{
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs",{allListings});
// }));


// // new route=working

// app.get("/listings/new",(req,res)=>{
//   res.render("listings/new.ejs");
// })


// create route

// app.post("/listings",async(req,res)=>{
//   // let {title,description,image,price,country,location}= req.body;
// //  let listing =req.body.listing;
//    const newListing = new Listing(req.body.listing);
//    await newListing.save();
//    res.redirect("/listings");
// //  console.log(listing);

// })
// --------------------------------
// create route with error handler try catch 

// app.post("/listings",async(req,res,next)=>{    // 3 parameter hoge
// try{
//          const newListing = new Listing(req.body.listing);
//    await newListing.save();
//    res.redirect("/listings");
// //  console.log(listing);

// }
// catch(err){
//         next(err);
// }
// });

// -----------------------------
// create route with error handler wrapasync
// remember hum ne edit wla pag ejs me type =price hata diya hai or wo he err hum custom bhej rahe hai  = ye sab error handler sikhne ke liye 



// ------- schcemA Validation kisting khali tab toh err mistake jka msg jayega pr mann lo kuch info diya kuchnhi tab err kaise throw karuge
// ek tarika hai aise 


// app.post("/listings",wrapAsync (async(req,res,next)=>{    // 3 parameter hoge
//  if(!req.body.listing){
//    throw new ExpressError (404,"client mistake all detail not filled")  // client form me naam nhi diya toh 
//  }
//     const newListing = new Listing(req.body.listing);
//             // is ke niche above jaise bana do sab ke liye  & yaad rakh tune phale he client side validation kr diya toh abhi niche ka sab practical hootscopt kr 

//  if(!req.body.listing.title){
//    throw new ExpressError (404,"title nhi bhra")  
//  }

//   if(!req.body.listing.description){
//    throw new ExpressError (404,"description nhi bhra")  
//  }

//  if(!req.body.listing.location){
//    throw new ExpressError (404,"location nhi bhra")  
//  }

//   if(!req.body.listing.country){
//    throw new ExpressError (404,"title nhi bhra")  
//  }

//   if(!req.body.listing.price){
//    throw new ExpressError (404,"price nhi bhra")  
//  }
// // ye above if use krna ek tds task or heavy work ho jata hai isliye ek tool(joi) use karege to avoid above br br if lagna
// // phale joi npm package install kro phir require kro joi ek schema banata hai not like or for mongoose it is like schema for server side form validation


//    await newListing.save();
//    res.redirect("/listings");


// }
// ));


// ------- joi se bana diya if hata ne tarika  =working


// app.post("/listings",wrapAsync (async(req,res,next)=>{    // 3 parameter hoge
//     let result = listingSchema.validate(req.body);
//     console.log(result);
//     if(result.error){
//       throw new ExpressError (404,result.error)
//     }
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//      res.redirect("/listings");


// }
// ));

// ----=working--------- schema validation ko middleware me covert kiya tab above wale post ka kuch part hata diya or upr const validtiolisting kr ke kuch banya hai uss se is ka relation hai 

// app.post("/listings",validateListing,wrapAsync (async(req,res,next)=>{    // 3 parameter hoge
//     // let result = listingSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error){
//     //   throw new ExpressError (404,result.error)
//     // }
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//      res.redirect("/listings");


// }
// ));


//edit route

// == working 3 niche line 

// const methodOverride = require("method-override");
// const { nextTick } = require("process");
// app.use(methodOverride("_method"));

// app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
//   let {id}=req.params;
//       const listing =await Listing.findById(id);
//       res.render("listings/edit.ejs",{listing});
// }))

//update route

// app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{        // validatelisting kiya toh if hata diya 
// //    if(!req.body.listing){
// //    throw new ExpressError (404,"client mistake")
// //  }
//   let {id}=req.params;
//   await Listing.findByIdAndUpdate(id,{...req.body.listing});
//   res.redirect(`/listings/${id}`);
// }))



//show route

// app.get("/listings/:id",wrapAsync(async(req,res)=>{
   
// let {id}=req.params;
//       const listing =await Listing.findById(id).populate("reviews");
//       res.render("listings/show.ejs",{listing});
// }))

// //delete route

// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//   let {id}=req.params;
// let deletelisting =await Listing.findByIdAndDelete(id);
// console.log(deletelisting);
// res.redirect("/listings");

// }));


// review wala route
// const Review =require("./models/review.js")

// = working niveh wala const line 
//  const {reviewSchema} =require("./schema.js")  // nedd hai jaise listingschema me upr kiya hai waise he aaha bhi 

// const validateReview =(req,res,next)=>{         = workinh tha
   
//     let {error} =   reviewSchema.validate(req.body);
//     // console.log(result);
//     if(error){
//       let errmsg =error.details.map((el)=>el.message).join(",");
//       // throw new ExpressError (404,result.error);
//       throw new ExpressError (404,errmsg);
//     }else{  
//       next(); 
//     }

// }

// shadda wala post 

// app.post("/listings/:id/reviews", validateReview, wrapAsync (async (req,res)=>{
         
//  let listing  = await Listing.findById(req.params.id);
//  let newReview =new Review(req.body.review)


// console.log(listing);

//  listing.reviews.push(newReview);

//  await newReview.save();
//  await listing.save();

//  console.log("new review saved");
//  res.send("new review saved")



// }))


// chatgpt post wala  =working

// app.post("/listings/:id/reviews", validateReview, wrapAsync ( async (req, res) => {
//   let listing = await Listing.findById(req.params.id);

//   let newReview = new Review(req.body.review);
//   await newReview.save();               // 🔥 pehle save

//   listing.reviews.push(newReview._id);  // 🔥 sirf ID push
//   await listing.save();

//   res.redirect(`/listings/${listing._id}`);
// }));



// button to delte review =working


// app.delete(
//   "/listings/:id/reviews/:reviewId",
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





// agr kis galat route pe req gaya toh 
//ye niche wala upr se check karte hue niche aayega agr route nhi mila 
// toh ye niche wala msg app.all error custom bana ke bhej dega

app.use((req,res,next)=>{   // shraddna ne yaha app.all or("*",(re..)) aisa sab likha tha but express new version jaisa maine likha hai waise leta hai 
  next(new ExpressError(404,"page not found")) // niche wala middleware ye catch karega
})



// error handler middleware

// app.use((err,req,res,next)=>{       // 4 para dena middlewate handle karne ke liye 
//   res.send("something went wrong");
// })                      

// upr wala comment kiya kkyu ab hum expresserror use karege somethinnd went wrong alwa or bhi msg bheje 

app.use((err,req,res,next)=>{       // 4 para dena middlewate handle karne ke liye 
 
 let{statusCode= 500,message= "something wrong"}= err;
//  res.status(statusCode).send(message);
res.status(statusCode).render("error.ejs",{err});
 
  // res.send("something went wrong");
}) 



