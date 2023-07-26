$(document). bind("contextmenu",function(e){ return false; });

var total=0;
var single=0;
var multiple=0;
var fill=0;
var yes_no=0;
var qId=0;
var ques=[];
var topics=[];
var diffs=[];
var tTimes=[];
var points=[];

const params=new URLSearchParams(window.location.search);

for(value of params.values())
    var quizId=value;
console.log(quizId);

function reduceCount()
{
    $('#total').text(String(--total));
    if(this.name=="delFill")
        $('#blanks').text(String(--fill));
    else if(this.name=="delMultiple")
        $('#multiple').text(String(--multiple));
    else if(this.name=="delSingle")
        $('#single').text(String(--single));
    else if(this.name=="delYesNo")
        $('#yes_no').text(String(--yes_no));
    this.parentElement.parentElement.remove();
}

$('#YesNo').click(function(){
    //storing values
    var q=$("[name*='question']");
    var top=$("[name*='topic']");
    var diff=$("[name*='difficulty']");
    var tT=$("[name*='tTime']");
    var pnts=$("[name*='points']");
    ques=[];
    topics=[];
    diffs=[];
    tTimes=[];
    points=[];
    let fl=1;
    // storing question related data
    for(let j=0;j<q.length;j++)
    {
        ques.push(q[j].value);
        topics.push(top[j].value);
        diffs.push(diff[j].value);
        tTimes.push(tT[j].value);
        points.push(pnts[j].value);
        if(q[j].value.length==0 || top[j].value.length==0 || tT[j].value.length==0 || pnts[j].value.length==0)
        {
            fl=0;
            // window.alert("Please fill up the existing questions first.")
            Alert("Please fill up the existing questions first.");
            break;
        }
    }
    // storing options
    var opt=$('.textInput');
    var optArr=[],checked=[];
    for(let j=0;j<opt.length;j++)
    {
        optArr.push(opt[j].value);
        if(opt[j].previousSibling.checked==true)
            checked.push(1);
        else
            checked.push(0);
    }
    // 
    if(fl==1)
    {
        document.getElementById('main').innerHTML+=`
        <div class="qOuter">
            <div class="title">Yes or No</div>
            <input name="${++qId}-type" style="display:none;" value="Yes or No"/>
            <div class="qInner">
                <textarea placeholder="Enter the question here" name="${qId}-question" cols="30" rows="10" required></textarea>
                <div class="opt">
                    <button type="button" class="optBtn"><input type="radio" name="${qId}-correct" class="radioInput"><input value="Yes" name="${qId}-options" class="textInput" type="text" required></button>
                    <button type="button" class="optBtn"><input type="radio" name="${qId}-correct" class="radioInput"><input value="No" name="${qId}-options" class="textInput" type="text" required></button>
                </div>
                <div class="data">
                    <div class="subData">
                        <span class="subTitle">Topic</span>
                        <input class="dataInput" type="text" name="${qId}-topic" required>
                    </div>
                    <div class="subData">
                        <span class="subTitle">Target time (mins)</span>
                        <input class="dataInput" type="number" name="${qId}-tTime" min="0" required>
                    </div>
                    <div class="subData">
                        <span class="subTitle">Difficulty level</span>
                        <select id="" class="dataInput" name="${qId}-difficulty">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </div>
                    <div class="subData">
                        <span class="subTitle">Max points</span>
                        <input class="dataInput" type="number" name="${qId}-points" min="0" required>
                    </div>
                </div>
                <button type="button" name="delYesNo" class="del">Delete</button>
            </div>
        </div>
        `;
        // delete
        $(".del").click(reduceCount);
        //restoring values
        q=$("[name*='question']");
        top=$("[name*='topic']");
        diff=$("[name*='difficulty']");
        tT=$("[name*='tTime']");
        pnts=$("[name*='points']");
        for(let j=0;j<ques.length;j++)
        {
            q[j].value=ques[j];
            top[j].value=topics[j];
            diff[j].value=diffs[j];
            tT[j].value=tTimes[j];
            pnts[j].value=points[j];
        }
        // restoring options
        opt=$('.textInput');
        for(let j=0;j<optArr.length;j++)
        {
            opt[j].value=optArr[j];
            if(checked[j]==1)
                opt[j].previousSibling.checked=true;
        }
        // increasing total & single correct
        $('#total').text(String(++total));
        $('#yes_no').text(String(++yes_no));
        // auto scroll to last
        $('#main').animate({scrollTop:$('#main')[0].scrollHeight});
    }
    // 
});

