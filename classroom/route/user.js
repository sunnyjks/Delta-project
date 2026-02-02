const express = require("express");
const router =express.Router();


// router ke pas bhi get post method hote hai isliye app hata diya 
//index -user
router.get("/",(req,res)=>{    // "/user sab ek common tha isliye hata diya "
    res.send("get for user");
});

//show -user
router.get("/:id",(req,res)=>{    // "/user sab ek common tha isliye hata diya "
    res.send("get for user id");
});

//post - user
router.post("/",()=>{              // "/user sab ek common tha isliye hata diya "
    res.send("post for user");
})

//delete -user
router.delete("/:id",()=>{      // "/user sab ek common tha isliye hata diya "
    res.send("delete for user");
})

module.exports = router ;