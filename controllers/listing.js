const   Listing =require("../models/listing");

// index route
module.exports.index =async(req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});

}

// new route
module.exports.renderNewForm = (req,res)=>{
  res.render("listings/new.ejs");
}

//show route

module.exports.showListing = async(req,res)=>{
   
let {id}=req.params;
      const listing =await Listing.findById(id)
      .populate({
        path:"reviews",
        populate:{        // nested populate kr rahe hai hr ek review ke sath author aaye
        path:"author",
        },
})
        .populate("owner");
      if(!listing){                                                    // agar lisitng exist nhi karti to ye kari
        req.flash("error"," Lisitng you Req does not exist");
        return res.redirect("/listings");
      }
      console.log(listing);
      res.render("listings/show.ejs",{listing});
}


// create route

module.exports.createListing = async(req,res,next)=>{    // 3 parameter hoge
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //   throw new ExpressError (404,result.error)
    // }
    const newListing = new Listing(req.body.listing);
    
  // cloudinary save krne wal tarika
  let url =req.file.path;
  let filename = req.file.filename;
  // console.log(url,"..",filename);

    newListing.owner = req.user._id;  // ye owner de ga when add enw lisitng
    newListing.image = {url , filename};  //✔️ yahan newListing sahi hai
    await newListing.save();
    req.flash("success","New Listing Craeted");
     res.redirect("/listings");


}

// edit route

module.exports.renderEditForm =async (req,res)=>{
  let {id}=req.params;
      const listing =await Listing.findById(id);
       if(!listing){                                                    // agar lisitng exist nhi karti to ye kari
        req.flash("error"," Lisitng you Req does not exist");
        return res.redirect("/listings");
      }
      let originalImageUrl = listing.image.url ; // phale url nikale phir 
       originalImageUrl= originalImageUrl.replace("/upload" ,"/upload/h_300,w_250") // ye image on edit form ko blur krne ke liye kiya cloudinary ne ye diya function url me thoda chage kr bas 
      res.render("listings/edit.ejs",{listing, originalImageUrl});
}

// update route

module.exports.updateListing = async(req,res)=>{        // validatelisting kiya toh if hata diya 
//    if(!req.body.listing){
//    throw new ExpressError (404,"client mistake")
//  }
  let {id}=req.params;

  // middleware bana diya iska 

  // let listing = await Listing.findById(id);
  // if(! listing.owner._id.equals(res.locals.currUser._id)){
  //   req.flash("error","you don't have access to edit");
  //   return res.redirect(`/listings/${id}`); // rerutn krna jarur warn acrash hhtp header sent error menas i req ke liye 2 res bhej tune
  // }

  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
  
  if(typeof req.file !== "undefined"){  // typeof req.file ka type check krta hai define ya undefine hai ki nhi
 
  let url =req.file.path;
  let filename = req.file.filename;
  listing.image = {url , filename};  //update me hamesha listing (document)
  await listing.save();

  }
  
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
}


// Situation=>	Variable
// Create	=>newListing
// Update	=>listing
// Model	=>Listing ❌ (never update this)



//Delete route

module.exports.destroyListing = async(req,res)=>{
  let {id}=req.params;
let deletelisting =await Listing.findByIdAndDelete(id);
console.log(deletelisting);
req.flash("success", "Listing deleted")
res.redirect("/listings");

}