function add_single_correct(el){
    const par=el.parentElement;
    el.remove();
    var opt=par.getElementsByClassName('textInput');
    var optArr=[];
    var checked=[]
    for(let j=0;j<opt.length;j++)
    {
        optArr.push(opt[j].value);
        if(opt[j].previousSibling.checked==true)
            checked.push(1);
        else
            checked.push(0);
    }
    par.innerHTML+=`<button type="button" class="optBtn"><input type="radio" name="${qId}-correct" class="radioInput"><input name="${qId}-options" class="textInput" type="text" placeholder="Enter the option here (mark if correct)" required><span class="cross" onclick="this.parentElement.remove()">&#10060;</span></button>`;
    par.innerHTML+='<button type="button" id="add" onclick="add_single_correct(this)">+ Add option</button>';
    var opt=par.getElementsByClassName('textInput');
    for(let j=0;j<optArr.length;j++)
    {
        opt[j].value=optArr[j];
        if(checked[j]==1)
            opt[j].previousSibling.checked=true;
    }
};

$('#mcq').click(function(){
    //storing values
    var q=$("[name*='question']");
    var top=$("[name*='topic']");
    var diff=$("[name*='difficulty']");
    var tT=$("[name*='tTime']");
    var pnts=$("[name*='points']");
    ques=[];
    topics=[];
    diffs=[];
    tTimes=[];
    points=[];
    let fl=1;
    // storing question related data
    for(let j=0;j<q.length;j++)
    {
        ques.push(q[j].value);
        topics.push(top[j].value);
        diffs.push(diff[j].value);
        tTimes.push(tT[j].value);
        points.push(pnts[j].value);
        if(q[j].value.length==0 || top[j].value.length==0 || tT[j].value.length==0 || pnts[j].value.length==0)
        {
            fl=0;
            // window.alert("Please fill up the existing questions first.")
            Alert("Please fill up the existing questions first.");
            break;
        }
    }
    // storing options
    var opt=$('.textInput');
    var optArr=[],checked=[];
    for(let j=0;j<opt.length;j++)
    {
        optArr.push(opt[j].value);
        if(opt[j].previousSibling.checked==true)
            checked.push(1);
        else
            checked.push(0);
    }
    // 
    if(fl==1)
    {
        document.getElementById('main').innerHTML+=`
        <div class="qOuter">
            <div class="title">Single correct</div>
            <input name="${++qId}-type" style="display:none;" value="Single correct"/>
            <div class="qInner">
                <textarea placeholder="Enter the question here" name="${qId}-question" cols="30" rows="10" required></textarea>
                <div class="opt">
                    <button type="button" class="optBtn"><input type="radio" name="${qId}-correct" class="radioInput"><input placeholder="Enter the option here (mark if correct)" name="${qId}-options" class="textInput" type="text" required><span class="cross" onclick="this.parentElement.remove()">&#10060;</span></button>
                    <button type="button" id="add" onclick="add_single_correct(this)">+ Add option</button>
                </div>
                <div class="data">
                    <div class="subData">
                        <span class="subTitle">Topic</span>
                        <input class="dataInput" type="text" name="${qId}-topic" required>
                    </div>
                    <div class="subData">
                        <span class="subTitle">Target time (mins)</span>
                        <input class="dataInput" type="number" name="${qId}-tTime" min="0" required>
                    </div>
                    <div class="subData">
                        <span class="subTitle">Difficulty level</span>
                        <select id="" class="dataInput" name="${qId}-difficulty">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </div>
                    <div class="subData">
                        <span class="subTitle">Max points</span>
                        <input class="dataInput" type="number" name="${qId}-points" min="0" required>
                    </div>
                </div>
                <button type="button" name="delSingle" class="del">Delete</button>
            </div>
        </div>
        `;
        // delete
        $(".del").click(reduceCount);
        //restoring values
        q=$("[name*='question']");
        top=$("[name*='topic']");
        diff=$("[name*='difficulty']");
        tT=$("[name*='tTime']");
        pnts=$("[name*='points']");
        for(let j=0;j<ques.length;j++)
        {
            q[j].value=ques[j];
            top[j].value=topics[j];
            diff[j].value=diffs[j];
            tT[j].value=tTimes[j];
            pnts[j].value=points[j];
        }
        // restoring options
        opt=$('.textInput');
        for(let j=0;j<optArr.length;j++)
        {
            opt[j].value=optArr[j];
            if(checked[j]==1)
                opt[j].previousSibling.checked=true;
        }
        // increasing total & single correct
        $('#total').text(String(++total));
        $('#single').text(String(++single));
        // auto scroll to last
        $('#main').animate({scrollTop:$('#main')[0].scrollHeight});
    }
    // 
});

