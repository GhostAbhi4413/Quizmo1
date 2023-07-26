const params=new URLSearchParams(window.location.search);
var IDs=[];
for(value of params.values())
  IDs.push(value);
document.getElementById('username').innerHTML+=IDs[0]
if(IDs[2]==null)
  document.getElementById('topic').innerHTML+=('Topic: '+IDs[1])
else
  document.getElementById('topic').innerHTML+=('Topic: '+IDs[2])
function getColor(value) {
  if (value <= 50) {
      return '#FF6384'; // Red color for values greater than or equal to 20
  } else {
      return '#00bfea'; // Blue color for values less than 20
    }
}
async function chart(){
  const Data=await(await fetch("/api/resp/reportData/?ID="+IDs[0]+"&quizId="+IDs[1])).json();
  if(Data.finTimes.length==0)
  {
    alert("You have not attempted this test.")
    window.history.back();
  }
  const finTimes=Data.finTimes;
  const yques=[];
  const xtime=[];
  for(let i=0;i<finTimes.length;i++)
  {
    if(i>0)
      xtime.push([finTimes[i-1].fin_time,finTimes[i].fin_time]);
    else
    {
      xtime.push([0,finTimes[i].fin_time]);
    }
    yques.push('Q.'+String(parseInt(finTimes[i].id)+1));
  }
  // console.log(xtime);
  
  const ctx = document.getElementById('gnattChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: yques,
      datasets: [{
        label: '# time taken ',
        data: xtime,
        borderWidth: 1,
        backgroundColor:["#FF6384","#00bfea"]
        // barPercentage: barPer,
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Response timeline',
          font: {
            size: 18,
            weight: 'bold'
          }
        }
      },
      indexAxis: 'y',
      scales: {
        x:{
          title:{
            display:true,
            text:'Visit duration (mins)'
          }
        },
        y: {
          title:{
            display:true,
            text:'Question ID'
          },
          beginAtZero: true
        }
      }
    }
  });
  const ctx1 = document.getElementById('doughnut');
  new Chart(ctx1, {
    type: 'doughnut',
    data: {
      labels: Object.keys(Data.ans).slice(0,3),
      datasets: [{
        data: Object.values(Data.ans).slice(0,3),
        borderWidth: 1,
        backgroundColor:["#00cbf8","#FF6384","#f7b335"]
      }]
    },
    options:{
      plugins: {
        title: {
          display: true,
          text: 'Response composition',
          font: {
            size: 18,
            weight: 'bold'
          }
        }
      },
      cutout:'60%',
      radius:'90%'
    }
  });
  new Chart(document.getElementById('score'), {
    type: 'doughnut',
    data: {
      labels: ['Gained points','Missed points'],
      datasets: [{
        data:[Data.ans.gainedPoints,Data.ans.totalPoints-Data.ans.gainedPoints],
        borderWidth: 1,
        backgroundColor: ["#FF6384","rgb(231, 229, 229)"],
        label:'Points'
      }],
    },
    options:{
      plugins: {
        title: {
          display: true,
          text: 'Total score',
          font: {
            size: 18,
            weight: 'bold'
          }
        }
      },
      cutout:'85%',
      radius: '90%',
    }
  });
  document.getElementById('scoreNum').innerText=Data.ans.gainedPoints+"/"+Data.ans.totalPoints;
  new Chart(document.getElementById('pattern'), {
    data: {
      labels: Object.keys(Data.pattern.expDiffPattern),
      datasets: [{
        type: 'line',
        label:'Your attempt pattern',
        data: Data.pattern.attemptDiffPattern.map(obj=>obj.diff),
        borderWidth: 2,
        // backgroundColor: ["#FF6384","rgb(231, 229, 229)"],
        // label:'Points'
      },
      {
        type: 'line',
        label:'Expected attempt pattern',
        data: Object.values(Data.pattern.expDiffPattern),
        borderWidth: 3,
    }],
    },
    options:{
      plugins: {
        title: {
          display: true,
          text: 'Your attempt pattern',
          font: {
            size: 18,
            weight: 'bold'
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              var label = (context.dataset.label.replace('Your','Chosen').replace(' attempt pattern','')) || '';
              if (label) {
                label += ' difficulty: ';
              }
              label += context.formattedValue;
              return label;
            }
          }
        }
      },
      scales:{
        x:{
          title:{
            display:true,
            text:'Visit no.'
          }
        },
        y:{
          title:
          {
            display:true,
            text:'Difficulty'
          }
        }
      }
    }
  });
  let values=Object.values(Data.confidence);
  new Chart(document.getElementById('bar'), {
    type: 'bar',
    data: {
      labels: Object.keys(Data.confidence),
      datasets: [{
      label:'Confidence',
      data: values,
      backgroundColor: values.map(getColor), // Bar color
      borderWidth: 1 // Border width
  }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Sub-topic wise confidence',
          font: {
            size: 18,
            weight: 'bold'
          },
          
        },
        legend:{
          display:true
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              var label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += context.formattedValue+'%';
              return label;
            }
          }
        }
        
      },
      responsive: true,
      scales: {
        x:{
          title:{
            display:true,
            text:'Topics'
          }
        },
        y: {
          beginAtZero: true,
          title:{
            display:true,
            text:'Confidence in %'
          }
        }
      }
    }
  });
};

chart();