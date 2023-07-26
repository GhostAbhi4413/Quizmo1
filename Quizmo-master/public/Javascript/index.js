let Time=0; //in mins

var i=1;
let max=1;

$(document).bind("contextmenu",function(e){ return false; });

function setMax(n)
{
    max=n;
}

// obj contains data from database
var obj;
const init=async()=>{
    // obj=await(await fetch("http://localhost:5000/api/quizBank/getQuestions/?quizid="+quizId)).json();
    obj=await(await fetch("/api/quizBank/getQuestions/?quizid="+quizId)).json();
    for(let t=0;t<obj.length;t++)
    {
        Time+=obj[t].tTime;
    }
    if(obj.length==0)
    {
        alert("No questions have been added to the quiz yet.");
        window.history.back();
    }
    setMax(Number(obj.length));
    const con=document.getElementsByClassName('q_btn_con')[0];
    con.innerHTML='';
    for(let j=1;j<=max;j++)
    {
        con.innerHTML+='<button id="'+String(j)+'" class="q_btn" onclick="goTo(this.id,status());">'+String(j)+'</button>';
    }
    document.getElementById(String(1)).className+=' active';
    return new Promise((resolve, reject) => {
        if(typeof(obj)!=undefined)
        resolve(1);
    })
}


// displaying questions
function dispQues(ind)
{
    const qData=obj[ind-1];
    document.getElementById('Q').innerHTML=qData.question;
    document.getElementById('pnts').innerHTML=qData.points+" points";
    // for single correct
    const opt=document.getElementById('opt');
    opt.innerHTML='';
    for(let j=0;j<qData.options.length;j++)
    {
        if(ansIn(ind,qData.options[j]))
        {
            if(qData.type=="Single correct" || qData.type=="Yes or No")
                opt.innerHTML+='<div class="rdBtn"><input type="radio" id="opt'+String(j+1)+'" name="ans" value="'+qData.options[j]+'" checked><label for="opt'+String(j+1)+'">'+qData.options[j]+'</label></div>';
            else if(qData.type=="Multiple correct")
                opt.innerHTML+='<div class="rdBtn"><input type="checkbox" id="opt'+String(j+1)+'" name="ans" value="'+qData.options[j]+'" checked><label for="opt'+String(j+1)+'">'+qData.options[j]+'</label></div>';
        }
        else
        {
            if(qData.type=="Single correct" || qData.type=="Yes or No")
                opt.innerHTML+='<div class="rdBtn"><input type="radio" id="opt'+String(j+1)+'" name="ans" value="'+qData.options[j]+'"><label for="opt'+String(j+1)+'">'+qData.options[j]+'</label></div>';
            else if(qData.type=="Multiple correct")
                opt.innerHTML+='<div class="rdBtn"><input type="checkbox" id="opt'+String(j+1)+'" name="ans" value="'+qData.options[j]+'"><label for="opt'+String(j+1)+'">'+qData.options[j]+'</label></div>';
        }
    }
    if(qData.type=="Fill in the blanks")
        opt.innerHTML='<input type="text" id="keyword" name="ans" placeholder="Enter your answer here.." value="'+ansAt(ind)+'">';
    
    const optBtns=document.getElementsByClassName('rdBtn');
    for(let j=0;j<qData.options.length;j++)
    {
        const Input=optBtns[j].getElementsByTagName('input')[0];
        // const Label=optBtns[j].getElementsByTagName('label')[0];
        optBtns[j].addEventListener("click",function()
        {
            Input.checked=!Input.checked;
            if(obj[ind-1].type=='Single correct' || obj[ind-1].type=='Yes or No')
                save(ind,$('form').serializeArray());
        });
    }
    // showSurvey();
    if(i+1==max+1)
    {
        document.getElementById('next').innerText='Submit';
    }
    else
    {
        document.getElementById('next').innerText='Next';
    }
}

function goTo(id,fl)
{
    const el=document.getElementById(i);
    el.className=el.className.replace(' active','');
    if(fl==1)
    {
        el.className+=' attempted';
        el.className=el.className.replace(' skipped','');
        if(obj[id-1].type!='Single correct' && obj[id-1].type!='Yes or No')
            save(i,$('form').serializeArray());
    }
    else{
        el.className+=' skipped';
        if(obj[id-1].type!='Single correct' && obj[id-1].type!='Yes or No')
            save(i,{value:'-'});
    }
    i=Number(id);
    document.getElementById(id).className+=' active';
    dispQues(i);
}

function status()
{
    var x = $("form").serializeArray();
    if(x.length==0 ||x[0].value=='')
    {
        return 0;
    }
    else
    {
        return 1;
    }
}