function add_multiple_correct(el){
    const par=el.parentElement;
    el.remove();
    var opt=par.getElementsByClassName('textInput');
    var optArr=[];
    var checked=[];
    for(let j=0;j<opt.length;j++)
    {
        optArr.push(opt[j].value);
        if(opt[j].previousSibling.checked==true)
            checked.push(1);
        else
            checked.push(0);
    }
    par.innerHTML+=`<button type="button" class="optBtn"><input type="checkbox" name="${qId}-correct" class="radioInput"><input name="${qId}-options" class="textInput" type="text" placeholder="Enter the option here (mark if correct)"><span class="cross" onclick="this.parentElement.remove()">&#10060;</span></button>`;
    par.innerHTML+='<button type="button" id="add" onclick="add_multiple_correct(this)">+ Add option</button>';
    var opt=par.getElementsByClassName('textInput');
    for(let j=0;j<optArr.length;j++)
    {
        opt[j].value=optArr[j];
        if(checked[j]==1)
            opt[j].previousSibling.checked=true;
    }
};

$("#cBox").click(function(){
    //storing values
    var q=$("[name*='question']");
    var top=$("[name*='topic']");
    var diff=$("[name*='difficulty']");
    var tT=$("[name*='tTime']");
    var pnts=$("[name*='points']");
    ques=[];
    topics=[];
    diffs=[];
    tTimes=[];
    points=[];
    let fl=1;
    for(let j=0;j<q.length;j++)
    {
        ques.push(q[j].value);
        topics.push(top[j].value);
        diffs.push(diff[j].value);
        tTimes.push(tT[j].value);
        points.push(pnts[j].value);
        if(q[j].value.length==0 || top[j].value.length==0 || tT[j].value.length==0 || pnts[j].value.length==0)
        {
            fl=0;
            // window.alert("Please fill up the existing questions first.")
            Alert("Please fill up the existing questions first.");
            break;
        }
    }
    // storing options
    var opt=$('.textInput');
    var optArr=[];
    var checked=[];
    for(let j=0;j<opt.length;j++)
    {
        optArr.push(opt[j].value);
        if(opt[j].previousSibling.checked==true)
            checked.push(1);
        else
            checked.push(0);
    }
    // 
    if(fl==1)
    {
        document.getElementById('main').innerHTML+=`
        <div class="qOuter">
            <div class="title">Multiple correct</div>
            <input name="${++qId}-type" style="display:none;" value="Multiple correct"/>
            <div class="qInner">
                <textarea placeholder="Enter the question here" name="${qId}-question" cols="30" rows="10"></textarea>
                <div class="opt">
                    <button type="button" class="optBtn"><input type="checkbox" name="${qId}-correct" class="radioInput"><input name="${qId}-options" class="textInput" type="text" placeholder="Enter the option here (mark if correct)"><span class="cross" onclick="this.parentElement.remove()">&#10060;</span></button>
                    <button type="button" id="add" onclick="add_multiple_correct(this)">+ Add option</button>
                </div>
                <div class="data">
                    <div class="subData">
                        <span class="subTitle">Topic</span>
                        <input class="dataInput" type="text" name="${qId}-topic">
                    </div>
                    <div class="subData">
                        <span class="subTitle">Target time (mins)</span>
                        <input class="dataInput" type="number" name="${qId}-tTime" min="0" required>
                    </div>
                    <div class="subData">
                        <span class="subTitle">Difficulty level</span>
                        <select id="" class="dataInput" name="${qId}-difficulty">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </div>
                    <div class="subData">
                        <span class="subTitle">Max points</span>
                        <input class="dataInput" type="number" name="${qId}-points" min="0" required>
                    </div>
                </div>
                <button type="button" name="delMultiple" class="del">Delete</button>
            </div>
        </div>
        `;
        // delete
        $(".del").click(reduceCount);
        //restoring values
        q=$("[name*='question']");
        top=$("[name*='topic']");
        diff=$("[name*='difficulty']");
        tT=$("[name*='tTime']");
        pnts=$("[name*='points']");
        for(let j=0;j<ques.length;j++)
        {
            q[j].value=ques[j];
            top[j].value=topics[j];
            diff[j].value=diffs[j];
            tT[j].value=tTimes[j];
            pnts[j].value=points[j];
        }
        // restoring options
        opt=$('.textInput');
        for(let j=0;j<optArr.length;j++)
        {
            opt[j].value=optArr[j];
            if(checked[j]==1)
                opt[j].previousSibling.checked=true;
        }
        // increasing total & single correct
        $('#total').text(String(++total));
        $('#multiple').text(String(++multiple));
        // auto scroll to last
        $('#main').animate({scrollTop:$('#main')[0].scrollHeight});
    }
    // 
});

