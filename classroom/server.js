
// const express = require("express");
// const app = express();
// const users =require("./route/user.js");
// const posts =require("./route/post.js");

// const cookieParser =require("cookie-parser"); // iss se use krne ke liye 


// // k ye hota tempering se bhajna ka tarika ("secretcode likh dena bas")
// app.use(cookieParser("secretcode")); // ye likha use krne ke liye 




// app.use("/users",users); // /users means jitne bhi route ke /user aati hai un ke sab ko user file me maping karna hai 
// app.use("/posts",posts); // same as above line


// // tempering na kr paye isliye signed cookie bhejna 

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in", "india",{signed:true}); //ek ye hota tempering se bhajna ka tarika
//     res.send("signed cookie sent");
// })


// app.get("/verify", (req, res) => {
//     console.log(req.cookies); // terminal me unsigned cookies acces ya print karwayega krne ka tarika
//     console.log(req.signedCookies) ; // terminal me signed cookies acces krne ka tarika
//     res.send("verified");   // agar signed cookie ka value change kiya toh terminal me dikhega when webpage refresh kroge tab jaise madi-in india tha hata ke china likh diya toh ab terminal empty cookie dikhega ya false  [Object: null prototype] {}
// });


// // ----- cookies 
// // it is a small  block of data send by server to user brower it of differnet type session cookies ( like addd cart kiya e ke electronic item phir dusre page pe gaya clothe item add kiya toh ye yadd rakhna add card me kaam session cookies karte hai study more on wikipedia of web cookies )

// app.get ("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");  // cookie ka name and value bhsakte jai 
//     res.cookie("madeby", "sunny");  //hum multiple cookies bhi bhej sakte hai 
//     res.send ("sent cookies")
// })

// app.get("/greet",(req,res)=>{   // phale se hum manualy name aman add kiye hai in cookies application me so when we hit /greet 
//     let {name="anaonymous"} =req.cookies;
//     res.send(`hi, ${name}`)
// })


// app.get("/",(req,res)=>{
//     console.dir(req.cookies); // ye terminal pr undefined dega we need cooies parser let install npm i cookie-parser uske baad require kro phir middleuse kro
//     res.send ("hi i am root");  // ab "/" iss route pr /getccookie wala greet hello madeby : sunny  dikhega
// })

// ------------------------------ user route user.js me gaye
// ------------------------ posts route sab post.js me gaye
// app.listen(3000,()=>{
//     console.log("server is listing");
// })


// ------- express session pr new concept 
// npm i express-session krna first phir require krna for moree visit express session webpage




// const express = require("express");
// const app = express();
// const users =require("./route/user.js");
// const posts =require("./route/post.js");

// const session =require("express-session");


// // 2 tarika hai likha ka isse

// // a)
// const sessionOptions ={
//      secret: "mysupersecretstring",
//     resave:false,                     // ye likne se de[rocated warnign terminal nhi aayegi
//     saveUninitialized:true
// }
// app.use(session(sessionOptions));

// // b)
// // app.use(session({
// //     secret: "mysupersecretstring",
// //     resave:false,                     // ye likne se de[rocated warnign terminal nhi aayegi
// //     saveUninitialized:true
// // }
// // )
// // );        // resave = unmodify session bhi save ho // saveunintialize = initialize nhi hua session bhi save ho


// app.get("/test",(req,res)=>{
//     res.send("test successful");
// })

// // dev ke andhar hum ye store use kr sakte hai but production i.e cleint activity store ke liye differnt memory enviroment hai session apche as etc eg 
// // in stateless req and res sesion count same hoti hai but statefull me res ke time kuch hai jis vajah se req and res same nhi hoti hai 

// // basic eg tha ye 
// // app.get("/reqcount",(req,res)=>{
// //     if(req.session.count){
// //         req.session.count++;    // ye store ho rahi hai temparoey

