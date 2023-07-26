const ip=require('../../public/Javascript/ipInfo').ip;

const router = require("express").Router();
const Quiz = require("../models/quizBank");

const path=require('path');

router.get("/home",(req,res)=>{
    res.render('st_home');
});

// router.get("/findQuizes/:class",(req,res)=>{
//     let data=req.params.class;

// });

router.post("/",(req,res)=>{
    const data=req.body;
    if(data['id']=='admin' && data['pass']=='admin')
    {
        const datetime=new Date()
        console.log("Admin logged in at "+ datetime);
        res.redirect("/api/quizbank/addQues/?quizid="+data['quizid']);
    }
    else
        res.send(`<script>
            alert("Invalid credentials!");
            window.location="/api/resp/adminlogin/";
            </script>
        `);
});

router.get("/addQues/",(req,res)=>{
    res.render('newQuiz');
});

router.get("/editQuiz/:id",(req,res)=>{
    res.render('editQuiz');
});

router.get("/getQuestions/",async(req,res)=>{
    const quizes = await (Quiz.find({"quizId":req.query['quizid']}).sort({_id:1}));
    res.json(quizes);
});

router.post("/post/", async (req, res) => {
    try {
        const data=req.body;
        let id=req.query['quizid'];
        const index=Object.keys(data);
        let j=0,i=0;
        while(true)
        {
            const quizes = await Quiz.find({_id:id+'-'+i});
            if(typeof(quizes[0])==='undefined')
                break;
            else
                i++;
        }
        while(true)
        {
            let obj={
                _id:id+'-'+i++,
                "quizId":id,
                "type":String,
                "topic":String,
                "tTime":Number,
                "difficulty":String,
                "question":String,
                "options":Array,
                "correct":Array,
                "points":Number
            }
            if(index[j])
            {
                while(index[j])
                {
                    let title=index[j].split('-')[1];
                    obj[title]=data[index[j]];
                    console.log(title,"-",data[index[j++]]);
                    if(!index[j] || index[j].split('-')[1]=='type')
                    {
                        console.log("Itteration 1:");
                        console.log(obj);
                        try {
                                const quiz = await Quiz.create(obj);
                                // res.status(201).json(quiz); 
                              } catch (err) { 
                                // res.status(500).json(err.message);
                                console.log(err);
                              }
                        break;
                    }
                }
                console.log("----------------------------------------------");
            }
            else
                break;
        }
        res.render('success2');
    } catch (err) { 
        // res.status(500).json(err);
        console.log(err);
    }
});

router.get("/msg/",(req,res)=>{
    let id=req.query['quizid'];
    res.send(`
    <style>
    *{
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }
    body{
        overflow: scroll;
    }
    section{
        box-sizing: border-box;
        border-radius: 10px;
        height: 550px;
        width: 800px;
        background-color: #93f4ffea;
        position: fixed;
        left: calc( 50% - 400px);
        top: calc( 50% - 275px);
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.317);
        padding: 50px;
    }
    #msg{
        height: 400px;
        width:700px;
        border-radius: 10px;
        border: none;
        padding: 20px;
        box-sizing: border-box;
        text-align: justify;
        font-size: .45cm;
        overflow: scroll;
    }
    #copy{
        font-weight: 900;
        position: relative;
        left: 85.5%;
        height: 40px;
        border-radius: 3px;
        border: none;
        margin-top: 30px;
        background: #01ADD5;
    }
    #copy:hover{
        background: #01c3ef;
        cursor: pointer;
    }
    #msg:focus,#copy:focus{
        outline: none;
    }
    ::-webkit-scrollbar{
        height: 0;
        width: 8px;
    }
    ::-webkit-scrollbar-track{
        background: rgba(128, 128, 128, 0.297);
        border-radius: 5px;
    }
    ::-webkit-scrollbar-thumb{
        background: #02a7cd;
        border-radius: 5px;
    }
    textarea{
        resize: none;
    }
    #qr-code{
        position: relative;
        left: 40%;
        top: 100vh;
    }
    </style>
    <section>
        <textarea id="msg">Dear students,\nA new quiz has been posted on the Quizmo platform developed by our college students.\nYou can attempt the quiz by visiting the following link:\nhttp://${ip}:3000/api/main/\nMake sure you are connected to the college wifi.</textarea>
        <button id="copy" type="button" onclick="copyFunction()">Select Message</button>
    </section>
    <div id="qr-code"></div>
    <script src=
        "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js">
    </script>
    <script>
    function copyFunction() {
        // Get the text field
        var copyText = document.getElementById("msg");
    
        // Select the text field
        copyText.select();
    }
    var qrcode = new QRCode("qr-code", {
        text: "http://${ip}:3000/api/main/",
        width: 256,
        height: 256,
        colorDark : "#01ADD5",
        colorLight : "#ddfafc",
        correctLevel : QRCode.CorrectLevel.H
       });
    </script>
    `);
});
  
module.exports = router;