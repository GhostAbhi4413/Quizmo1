const router = require("express").Router();
const { Script } = require("vm");
const stud = require("../models/student");
const teach = require("../models/teacher");

//landing
router.get("/",(req,res)=>{
    res.render('commonLogin')
});

//login
router.post("/login",async(req,res)=>{
    try{
        const body=req.body
        if(body.decision=='student')
        {
            let data=await(stud.find({$and:[{"_id":body.id},{"pass":body.pass}]}));
            if(data.length!=0)
            {
                res.redirect("/api/student/dashboard/"+body.id)
            }
            else
                res.send("Invalid credentials!")
        }
        else
        {
            let data=await teach.findOne({$and:[{"_id":body.id},{"pass":body.pass}]});
            if(data==null)
            {
                res.send("Invalid credentials!");
            }
            else
                res.redirect("/api/teacher/dashboard/"+body.id)
        }
        }catch(err){
            res.send("Error!");
            console.log(err);
        }
});

//register
router.get("/register",async(req,res)=>{
    res.render('commonRegister')
});

router.post("/register",async(req,res)=>{
    const body=req.body;
    if(body.decision=='student')
    {
        res.redirect("/api/student/register")
    }
    else
    {
        res.redirect("/api/teacher/register")
    }
});

module.exports = router;