function add_keyword(el){
    const par=el.parentElement;
    el.remove();
    var opt=par.getElementsByClassName('textInput');
    var optArr=[];
    for(let j=0;j<opt.length;j++)
    {
        optArr.push(opt[j].value);
    }
    par.innerHTML+=`<div class="keywords"><input name="${qId}-correct" type="radio" style="display: none;" checked><input class="textInput" type="text" placeholder="Enter the acceptable keyword here"><span class="cross" onclick="this.parentElement.remove()">&#10060;</span></div>`;
    par.innerHTML+='<button type="button" id="add" onclick="add_keyword(this)">+ Add keyword</button>';
    var opt=par.getElementsByClassName('textInput');
    for(let j=0;j<optArr.length;j++)
    {
        opt[j].value=optArr[j];
    }
};

$('#fill').click(function(){
    //storing values
    var q=$("[name*='question']");
    var top=$("[name*='topic']");
    var diff=$("[name*='difficulty']");
    var tT=$("[name*='tTime']");
    var pnts=$("[name*='points']");
    ques=[];
    topics=[];
    diffs=[];
    tTimes=[];
    points=[];
    let fl=1;
    for(let j=0;j<q.length;j++)
    {
        ques.push(q[j].value);
        topics.push(top[j].value);
        diffs.push(diff[j].value);
        tTimes.push(tT[j].value);
        points.push(pnts[j].value);
        if(q[j].value.length==0 || top[j].value.length==0 || tT[j].value.length==0 || pnts[j].value.length==0)
        {
            fl=0;
            // window.alert("Please fill up the existing questions first.")
            Alert("Please fill up the existing questions first.");
            break;
        }
    }
    // storing options
    var opt=$('.textInput');
    var optArr=[],checked=[];
    for(let j=0;j<opt.length;j++)
    {
        optArr.push(opt[j].value);
        if(opt[j].previousSibling.checked==true)
            checked.push(1);
        else
            checked.push(0);
    }
    // 
    if(fl==1)
    {
        document.getElementById('main').innerHTML+=`
        <div class="qOuter">
            <div class="title">Fill in the blanks</div>
            <input name="${++qId}-type" style="display:none;" value="Fill in the blanks"/>
            <div class="qInner">
                <textarea placeholder="Enter the question here" name="${qId}-question" cols="30" rows="10"></textarea>
                <div class="opt">
                    <span style="margin: 5px; font-size: .38cm;">Keywords:</span>
                    <div class="keywords"><input name="${qId}-correct" type="radio" style="display: none;" checked><input class="textInput" type="text" placeholder="Enter the acceptable keyword here"><span class="cross" onclick="this.parentElement.remove()">&#10060;</span></div>
                    <button type="button" id="add" onclick="add_keyword(this)">+ Add keyword</button>
                </div>
                <div class="data">
                    <div class="subData">
                        <span class="subTitle">Topic</span>
                        <input class="dataInput" type="text" name="${qId}-topic">
                    </div>
                    <div class="subData">
                        <span class="subTitle">Target time (mins)</span>
                        <input class="dataInput" type="number" name="${qId}-tTime" min="0" required>
                    </div>
                    <div class="subData">
                        <span class="subTitle">Difficulty level</span>
                        <select id="" class="dataInput" name="${qId}-difficulty">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </div>
                    <div class="subData">
                        <span class="subTitle">Max points</span>
                        <input class="dataInput" type="number" name="${qId}-points" min="0" required>
                    </div>
                </div>
                <button type="button" name="delFill" class="del">Delete</button>
            </div>
        </div>
        `;
        // delete
        $(".del").click(reduceCount);
        //restoring values
        q=$("[name*='question']");
        top=$("[name*='topic']");
        diff=$("[name*='difficulty']");
        tT=$("[name*='tTime']");
        pnts=$("[name*='points']");
        for(let j=0;j<ques.length;j++)
        {
            q[j].value=ques[j];
            top[j].value=topics[j];
            diff[j].value=diffs[j];
            tT[j].value=tTimes[j];
            pnts[j].value=points[j];
        }
        // restoring options
        opt=$('.textInput');
        for(let j=0;j<optArr.length;j++)
        {
            opt[j].value=optArr[j];
            if(checked[j]==1)
                opt[j].previousSibling.checked=true;
        }
        // increasing total & single correct
        $('#total').text(String(++total));
        $('#blanks').text(String(++fill));
        // auto scroll to last
        $('#main').animate({scrollTop: $('#main')[0].scrollHeight});
    }
    // 
});

$('#save').click(function(){
    const correct=$("input[name*='correct']");
    for(let j=0;j<correct.length;j++)
    {
        correct[j].value=correct[j].nextElementSibling.value;
    }
    const params=new URLSearchParams(window.location.search);
    for(value of params.values())
        var id=value;
    $("#main").attr({ 
        action: "/api/quizBank/post/?quizid="+id
  });
    $("#main").submit();
});