const ip=require('../../public/Javascript/ipInfo').ip;

const router = require("express").Router();
const { Script } = require("vm");
const Resp = require("../models/resp");
const quiz = require("../models/quizBank");
const stud = require("../models/student");
const { set } = require('mongoose');

router.get("/attemptQuiz/",async(req,res)=>{
    try{
        res.render('index')
    }catch(err){
        console.log(err);
        res.send("Error!");
    }
});

router.post("/add", async (req, res) => {
    try {
        const resp=await(Resp.create(req.body));
        console.log(resp);
        // res.send(req.body);
        res.status(201).json(resp); 
    } catch (err) { 
        res.send("Error!");
        console.log(err);
        // res.status(500).json(err);
    }
});
 
router.get("/find/", async (req,res)=>{
    try{
        const resp=await(Resp.find({$and:[{"stud_id":req.query['ID']},{"ques_id":req.query['ques_id']}]}));
        res.status(201).json(resp);
    }catch(err){
        console.log(err);
    }
});

router.get("/findAll/", async (req,res)=>{
    try{
        const resp=await(Resp.find({$and:[{"stud_id":req.query['ID']},{"quiz_id":req.query['quizId']}]}));
        res.status(201).json(resp);
    }catch(err){
        console.log(err);
    }
});

router.put("/update/",async(req,res)=>{
    try{
        const resp=await(Resp.findOneAndUpdate({$and:[{"stud_id":req.query['ID']},{"ques_id":req.query['ques_id']}]},req.body));
        console.log(`Updated response of ${req.query['ID']} for question: ${req.query['ques_id']}`);
        res.send(resp);
    }catch(err){
        console.log(err);
    }
});

router.get("/success/", async (req,res)=>{
    const time=new Date();
    console.log(req.query['id']+" has completed the test @: "+time);
    res.render('success');
});

router.get("/reportData/", async (req,res)=>{
    const data=await(Resp.find({$and:[{"stud_id":req.query['ID']},{"quiz_id":req.query['quizId']}]}));
    const quizBank=await(quiz.find({"quizId":req.query['quizId']}).sort({_id:1}));
    try{
        let ans={
            correct:0,
            wrong:0,
            skipped:0,
            gainedPoints:0,
            totalPoints:0
        }
        
        for(let i=0;i<quizBank.length;i++)
        ans.totalPoints+=quizBank[i].points;
        let attemptDiffPattern=[];//take it as array of objects
        
        let obj=[];
        for(let i=0;i<data.length;i++)
        {
            let cRes=quizBank.filter(obj=>{
            return obj._id==data[i].ques_id;
            })[0];

            let fl=0;
            for(let j=0;j<data[i].time_stamps.length;j++)
            {
                let temp={
                id:data[i].ques_id.split('-')[1],
                // id:String(i),
                fin_time:data[i].time_stamps[j]/(1000*60)
                }
                //storing attempt pattern
                if(data[i].sel_opt_seq[j]!='' && fl==0)
                {
                attemptDiffPattern.push({
                    diff:cRes.difficulty,
                    time:data[i].time_stamps[j]
                });
                fl=1;
                }
                obj.push(temp);
            }

            //calculating correct answers
            let len=data[i].sel_opt_seq.length,selOps=data[i].sel_opt_seq[len-1],correct=0;
            let skipped_flag=1;
            for(let k=0;k<selOps.length;k++)
            {
                if(selOps[k]!='')
                skipped_flag=0;
                for(let l=0;l<cRes.correct.length;l++)
                {
                if(cRes.correct[l].toLowerCase()==selOps[k].toLowerCase())
                {
                    correct++;
                }
                }
            }
            if(correct==cRes.correct.length || (correct>=1 && cRes.type=='Fill in the blanks'))
            {
                ans.correct++;
                ans.gainedPoints+=cRes.points;
            }
            else if(skipped_flag==0)
                ans.wrong++;
            
        }
        ans.skipped=quizBank.length-ans.correct-ans.wrong;
        //storing expected attempt pattern
        let expDiffPattern={};
        for(let i=0;i<quizBank.length;i++)
        {
            expDiffPattern[i+1]=(quizBank[i].difficulty);
        }
        
        // sort objs according to ascending order of fin_time
        let finTimes = obj.sort(
            (o1, o2) => (o1.fin_time > o2.fin_time) ? 1 : (o1.fin_time < o2.fin_time) ? -1 : 0);
            
        attemptDiffPattern = attemptDiffPattern.sort(
            (o1, o2) => (o1.time > o2.time) ? 1 : (o1.time < o2.time) ? -1 : 0);
            
        let pattern={attemptDiffPattern,expDiffPattern};

        const attemptTopicConfidence= {};
        quizBank.forEach((obj1)=>{
            data.forEach((obj2)=>{
                if(obj1._id==obj2.ques_id)
                {
                    if(attemptTopicConfidence[obj1.topic]==null)
                    {
                        attemptTopicConfidence[obj1.topic]={
                            'total':(1/obj2.sel_opt_seq.length),
                            'count':1
                        }
                    }
                    else
                    {
                        attemptTopicConfidence[obj1.topic]={
                            'total':attemptTopicConfidence[obj1.topic]['total']+(1/obj2.sel_opt_seq.length),
                            'count':attemptTopicConfidence[obj1.topic]['count']+1
                        }

                    }
                }
                else if(attemptTopicConfidence[obj1.topic]==null)
                {
                    attemptTopicConfidence[obj1.topic]={
                        'total':0,
                        'count':0
                    };
                }
            })
        });
        Object.keys(attemptTopicConfidence).forEach((key)=>{
            let avg=(attemptTopicConfidence[key]['total']/attemptTopicConfidence[key]['count'])*100;
            delete attemptTopicConfidence[key]['total'];
            delete attemptTopicConfidence[key]['count'];
            attemptTopicConfidence[key]=avg;
        });
        res.send({
            'finTimes':finTimes,
            'ans':ans,
            'pattern':pattern,
            'confidence':attemptTopicConfidence});
    }
    catch(err){
        console.log(err);
    }

});
router.get("/report/", async (req,res)=>{
    const studId=req.query['ID'];
    const quizId=req.query['quizid'];
    res.render('report');
});

module.exports = router;