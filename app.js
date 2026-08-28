const domains=["Health","Wealth","Career","Family","Growth","Lifestyle"];
const growthLevels=[
  {name:"Bronze · Starter",focus:"Build the logging habit"},
  {name:"Silver · Recorder",focus:"Log consistently across your life"},
  {name:"Gold · Reviewer",focus:"Turn logs into weekly reflection"},
  {name:"Platinum · Builder",focus:"Convert insights into systems"},
  {name:"Diamond · Optimizer",focus:"Improve time, habits and resources"},
  {name:"Master · Integrator",focus:"Integrate life and help others"}
];
const lifeModes=["Survival","Safety","Choice","Freedom","Financial Freedom"];
const modules=[
  ["Foundation","Understand MyLifeOS and the six life domains"],
  ["Profile & Memory","Build your profile, timeline and memory foundation"],
  ["Assessment","See your strengths, gaps and current stage"],
  ["Daily Log & Review","Build Daily, Weekly and Monthly review habits"],
  ["Intelligence & Clarity","Find patterns, problems and opportunities"],
  ["Priority & Planning","Turn clarity into goals and action plans"],
  ["Growth Ladder","Know your level and next upgrade condition"],
  ["Output & Upgrade","Produce results and continuously improve"]
];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const store={
  get logs(){return JSON.parse(localStorage.getItem('mylifeos.logs')||'[]')},
  set logs(v){localStorage.setItem('mylifeos.logs',JSON.stringify(v))},
  get review(){return JSON.parse(localStorage.getItem('mylifeos.review')||'{}')},
  set review(v){localStorage.setItem('mylifeos.review',JSON.stringify(v))},
  get modules(){return JSON.parse(localStorage.getItem('mylifeos.modules')||'[]')},
  set modules(v){localStorage.setItem('mylifeos.modules',JSON.stringify(v))}
};
function malaysiaDate(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function malaysiaTime(){return new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kuala_Lumpur',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())}
function formatTime(t){if(!t)return'';const [h,m]=t.split(':').map(Number);const d=new Date();d.setHours(h,m);return d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});}
function escapeHtml(s=''){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}
function addLog({text,domain,time,amount}){const logs=store.logs;logs.unshift({id:Date.now(),date:malaysiaDate(),text,domain,time:time||malaysiaTime(),amount:Number(amount)||0});store.logs=logs;render();}
function renderLogs(target,items){const el=$(target);if(!items.length){el.className='timeline empty';el.textContent='No entries yet.';return;}el.className='timeline';el.innerHTML=items.map(x=>`<div class="timeline-item"><div class="time">${formatTime(x.time)}</div><div class="badge">${x.domain}</div><div>${escapeHtml(x.text)}</div><div class="amount">${x.amount?`RM ${x.amount.toFixed(2)}`:''}</div></div>`).join('');}
function todayData(){const logs=store.logs.filter(x=>x.date===malaysiaDate());const touched=new Set(logs.map(x=>x.domain));const reviewed=store.review.date===malaysiaDate();return{logs,touched,reviewed};}
function growthState(){const {logs,touched,reviewed}=todayData();const completed=store.modules.filter(Boolean).length;let raw=Math.min(100,logs.length*6+touched.size*7+(reviewed?18:0)+completed*3);let level=0;if(raw>=85)level=5;else if(raw>=68)level=4;else if(raw>=50)level=3;else if(raw>=32)level=2;else if(raw>=16)level=1;const thresholds=[0,16,32,50,68,85,100];const base=thresholds[level],next=thresholds[Math.min(level+1,6)];const progress=level===5?100:Math.round(((raw-base)/(next-base))*100);return{raw,level,progress};}
function domainScore(domain,logs){const c=logs.filter(x=>x.domain===domain).length;return Math.min(100,20+c*20);}
function renderGrowth(){const state=growthState(),g=growthLevels[state.level];$('#growthBadge').textContent=state.level+1;$('#growthLevel').textContent=g.name;$('#growthFocus').textContent=g.focus;$('#growthProgress').style.width=`${state.progress}%`;$('#growthPercent').textContent=`${state.progress}%`;const {logs,touched,reviewed}=todayData();let mission='Create 3 meaningful Daily Logs today.';if(logs.length>=3&&touched.size<3)mission='Touch at least 3 life domains today.';if(logs.length>=3&&touched.size>=3&&!reviewed)mission='Complete today’s Daily Review.';if(reviewed&&store.modules.filter(Boolean).length<3)mission='Complete your next Volume 1 learning module.';if(state.level>=2)mission='Turn one repeated problem into a clear action or system.';$('#nextMission').innerHTML=`<strong>${mission}</strong><p>${g.focus}. Small consistent upgrades move you to the next level.</p>`;}
function renderLifeMode(){const {logs,touched,reviewed}=todayData();const engagement=Math.min(100,35+logs.length*3+touched.size*4+(reviewed?10:0)+store.modules.filter(Boolean).length*2);let level=0;if(engagement>=85)level=4;else if(engagement>=72)level=3;else if(engagement>=58)level=2;else if(engagement>=45)level=1;$('#lifeMode').textContent=`Level ${level+1} · ${lifeModes[level]}`;$('#modeTrack').innerHTML=lifeModes.map((m,i)=>`<div class="mode-step ${i===level?'active':''}">${m}</div>`).join('');$('#freedomScore').textContent=engagement;$('.score-ring').style.background=`conic-gradient(#22c55e 0 ${engagement}%,#e5e7eb ${engagement}% 100%)`;$('#freedomLabel').textContent=engagement>=80?'High choice and balance':engagement>=60?'Growing choice and stability':'Building foundation';}
function renderDomains(){const {logs}=todayData();const scores=domains.map(d=>({d,score:domainScore(d,logs),count:logs.filter(x=>x.domain===d).length}));$('#domainSnapshot').innerHTML=scores.map(x=>`<div class="snapshot-card"><strong>${x.d}</strong><div class="mini-score">${x.score}</div><small>${x.count} log${x.count===1?'':'s'} today</small></div>`).join('');$('#domainGrid').innerHTML=scores.map(x=>`<article class="domain-card"><h3>${x.d}</h3><div class="score">${x.score}</div><p>${x.count?`${x.count} activity log${x.count>1?'s':''} today`:'No activity logged today'}</p><div class="domain-bar"><span style="width:${x.score}%"></span></div></article>`).join('');const sorted=[...scores].sort((a,b)=>a.score-b.score);const weak=sorted[0],strong=sorted[sorted.length-1];$('#coachInsight').textContent=logs.length?`${strong.d} is currently your strongest visible domain. ${weak.d} has the least activity today. Improve balance by adding one meaningful action in ${weak.d}, not by simply adding more logs.`:'Start logging across your life domains. MyLifeOS will use your patterns to show what is strong, what is weak, and what to improve next.';}
function renderJourney(){let done=store.modules;if(done.length<8)done=[...done,...Array(8-done.length).fill(false)];const completed=done.filter(Boolean).length;$('#journeyPercent').textContent=`${Math.round(completed/8*100)}% complete`;$('#journeyMini').innerHTML=modules.map((m,i)=>`<div class="journey-mini ${done[i]?'done':''}"><div class="num">${i+1}</div>${m[0]}</div>`).join('');$('#journeyGrid').innerHTML=modules.map((m,i)=>`<article class="journey-card ${done[i]?'completed':''}"><div class="module-num">${i+1}</div><h3>${m[0]}</h3><p>${m[1]}</p><label class="module-check"><input type="checkbox" data-module="${i}" ${done[i]?'checked':''}> Mark module complete</label></article>`).join('');$$('[data-module]').forEach(cb=>cb.addEventListener('change',()=>{const arr=done.slice();arr[Number(cb.dataset.module)]=cb.checked;store.modules=arr;render();}));}
function render(){const {logs,touched,reviewed}=todayData();renderLogs('#recentLogs',logs.slice(0,5));renderLogs('#allLogs',logs);$('#logCount').textContent=logs.length;$('#allLogCount').textContent=`${logs.length} ${logs.length===1?'entry':'entries'}`;$('#domainCount').textContent=`${touched.size}/6`;$('#spendTotal').textContent=`RM ${logs.reduce((a,b)=>a+b.amount,0).toFixed(2)}`;$('#reviewStatus').textContent=reviewed?'Done':'Not done';renderGrowth();renderLifeMode();renderDomains();renderJourney();}
function initDate(){const d=new Date();$('#todayDate').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kuala_Lumpur',day:'2-digit',month:'short',year:'numeric'}).format(d);$('#todayDay').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kuala_Lumpur',weekday:'long'}).format(d);}
$$('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>{$$('.nav-btn').forEach(x=>x.classList.remove('active'));$$('.view').forEach(x=>x.classList.remove('active'));btn.classList.add('active');$('#'+btn.dataset.view).classList.add('active');}));
$('#quickForm').addEventListener('submit',e=>{e.preventDefault();addLog({text:$('#quickText').value.trim(),domain:$('#quickDomain').value});$('#quickText').value='';});
$('#logForm').addEventListener('submit',e=>{e.preventDefault();addLog({text:$('#logText').value.trim(),domain:$('#logDomain').value,time:$('#logTime').value,amount:$('#logAmount').value});e.target.reset();});
$('#clearLogs').addEventListener('click',()=>{if(confirm('Clear today\'s MyLifeOS logs?')){store.logs=store.logs.filter(x=>x.date!==malaysiaDate());render();}});
$('#reviewForm').addEventListener('submit',e=>{e.preventDefault();store.review={date:malaysiaDate(),wins:$('#reviewWins').value,problems:$('#reviewProblems').value,lessons:$('#reviewLessons').value,tomorrow:$('#reviewTomorrow').value};$('#reviewSaved').textContent='Daily review saved locally.';render();});
function loadReview(){const r=store.review;if(r.date===malaysiaDate()){$('#reviewWins').value=r.wins||'';$('#reviewProblems').value=r.problems||'';$('#reviewLessons').value=r.lessons||'';$('#reviewTomorrow').value=r.tomorrow||'';$('#reviewSaved').textContent='Today\'s saved review loaded.';}}
initDate();loadReview();render();