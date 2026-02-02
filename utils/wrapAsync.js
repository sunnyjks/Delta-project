// function wrapAsync (fn){
//     return function (req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }


// ------- ye above wala and niche wala custom wrapAync hai 
// create wale pr use kiya hai ye 
module.exports =(fn) => { 


    return function (req,res,next){
         
        fn(req,res,next).catch(next);
    }}           
   
    