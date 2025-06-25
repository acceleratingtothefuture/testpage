// helper
const $ = s => document.querySelector(s);

// footer year
$('#yearNow').textContent = new Date().getFullYear();

// months
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ===== arrests & prosecutions data ===== */
const data = { violent:{ arrests:{}, prosecutions:{} },
               nonViolent:{ arrests:{}, prosecutions:{} } };

for(let y=2011;y<=2025;y++){
  data.violent.arrests[y]    = months.map(()=>Math.floor(Math.random()*120+60));
  data.nonViolent.arrests[y] = months.map(()=>Math.floor(Math.random()*80+20));
  data.violent.prosecutions[y]    = data.violent.arrests[y].map(a=>Math.floor(a*(Math.random()*0.4+0.4)));
  data.nonViolent.prosecutions[y] = data.nonViolent.arrests[y].map(a=>Math.floor(a*(Math.random()*0.4+0.4)));
}

/* ========= stacked bar chart ========= */
const ctx         = $('#incidentsChart').getContext('2d');
const yearRange   = $('#yearRange');
const yearDisplay = $('#yearDisplay');
const typeSelect  = $('#incidentType');
const arrestsColor='rgba(108,141,255,0.7)';
const prosecColor='rgba(255,159,64,0.7)';

const titleColor='#e9ecff';

function key(){return typeSelect.value==='Violent'?'violent':'nonViolent';}

const barChart = new Chart(ctx,{
  type:'bar',
  data:{
    labels:months,
    datasets:[
      {label:'Arrests',backgroundColor:arrestsColor,borderColor:'rgba(108,141,255,1)',borderWidth:1,data:data[key()].arrests[yearRange.value],stack:'s'},
      {label:'Prosecutions',backgroundColor:prosecColor,borderColor:'rgba(255,159,64,1)',borderWidth:1,data:data[key()].prosecutions[yearRange.value],stack:'s'}
    ]
  },
  options:{
    responsive:true,maintainAspectRatio:false,
    scales:{y:{beginAtZero:true,stacked:true,grid:{color:'#2a2f45'}},x:{stacked:true,grid:{display:false}}},
    plugins:{
      title:{display:true,text:`${typeSelect.value}: arrests and prosecutions in ${yearRange.value}`,font:{size:22},color:titleColor},
      tooltip:{mode:'index',intersect:false},
      legend:{labels:{color:titleColor}}
    }
  }
});

function updateBar(){
  const yr=yearRange.value,k=key();
  barChart.data.datasets[0].data=data[k].arrests[yr];
  barChart.data.datasets[1].data=data[k].prosecutions[yr];
  barChart.options.plugins.title.text=`${typeSelect.value}: arrests and prosecutions in ${yr}`;
  barChart.update();
  yearDisplay.textContent=yr;
}
yearRange.addEventListener('input',updateBar);
typeSelect.addEventListener('change',updateBar);

/* ===== DA actions pie charts ===== */
const actionsPie1Ctx=$('#actionsPie1').getContext('2d');
const actionsPie2Ctx=$('#actionsPie2').getContext('2d');
const actionsYearRange=$('#actionsYearRange');
const actionsYearDisplay=$('#actionsYearDisplay');

const actionsData={severity:{},outcomes:{}};
for(let y=2011;y<=2025;y++){
  const mis=Math.floor(Math.random()*200+200);
  const fel=Math.floor(Math.random()*100+100);
  actionsData.severity[y]=[mis,fel];
  const total=mis+fel;
  const convicted=Math.floor(total*(Math.random()*0.2+0.6));
  const noContest=Math.floor(total*(Math.random()*0.1+0.1));
  const dropped=Math.floor(total*(Math.random()*0.03+0.02));
  const acquitted=total-convicted-noContest-dropped;
  actionsData.outcomes[y]=[convicted,noContest,dropped,acquitted];
}

const pie1Colors=['rgba(75,192,192,0.8)','rgba(255,99,132,0.8)'];
const pie2Colors=['rgba(54,162,235,0.8)','rgba(255,205,86,0.8)','rgba(201,203,207,0.8)','rgba(153,102,255,0.8)'];

const pieSeverity=new Chart(actionsPie1Ctx,{
  type:'pie',
  data:{labels:['Misdemeanor','Felony'],datasets:[{data:actionsData.severity[actionsYearRange.value],backgroundColor:pie1Colors,borderWidth:1}]},
  options:{plugins:{title:{display:true,text:`Charges by severity in ${actionsYearRange.value}`,font:{size:22},color:titleColor},legend:{labels:{color:titleColor}}}}
});

const pieOutcomes=new Chart(actionsPie2Ctx,{
  type:'pie',
  data:{labels:['Convicted','No Contest','Dropped','Acquitted'],datasets:[{data:actionsData.outcomes[actionsYearRange.value],backgroundColor:pie2Colors,borderWidth:1}]},
  options:{plugins:{title:{display:true,text:`Case outcomes in ${actionsYearRange.value}`,font:{size:22},color:titleColor},legend:{labels:{color:titleColor}}}}
});

function updatePies(){
  const yr=actionsYearRange.value;
  pieSeverity.data.datasets[0].data=actionsData.severity[yr];
  pieSeverity.options.plugins.title.text=`Charges by severity in ${yr}`;
  pieSeverity.update();
  pieOutcomes.data.datasets[0].data=actionsData.outcomes[yr];
  pieOutcomes.options.plugins.title.text=`Case outcomes in ${yr}`;
  pieOutcomes.update();
  actionsYearDisplay.textContent=yr;
}
actionsYearRange.addEventListener('input',updatePies);

/* ===== info toggles ===== */
document.querySelectorAll('.info-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const box=$(`#${btn.dataset.target}`);
    box.classList.toggle('open');
    btn.textContent=box.classList.contains('open')?'Hide information':'More information';
  });
});
