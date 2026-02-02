const cloudinary = require('cloudinary').v2;  // npm i cloudinary 
const {CloudinaryStorage } = require('multer-storage-cloudinary') // npm i multer-storage-cloudinary kiya  bcz mulrer ko cloudinary ke sath use krne ke liye isse install kiya

cloudinary.config({   // config kr liya
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});  

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'Wanderlust_DEV',   // cloudinary pr ye rahega folder ka nam
        allowed_formats: ["png","jpg","jpeg"]  ,
        
    }
});


module.exports ={
    cloudinary,
    storage,
}