const domains=["Health","Wealth","Career","Family","Growth","Lifestyle"];
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const store={
  get logs(){return JSON.parse(localStorage.getItem('mylifeos.logs')||'[]')},
  set logs(v){localStorage.setItem('mylifeos.logs',JSON.stringify(v))},
  get review(){return JSON.parse(localStorage.getItem('mylifeos.review')||'{}')},
  set review(v){localStorage.setItem('mylifeos.review',JSON.stringify(v))}
};
function formatTime(t){if(!t)return'';const [h,m]=t.split(':').map(Number);const d=new Date();d.setHours(h,m);return d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});}
function todayStamp(){const d=new Date();return d.toISOString().slice(0,10);}
function addLog({text,domain,time,amount}){const logs=store.logs;logs.unshift({id:Date.now(),date:todayStamp(),text,domain,time:time||new Date().toTimeString().slice(0,5),amount:Number(amount)||0});store.logs=logs;render();}
function renderLogs(target,items){const el=$(target);if(!items.length){el.className='timeline empty';el.textContent='No entries yet.';return;}el.className='timeline';el.innerHTML=items.map(x=>`<div class="timeline-item"><div class="time">${formatTime(x.time)}</div><div class="badge">${x.domain}</div><div>${escapeHtml(x.text)}</div><div class="amount">${x.amount?`RM ${x.amount.toFixed(2)}`:''}</div></div>`).join('');}
function escapeHtml(s=''){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}
function render(){const logs=store.logs.filter(x=>x.date===todayStamp());renderLogs('#recentLogs',logs.slice(0,5));renderLogs('#allLogs',logs);$('#logCount').textContent=logs.length;$('#allLogCount').textContent=`${logs.length} ${logs.length===1?'entry':'entries'}`;const touched=new Set(logs.map(x=>x.domain));$('#domainCount').textContent=`${touched.size}/6`;$('#spendTotal').textContent=`RM ${logs.reduce((a,b)=>a+b.amount,0).toFixed(2)}`;const review=store.review;$('#reviewStatus').textContent=review.date===todayStamp()?'Done':'Not done';$('#domainGrid').innerHTML=domains.map(d=>{const count=logs.filter(x=>x.domain===d).length;return `<article class="domain-card"><h3>${d}</h3><div class="score">${count}</div><p>${count?`${count} log${count>1?'s':''} today`:'No activity logged today'}</p></article>`}).join('');}
function initDate(){const d=new Date();$('#todayDate').textContent=d.toLocaleDateString([], {day:'2-digit',month:'short',year:'numeric'});$('#todayDay').textContent=d.toLocaleDateString([], {weekday:'long'});}
$$('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>{$$('.nav-btn').forEach(x=>x.classList.remove('active'));$$('.view').forEach(x=>x.classList.remove('active'));btn.classList.add('active');$('#'+btn.dataset.view).classList.add('active');}));
$('#quickForm').addEventListener('submit',e=>{e.preventDefault();addLog({text:$('#quickText').value.trim(),domain:$('#quickDomain').value});$('#quickText').value='';});
$('#logForm').addEventListener('submit',e=>{e.preventDefault();addLog({text:$('#logText').value.trim(),domain:$('#logDomain').value,time:$('#logTime').value,amount:$('#logAmount').value});e.target.reset();});
$('#clearLogs').addEventListener('click',()=>{if(confirm('Clear today\'s MyLifeOS logs?')){store.logs=store.logs.filter(x=>x.date!==todayStamp());render();}});
$('#reviewForm').addEventListener('submit',e=>{e.preventDefault();store.review={date:todayStamp(),wins:$('#reviewWins').value,problems:$('#reviewProblems').value,lessons:$('#reviewLessons').value,tomorrow:$('#reviewTomorrow').value};$('#reviewSaved').textContent='Daily review saved locally.';render();});
function loadReview(){const r=store.review;if(r.date===todayStamp()){$('#reviewWins').value=r.wins||'';$('#reviewProblems').value=r.problems||'';$('#reviewLessons').value=r.lessons||'';$('#reviewTomorrow').value=r.tomorrow||'';$('#reviewSaved').textContent='Today\'s saved review loaded.';}}
initDate();loadReview();render();