// //     }else{
// //         req.session.count =1;  
// //     }
// //     res.send(`you sent a request ${req.session.count} times`);   //${req.session.count} ye res hai count de raha hai 
// // })


// app.get("/register",(req,res)=>{
//     let {name="kuchbhi"}=req.query;
//     // console.log(req.session)
//     req.session.name = name ;  // accessing here
//     res.redirect("/hello");
//     // console.log(req.session.name) 
// })

// // ipr wale se niche wla session track ho raha hi hum 1 session track kr pa rahe hai plus 2 diffe route se same res le pa rahe hai 
// app.get("/hello",(req,res)=>{
// res.send(`hello ${req.session.name}`)  // using  here store info 
// })


// app.listen(3000,()=>{
//     console.log("server is listing");
// })


// session allow to use info of one page  to another page 
// --------------------------------------


// connect-flash = the flash is a special area of the session used for storing message msg are written to flash and cleared after being  displayed to the user
//phale npm se install kro npm i connect-flash



const express = require("express");
const app = express();
const users =require("./route/user.js");
const posts =require("./route/post.js");

const session =require("express-session");
const flash = require("connect-flash");
const path = require("path");
// view ko use krne pr he req.flash kaam krega 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// 2 tarika hai likha ka isse

// a)
const sessionOptions ={
     secret: "mysupersecretstring",
    resave:false,                     // ye likne se de[rocated warnign terminal nhi aayegi
    saveUninitialized:true
}
app.use(session(sessionOptions));


// flash use krne ka tarika
app.use(flash());

//app.use kr ke hum bulk hone se bacha sakte hai 
app.get((req,res,next)=>{
     res.locals.message = req.flash("success");  // aise bhi likh sakte hai in below line {name: req.session.name,msg:req.flash("success")})  , req.local save krne ke liye use krte hai 
     res.locals.error = req.flash("error");
     next();
})


// b)
// app.use(session({
//     secret: "mysupersecretstring",
//     resave:false,                     // ye likne se de[rocated warnign terminal nhi aayegi
//     saveUninitialized:true
// }
// )
// );        // resave = unmodify session bhi save ho // saveunintialize = initialize nhi hua session bhi save ho


// app.get("/test",(req,res)=>{
//     res.send("test successful");
// })

// dev ke andhar hum ye store use kr sakte hai but production i.e cleint activity store ke liye differnt memory enviroment hai session apche as etc eg 
// in stateless req and res sesion count same hoti hai but statefull me res ke time kuch hai jis vajah se req and res same nhi hoti hai 

// basic eg tha ye 
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;    // ye store ho rahi hai temparoey

//     }else{
//         req.session.count =1;  
//     }
//     res.send(`you sent a request ${req.session.count} times`);   //${req.session.count} ye res hai count de raha hai 
// })


app.get("/register",(req,res)=>{
    let {name="kuchbhi"}=req.query;
    // console.log(req.session)
    req.session.name = name ;  // accessing here
    
    if(name === "kuchbhi"){
     req.flash("error","some error has occured");
    }else{
        req.flash("success", "user register successfully");
    }
    res.redirect("/hello");
    // console.log(req.session.name) 
})

// ye use kro ya phir upr middle  ware diya wo kro
// ipr wale se niche wla session track ho raha hi hum 1 session track kr pa rahe hai plus 2 diffe route se same res le pa rahe hai 
app.get("/hello",(req,res)=>{
    // res.send(`hello ${req.session.name}`)  // using  here store info 
    res.locals.message = req.flash("success");  // aise bhi likh sakte hai in below line {name: req.session.name,msg:req.flash("success")})  , req.local save krne ke liye use krte hai 
     res.locals.error = req.flash("error");
    res.render("page.ejs",{name: req.session.name,msg:req.flash("success")});  //hum key use kr ke value pass kr rahe hai 
})


app.listen(3000,()=>{
    console.log("server is listing");
})
