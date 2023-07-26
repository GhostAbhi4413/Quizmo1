const router = require("express").Router();
const { Script } = require("vm");
const teach = require("../models/teacher");
const Class = require("../models/class");
const quiz = require("../models/quizes");

//landing
router.get("/dashboard/:username",(req,res)=>{
    res.render('teachDash')
});

//register
router.get("/register",(req,res)=>{
    res.render('teacherReg');
});

router.post("/register",async(req,res)=>{
    const body=req.body;
    try{
        const data=await(Class.find({"_id":body.class_id}));
        const flag=await(teach.findOne({_id:body._id}));
        if(data.length!=0)
        {
            res.send(`
        <script>
            alert("Registration failed! The class name already exists");
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
            const Teach=await(teach.create({
                "_id":body._id,
                "name":body.name,
                "pass":body.pass,
                "class_id":body.class_id,
                "email":body.email
            }));
            const Classs=await(Class.create({
                "_id":body.class_id,
                "teacher_id":body._id,
                "key":body.key
            }));
            res.send(`
                    <script>
                    alert("Registered Successfully");
                    window.location.href="/api/main/"
                    </script>
                `);
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
        const data=await(teach.findOne({"_id":user}));
        res.status(201).json(data); 
    }catch(err){
        console.log(err);
        res.send("Error!");
    }

});

//new quiz
router.post("/newQuiz/",async(req,res)=>{
    const body=req.body;
    try{
        const data=await(quiz.create(body));
        res.redirect("/api/quizBank/addQues/?quizid="+data._id)
    }catch(err){
        console.log(err);
        res.send("Error!");
    }
});


//quiz data
router.get("/getQuizes/",async(req,res)=>{
    const classId=req.query.class_id;
    try{
        const data=await(quiz.find({"class_id":classId}));
        res.status(201).json(data); 
    }catch(err){
        console.log(err);
        res.send("Error!");
    }
});

module.exports = router;