const mongoose = require("mongoose");

const Schema = mongoose.Schema; // br br mon..schema na likhna padhe bas schema likhna padhe

const Review=require("./review.js")
// ; listing delete ho toh review bhi uss listing ka delete ho isliye require kiya

const listingSchema =new Schema({
    title:{
        type:String,
        // required:true,
    },
    description : String,
    // image:{
    //     type:String,
    //     default: "https://shorturl.at/qtnoB",
    //      // image set concept nhi padhaya in mongo schema idhar bata 
    // },

image: {
 url:String,
 filename:String,
},

    price:{
      type:Number,
      default:0,
    },

    location:String,
    country: String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review"
      },
    ],
    owner:{

   type:Schema.Types.ObjectId,
   ref:"user",


    }
    // category:{
    //   type:String,
    //   enum:["mountain",""]
    // }

});


// listingSchema.post("findOneAndDelete",async(listing)=>{
//   if(listing){
//       await Review.deleteMany({_id:{review:{$in:listing.review}}});
//   }
 
// })


listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});


const  Listing =mongoose.model('Listing',listingSchema)
module.exports =Listing;

