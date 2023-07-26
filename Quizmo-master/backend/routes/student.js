const router = require("express").Router();
const { Script } = require("vm");
const stud = require("../models/student");
const Class = require("../models/class");
const quiz = require("../models/quizes");
const Resp = require("../models/resp");

//landing
router.get("/dashboard/:username",(req,res)=>{
    res.render('studDash')
});

//register
router.get("/register",(req,res)=>{
    res.render('studRegister');
});

router.post("/register",async(req,res)=>{
    const body=req.body;
    try{
        const data=await(Class.find({$and:[{"class":body.class_id},{"key":body.key}]}));
        const flag=await(stud.findOne({_id:body._id}));
        if(data.length==0)
        {
            res.send(`
        <script>
            alert("Registration failed! Invalid class name or enrollment key.");
            window.history.back();
        </script>
        `)
    }
    else if(flag!=null)
    {
            res.send(`
        <script>
            alert("Registration failed! Username already exists.");
            window.history.back();
        </script>
        `)

        }
        else
        {
            const Stud=await(stud.create({
                "_id":body._id,
                "name":body.name,
                "pass":body.pass,
                "class_id":body.class_id,
                "email":body.email,
                "attemptedTests":[]
            }));
            res.send(`
                    <script>
                    alert("Registered Successfully");
                    window.location.href="/api/main/"
                    </script>
                `);
            // res.status(201).json(Stud); 
        }
    }catch(err){
        console.log(err)
        res.send("Error!")
    }
});

//profile data
router.get("/getProfileData/:username",async(req,res)=>{
    const user=req.params.username;
    try{
        var data=await(stud.findOne({"_id":user}));
        data=data.toJSON();
        delete(data['pass']);
        // res.status(201).json(data); 
        res.send(data);
    }catch(err){
        console.log(err);
        res.send("Error!");
    }

});

//quiz data
router.post("/getQuizes/",async(req,res)=>{
    const studId=req.body.studId;
    const classId=req.body.classId;
    try{
        const Quizes=await quiz.find({"class_id":classId});
        for(let i=0;i<Quizes.length;i++)
        {
            const resp=await Resp.findOne({$and:[{"stud_id":studId},{"quiz_id":Quizes[i]._id}]});
            if(resp==null)
            {
                Quizes[i]=Quizes[i].toJSON();
                Quizes[i]['status']=0
            }
            else
            {
                Quizes[i]=Quizes[i].toJSON()
                Quizes[i]['status']=1;
            }

        }
        res.status(201).json({"data":Quizes}); 
    }catch(err){
        console.log(err);
        res.send("Error!");
    }
});

//success
router.get("/success/", async (req,res)=>{
    const time=new Date();
    try{
        console.log(req.query['id']+" has completed the test @: "+time);
        res.render('success');

    }catch(err){
        console.log(err);
        res.send("Error!");
    }
});



module.exports = router;