
const initData =require('./data.js');

const Listing = require("../models/listing.js");


const mongoose = require("mongoose");

const MONGO_URL ='mongodb://127.0.0.1:27017/Wanderlust'
async function main() {
    await mongoose.connect(MONGO_URL);
    
}

main()

.then(()=>{
console.log('connected DB sucessfully')
})
.catch((err)=>{
    console.log(err);
});

const initDB = async () => {
  await Listing.deleteMany({});

  const dataWithOwner = initData.data.map(obj => ({  // ye krne ka reason tha ek ek kr ke owner sari obj me na ek kr ke dal na pade isliye map kiya 
    ...obj,
    owner: "6972e0857a968f0d7941a197"
  }));

  await Listing.insertMany(dataWithOwner);
  console.log("data was initialized");
};


initDB();