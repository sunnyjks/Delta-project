const express = require("express");
const router =express.Router();


// router ke pas bhi get post method hote hai isliye app hata diya 
//index -posts
router.get("/",(req,res)=>{    // "/posts sab me common tha isliye hata diya "
    res.send("get for post");
});

//show -posts
router.get("/:id",(req,res)=>{
    res.send("get for post");
});

//post - posts
router.post("/",()=>{
    res.send("post for post");
})

//delete -posts
router.delete("/:id",()=>{
    res.send("delete for post");
})


module.exports = router ;