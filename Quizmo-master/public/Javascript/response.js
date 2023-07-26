const params=new URLSearchParams(window.location.search);
var IDs=[];
for(value of params.values())
    IDs.push(value);
const quizId=IDs[1];

var maxQues=1;
var START=Date.now();
function noOFques(n)
{
    maxQues=n;
}

var Data;

const getMax=async()=>{
    // const data=await(await fetch("http://localhost:5000/api/quizBank/getQuestions/?quizid="+quizId)).json();
    const data=await(await fetch("/api/quizBank/getQuestions/?quizid="+quizId)).json();
    noOFques(Number(data.length));
    Data=data;
}
getMax();

// main function
var resp;
var respSeq;
var time_stamps;
function run()
{
    resp=new Array(maxQues);
    respSeq=new Array(maxQues);
    time_stamps=new Array(maxQues);
    for(let j=0;j<maxQues;j++)
    {
        resp[j]=new Array();
        respSeq[j]=new Array();
        time_stamps[j]=new Array();
    }
}
setTimeout(run,1000);
const save=async(ind,ans)=>
{
    resp[ind-1]=new Array();
    for(let j=0;j<ans.length;j++)
    {
        resp[ind-1].push(ans[j].value);
    }
    respSeq[ind-1].push(resp[ind-1]);
    time_stamps[ind-1].push(Date.now()-START);
    const obj={
        "stud_id":IDs[0],
        "quiz_id":IDs[1],
        "ques_id":Data[ind-1]._id,
        // "sel_opt":resp[ind-1],
        "sel_opt_seq":respSeq[ind-1],
        "time_stamps":time_stamps[ind-1],
        // "correct":Data[ind-1].correct,
        // "points":Data[ind-1].points
    };
    let temp=await((await fetch("/api/resp/find/?ID="+IDs[0]+"&ques_id="+Data[ind-1]._id)).json());
    if(typeof(temp[0])==='undefined')
    {
        const options={
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(obj)
        };
        fetch('/api/resp/add/',options);
    }
    else
    {
        const options={
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(obj)
        };
        await(fetch("/api/resp/update/?ID="+IDs[0]+"&ques_id="+Data[ind-1]._id,options));
    }
}
function ansIn(ind,data)
{
    const RESPS=resp[ind-1];
    for(let x=0;x<RESPS.length;x++)
    {
        if(data==RESPS[x])
            return 1;
    }
    return 0;
}

function ansAt(ind)
{
    const RESPS=resp[ind-1];
    if(typeof(RESPS)!='undefined')
        return RESPS;
    return '';
}
// result

const showResult=async(len,Time)=>{
    let mins=Math.floor(Time);
    let secs=(Time-mins)*60;
    if(len>0)
    {
        mins=(Math.floor((1-len/810)*(Time)));
        secs=(Math.floor(((1-len/810)*(Time)-Math.floor((1-len/810)*(Time)))*60));
    }
    // alert("You took around "+String(mins)+" min "+String(secs)+" sec of time.");
    window.location.href=("/api/student/success/?id="+IDs[0]+"&quizid="+IDs[1]);
}