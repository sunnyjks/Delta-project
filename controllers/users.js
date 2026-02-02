
const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("user/signup.ejs")
}


module.exports.signup = async(req,res,next)=>{  // try catch na dale toh user phale se reister hoga to alert msg toh flsh hoga but blank page hum aa jayege aisa na ho bas sign up wale page pr he flash de ya aaye try catch use kiya 
    try{
        let {username ,email , password} = req.body;
    const newUser = new User ({email,username});
    const registeredUser =await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next (err);
        }
      req.flash("success","user was register successfully");
    return res.redirect("/listings");

    })  // ye ek method hota hai passport ke log in me 
   

    }
    catch(e){

req.flash("error",e.message)
 return res.redirect("/signup");

    }

}







// module.exports.signup = async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;
//     const newUser = new User({ email, username });

//     const registeredUser = await User.register(newUser, password);

//     // Log in manually
//     req.login(registeredUser, (err) => {
//       if (err) return next(err); // stops execution
//       req.flash("success", "User registered successfully");
//       return res.redirect("/listings"); // only one response
//     });

//   } catch (e) {
//     req.flash("error", e.message);
//     return res.redirect("/signup"); // only one response
//   }
// };


module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs");
}


module.exports.login = async(req,res)=>{  
    // console.log("LOGGED IN USER:", req.user); 
    req.flash("success","welcome to your account");
    return res.redirect(res.locals.redirectUrl || "/listings"); //req.originalUrl ye passport reset karwa seta hai isliye hum local me save kar rahe hai taki local to nhi ho redet 
                                                     // || "/lisitng is liye dala kyu ki jab hum login khali kare means without add lisitn gpage oe gaye ore sab koi page pe bena gaye login kare toh /listing pr jaye "                                                                   // passport.authenticate()  check karega passprt sahi ha ki nhi middleware hai ye 


}

module.exports.logout = (req,res,next)=>{
  req.logout((err)=>{
     if(err){
       return next(err);
     }
     req.flash("success","you are loged out");
     res.redirect("/login");
  })
    
}