function next(fl){
    // console.log($('form').serializeArray());
    const el=document.getElementById(String(i));
    if(fl==1)
    {
        el.className+=' attempted';
        el.className=el.className.replace(' skipped','');
        el.className=el.className.replace(' marked','');
        if(obj[i-1].type!='Single correct' && obj[i-1].type!='Yes or No')
            save(i,$('form').serializeArray());
    }
    else{
        el.className+=' skipped';
        if(obj[i-1].type!='Single correct' && obj[i-1].type!='Yes or No')
            save(i,{value:'-'});

    }
    if(i+1<=max)
    {
        el.className=el.className.replace(' active','');
        document.getElementById(++i).className+=' active';
        dispQues(i);
    }
    else
    {
        clearInterval(timer);
        if(window.confirm("Are you sure to submit your test?"))
        {
            showResult(len,Time);
        }
        else
            cnt=0;
    }
}
function prev(fl){
    console.log($('form').serializeArray());
    const el=document.getElementById(String(i));
    if(fl==1)
    {
        el.className+=' attempted';
        el.className=el.className.replace(' skipped','');
        if(obj[i-1].type!='Single correct' && obj[i-1].type!='Yes or No')
            save(i,$('form').serializeArray());
    }
    else{
        el.className+=' skipped';
        if(obj[i-1].type!='Single correct' && obj[i-1].type!='Yes or No')
            save(i,{value:'-'});
    }
    if(i-1>0)
    {
        el.className=el.className.replace(' active','');
        document.getElementById(--i).className+=' active';
        dispQues(i);
    }
}
function marked(fl)
{
    const el=document.getElementById(String(i));
    el.className+=' marked';
    if(fl==1)
    {
        el.className=el.className.replace(' skipped','');
        if(obj[i-1].type!='Single correct' && obj[i-1].type!='Yes or No')
            save(i,$('form').serializeArray());
    }
    else
    {
        if(obj[i-1].type!='Single correct' && obj[i-1].type!='Yes or No')
            save(i,{value:'-'});
    }
    if(i+1<=max)
    {
        el.className=el.className.replace(' active','');
        document.getElementById(++i).className+=' active';
        dispQues(i);
    }
}

//timer
const line=document.getElementById('timer');
var len=810;
let timer;//=setInterval(myTimer, 1000);
function myTimer() {
    if(len<=0)
    {
        alert("Time is over!!");
        clearInterval(timer);
        showResult(len,Time);
        document.getElementById('next').disabled=true;
        document.getElementById('prev').disabled=true;
        document.getElementById('mAn').disabled=true;
    }
    line.style.width=String(len)+'px';
    len-=810/((Time)*60);
}

//survey feedback saved
function showSurvey()
{
    document.getElementsByClassName('survey_con')[0].innerHTML='Rate this question<div class="survey"><button id="easy">Easy</button><button id="medium">Medium</button><button id="diff">Difficult</button></div>';
    const surCon=document.getElementsByClassName('survey')[0];
    const surBtns=surCon.getElementsByTagName('button');
    for(let j=0;j<surBtns.length;j++)
    {
        surBtns[j].addEventListener("click",function(){
            document.getElementsByClassName('survey_con')[0].innerHTML="Feedback saved successfully!";
        });
    }
}

// init();
async function main()
{
    await init();
    console.log("max= ",max);
    dispQues(1);
    
    //event listener
    var btn_container=document.getElementsByClassName("q_btn_con");
    var q_btns=btn_container[0].getElementsByClassName('q_btn');
    for(let j=0;j<q_btns.length;j++)
    {
        q_btns[j].addEventListener("click",function(){
            var current = btn_container[0].getElementsByClassName("active");

            // If there's no active class
            if (current.length > 0) {
                current[0].className = current[0].className.replace(" active", "");
            }
            this.className+=' active';
        });
    }

    //event listener for hiding
    const btn=document.getElementById("hide_btn");
    const panel=document.getElementsByClassName('panel')[0];
    btn.addEventListener("click",function(){
        if(btn.innerText=='>')
        {
            // document.getElementsByClassName('panel')[0].style.right='-250px';
            panel.className=panel.className.replace(' show','');
            panel.className+=' hide';
            btn.innerText='<';
        }
        else
        {
            // document.getElementsByClassName('panel')[0].style.right='0px';
            panel.className=panel.className.replace(' hide','');
            panel.className+=' show';
            btn.innerText='>';
        }
    });
    timer=setInterval(myTimer, 1000);
    $('#t0')[0].innerText=0+'min';
    $('#t25')[0].innerText=0.25*Time+'min';
    $('#t50')[0].innerText=0.5*Time+'min';
    $('#t75')[0].innerText=0.75*Time+'min';
    $('#t100')[0].innerText=Time+'min';
}
setTimeout(main,1000);

// function gotoLogin()
// {
//     window.location='/api/resp/login/';
// }
// function Close(){
//     window.close()
// }
// $(window).blur(function() {
//     alert('Test will close!')
//     setTimeout(Close,100)
// });
// const size=[screen.width,screen.height]
// $(window).resize(function(){
//     this.resizeTo(size[0],size[1])
// })
const oTitle=$('title')[0].innerText
let fl=0;
function notify(){
    if(fl)
        $('title')[0].innerText='Test will close!';
    else
        $('title')[0].innerText=oTitle;
    fl=!fl;
}
var Alert;
$(window).blur(function(){
    Alert=setInterval(notify,200);
    // alert('Not allowed to leave the tab!');
})
$(window).focus(function(){
    clearInterval(Alert)
    $('title')[0].innerText=oTitle;

})