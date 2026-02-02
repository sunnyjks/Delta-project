const mongoose = require("mongoose");

const Schema = mongoose.Schema; // br br mon..schema na likhna padhe bas schema likhna padhe


const reviewSchema =new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"user" 
    }
})

module.exports =mongoose.model("Review",reviewSchema); // Reivew nam ka model hai 