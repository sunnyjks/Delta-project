const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

// QUICK FIX (same Node v24 me)

// require ke saath .default use kar:

const passportLocalMongoose = require("passport-local-mongoose").default; // password and username local mongoose automatically de dega // bhai local-mongoose ka jo naam start letter l m hna jaruri hai 

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
  
});

userSchema.plugin(passportLocalMongoose); // auto username hashing salting kar dega aaha 

module.exports = mongoose.model("user",userSchema);