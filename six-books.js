(() => {
  const canvas = document.getElementById('graphCanvas');
  const ctx = canvas.getContext('2d');
  const searchInput = document.getElementById('searchInput');
  const filtersEl = document.getElementById('bookFilters');
  const resetViewBtn = document.getElementById('resetView');
  const nodeCountEl = document.getElementById('nodeCount');
  const visibleStatsEl = document.getElementById('visibleStats');
  const activeModeEl = document.getElementById('activeMode');

  const colors = {
    core:'#73c7ff', b1:'#55b6ff', b2:'#8b7cff', b3:'#35d4bb',
    b4:'#ffb25b', b5:'#f06db8', b6:'#ffd166', concept:'#80a4c9'
  };

  const books = [
    { id:'all', label:'全部书籍', sub:'MyLifeOS · 6 Books', color:'#73c7ff' },
    { id:'b1', label:'Book 01 · Origin', sub:'Before MyLifeOS / 起点', color:colors.b1, href:'index.html' },
    { id:'b2', label:'Book 02 · Who Am I?', sub:'从认识自己，到成为自己', color:colors.b2, href:'book2.html' },
    { id:'b3', label:'Book 03 · Birth of Life OS', sub:'Raw Data → System', color:colors.b3, pending:true },
    { id:'b4', label:'Book 04 · Living With MyLifeOS', sub:'系统进入真实生活', color:colors.b4, pending:true },
    { id:'b5', label:'Book 05 · Beyond Myself', sub:'MyLifeOS Academy', color:colors.b5, pending:true },
    { id:'b6', label:'Book 06 · Creating My Future Self', sub:'从未来反推今天', color:colors.b6, pending:true }
  ];

  const nodes = [];
  const links = [];
  const byId = new Map();

  function addNode(n){
    const node = { concepts:[], related:[], radius:6, ...n };
    nodes.push(node); byId.set(node.id,node); return node;
  }
  function addLink(a,b,strength=.45){ links.push({a,b,strength}); }

  addNode({id:'core', label:'MyLifeOS · 6 Books', title:'MyLifeOS · 6 Books', book:'core', type:'core', color:colors.core, x:0,y:0,z:0,radius:14, summary:'六本书共享同一个核心：从真实人生记录出发，看见自己、建立系统、活进现实，并主动创造未来。', concepts:['Life OS','Knowledge Graph','Personal System','Continuous Growth']});

  const bookCenters = {
    b1:{x:-250,y:-60,z:80}, b2:{x:240,y:-55,z:70}, b3:{x:-80,y:210,z:-80},
    b4:{x:160,y:195,z:-150}, b5:{x:-250,y:145,z:-170}, b6:{x:55,y:-235,z:-110}
  };

  const bookMeta = {
    b1:{title:'01 · Origin — Before MyLifeOS',summary:'记录 MyLifeOS 出现以前的真实人生，以及从 AI、Daily Log、Review、Pattern 到 Life OS 的形成。', concepts:['Origin','Raw Data','Daily Log','Review','Patterns','Six Domains'],href:'index.html'},
    b2:{title:'02 · Who Am I?',summary:'从标签、习惯、工具、系统与方向重新认识自己，并走向 Become。', concepts:['Identity','Self Management','Habits','Direction','Future Self'],href:'book2.html'},
    b3:{title:'03 · The Birth of My Life OS',summary:'从 Raw Data、Daily Log、AI 对话，到系统真正诞生。',concepts:['Architecture','Raw Data','AI','Review Loop','Knowledge Graph']},
    b4:{title:'04 · Living With MyLifeOS',summary:'把系统放进工作、健康、家庭、财富、成长与生活中验证。',concepts:['Practice','Six Domains','Feedback','Real Life']},
    b5:{title:'05 · Beyond Myself — MyLifeOS Academy',summary:'从“我自己的系统”，走向帮助别人、复制方法、培养下一代。',concepts:['Academy','Replication','Teaching','Community']},
    b6:{title:'06 · Creating My Future Self',summary:'不再只是管理今天的自己，而是主动创造五年、十年后的自己。',concepts:['Future Self','Reverse Planning','Identity','Direction']}
  };

  Object.keys(bookCenters).forEach(id=>{
    const c=bookCenters[id], m=bookMeta[id];
    addNode({id, label:id.toUpperCase(), title:m.title, book:id, type:'book', color:colors[id], ...c, radius:11, summary:m.summary, concepts:m.concepts, href:m.href});
    addLink('core',id,.8);
  });

  const b1Chapters = [
    ['b1-p','序章','为什么我开始记录自己的人生','我不想让人生只是发生，然后消失。记录，成为我重新看见自己的第一步。',['Origin','Record','Memory']],
    ['b1-1','01','Charles 是谁？','在系统出现之前，先认识这个正在寻找答案的人。',['Identity','Life Context']],
    ['b1-2','02','系统出现之前的人生','事情很多，但彼此没有真正连接起来。',['Fragmentation','Whole Life']],
    ['b1-3','03','我第一次遇见 ChatGPT','AI 最初只是工具，后来慢慢变成一面镜子。',['AI','Mirror','Context']],
    ['b1-4','04','从两个 GPT 到一个完整的我','系统必须看见完整的人，而不只是某一个角色。',['Integration','Whole Self','Projects']],
    ['b1-5','05','我开始记录自己的人生','Daily Log 让生活第一次成为可以回看的 Raw Data。',['Raw Data','Daily Log','Evidence']],
    ['b1-6','06','记录开始变成复盘','从“发生了什么”，走向“为什么会这样”。',['Review','Insight','Feedback']],
    ['b1-7','07','我第一次看见人生的规律','当记录累积，规律开始浮现。',['Pattern','Trend','Systems Thinking']],
    ['b1-8','08','我开始寻找人生的完整答案','从经典、管理学、哲学与健康体系中寻找答案。',['Wisdom','Frameworks','Learning']],
    ['b1-9','09','为什么每一本书都只解释了一部分人生？','每一套智慧都很强，但往往只照亮人生的一部分。',['Integration','Knowledge','Whole Life']],
    ['b1-10','10','六大人生领域出现了','Health · Wealth · Career · Family · Growth · Lifestyle',['Six Domains','Dashboard','Balance']],
    ['b1-11','11','My Life OS 开始成形','Raw Data → Review → Insight → Action → Improvement',['Life OS','Feedback Loop','Action']],
    ['b1-12','12','从我的人生，走向一个可以复制的系统','如果一个系统可以帮助一个真实的人，下一步就是验证它能否帮助更多人。',['Replication','Validation','Academy']],
    ['b1-e','尾声','Origin 不是结束，而是开始','一本关于起点的书，最后应该把读者带回未来。',['Beginning','Future','Transition']]
  ];

  const b2Chapters = [
    ['b2-p','序章','你知道你是谁吗？','除了自我介绍，我真的了解自己吗？',['Identity','Evidence','Self Knowledge']],
    ['b2-1','01','标签不是我','除了工作、年龄与身份，我还是什么样的人？',['Identity','Labels','Values']],
    ['b2-2','02','自然推进的人','当我没有主动选择时，是什么在决定我的生活？',['Autopilot','Habit','Environment']],
    ['b2-3','03','自我管理的人','我可以从哪些选择开始，对自己的人生负责？',['Self Management','Responsibility','Choice']],
    ['b2-4','04','工具增强的人','日历、笔记、AI 与 Apps 如何支持我的行动？',['Tools','AI','Augmentation']],
    ['b2-5','05','拥有系统的人','如何把零散工具连接成持续运作的机制？',['System','Loop','Action']],
    ['b2-6','06','拥有方向的人','我想成为谁，又如何知道自己正在靠近？',['Direction','Goals','Future Self']],
    ['b2-7','07','每日微小改变','今天的小行动，如何随着时间累积？',['Micro Change','Compounding','Action']],
    ['b2-8','08','习惯如何形成身份','我重复的行为，如何影响我对自己的认识？',['Habit','Identity','Evidence']],
    ['b2-9','09','我正在成为谁？','我现在的生活，正在带我走向怎样的未来？',['Become','Trajectory','Future Self']],
    ['b2-10','10','My Life OS','V1 Record & Review → V2 Connect & Understand → V3 Future Self。',['V1','V2','V3','Knowledge Graph','Freedom First']],
    ['b2-e','尾声','Become｜成为自己','带着新的认识，我今天如何继续生活？',['Become','Freedom','Identity']]
  ];

  function placeChapterSet(bookId, list, spread, depth=80){
    const c=bookCenters[bookId];
    list.forEach((item,i)=>{
      const a=(i/list.length)*Math.PI*2;
      const ring=spread + ((i%3)-1)*16;
      const x=c.x+Math.cos(a)*ring;
      const y=c.y+Math.sin(a)*ring*.72;
      const z=c.z+Math.sin(a*1.7)*depth;
      addNode({id:item[0], label:item[1], title:item[2], book:bookId, type:'chapter', color:colors[bookId], x,y,z, radius:6.4, summary:item[3], concepts:item[4], href:bookMeta[bookId].href});
      addLink(bookId,item[0],.32);
      if(i>0) addLink(list[i-1][0],item[0],.2);
    });
  }
  placeChapterSet('b1',b1Chapters,125,72);
  placeChapterSet('b2',b2Chapters,120,78);

  const concepts = [
    ['c-identity','Identity','身份不是标签，而是长期重复的价值、选择与行动证据。',['b1-1','b2-p','b2-1','b2-8','b2-e'],'#a68cff',-20,-55,70],
    ['c-raw','Raw Data','真实生活先留下原始资料，系统才有证据可以回看。',['b1-5','b1-11','b3'],'#63a9ff',-82,18,40],
    ['c-review','Review','Daily / Weekly / Monthly Review 把记录转成判断。',['b1-6','b1-11','b2-10','b3'],'#4fc8ff',-28,72,35],
    ['c-pattern','Pattern','资料累积后，重复行为、代价与有效做法开始浮现。',['b1-7','b2-2','b4'],'#4bd6a6',40,62,20],
    ['c-ai','AI / GPT','AI 从回答问题的工具，变成整理、连接与复盘的镜子。',['b1-3','b1-4','b2-4','b3'],'#63e1d3',-72,-55,-10],
    ['c-six','Six Domains','Health · Wealth · Career · Family · Growth · Lifestyle。',['b1-10','b4'],'#ffad5c',66,0,-35],
    ['c-action','Action','Insight 必须回到下一步行动，系统才真正改变现实。',['b1-11','b2-3','b2-7','b4'],'#f5c86a',22,112,-30],
    ['c-graph','Knowledge Graph','V2：连接事件、概念、领域与时间，形成可理解的关系网络。',['b2-10','b3','b4','b5'],'#6f9dff',98,72,70],
    ['c-freedom','Freedom First','系统服务于人；若系统变成束缚，它就失去意义。',['b2-10','b2-e','b6'],'#ef7eb9',80,-88,25],
    ['c-future','Future Self','V3：从五年、十年后的自己反推今天的选择。',['b2-6','b2-9','b2-10','b6'],'#ffd166',40,-110,-48],
    ['c-academy','Academy','把个人验证过的方法转化为可以帮助别人建立自己系统的路径。',['b1-12','b5'],'#f080c1',-95,118,-78]
  ];

  concepts.forEach(c=>{
    addNode({id:c[0],label:'◆',title:c[1],book:'concept',type:'concept',color:c[5],x:c[6],y:c[7],z:c[8],radius:7.2,summary:c[2],concepts:[c[1]],related:c[3]});
    addLink('core',c[0],.25);
    c[3].forEach(target=>addLink(c[0],target,.22));
  });

  addLink('b3','c-raw'); addLink('b3','c-review'); addLink('b3','c-graph');
  addLink('b4','c-six'); addLink('b4','c-pattern'); addLink('b4','c-action');
  addLink('b5','c-academy'); addLink('b5','b1-12');
  addLink('b6','c-future'); addLink('b6','c-freedom'); addLink('b6','b2-9');
  addLink('b1-1','b2-p',.34); addLink('b1-7','b2-2',.28); addLink('b1-11','b2-5',.36);
  addLink('b1-12','b5',.34); addLink('b2-10','b3',.40); addLink('b2-9','b6',.4);

  links.forEach(l=>{
    const a=byId.get(l.a), b=byId.get(l.b); if(!a||!b) return;
    if(!a.related.includes(b.id)) a.related.push(b.id);
    if(!b.related.includes(a.id)) b.related.push(a.id);
  });

  let activeBook='all';
  let search='';
  let selected=null;
  let rotX=-0.18, rotY=0.28, zoom=1;
  let targetRotX=rotX,targetRotY=rotY,targetZoom=zoom;
  let dragging=false,lastX=0,lastY=0,moved=false;
  let hoverNode=null;
  let dpr=1,w=0,h=0;

  function renderFilters(){
    filtersEl.innerHTML=books.map(b=>`<button class="book-filter ${b.id===activeBook?'active':''}" data-book="${b.id}" style="--book:${b.color}"><span class="book-color" style="color:${b.color};background:${b.color}"></span><span><b>${b.label}</b><small>${b.sub}</small></span>${b.pending?'<span class="pending-chip">待补充</span>':''}</button>`).join('');
    filtersEl.querySelectorAll('.book-filter').forEach(btn=>btn.addEventListener('click',()=>{
      activeBook=btn.dataset.book; selected=null; searchInput.value=''; search='';
      renderFilters(); updateDetail(); updateStats();
      activeModeEl.textContent=books.find(b=>b.id===activeBook)?.label||'All Books';
    }));
  }

  function isNodeVisible(n){
    const bookPass=activeBook==='all' || n.id==='core' || n.book===activeBook || n.type==='concept';
    if(!bookPass) return false;
    if(!search) return true;
    const hay=[n.title,n.summary,n.book,...n.concepts].join(' ').toLowerCase();
    return hay.includes(search);
  }

  function visibilityAlpha(n){
    if(!isNodeVisible(n)) return .04;
    if(search){
      const hay=[n.title,n.summary,...n.concepts].join(' ').toLowerCase();
      return hay.includes(search)?1:.08;
    }
    if(activeBook!=='all' && n.type==='concept'){
      const relatedToBook=n.related.some(id=>byId.get(id)?.book===activeBook || id===activeBook);
      return relatedToBook?.88:.10;
    }
    return 1;
  }

  function resize(){
    const r=canvas.getBoundingClientRect(); dpr=Math.min(window.devicePixelRatio||1,2); w=r.width; h=r.height;
    canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize',resize); resize();

  function project(n){
    const cy=Math.cos(rotY), sy=Math.sin(rotY), cx=Math.cos(rotX), sx=Math.sin(rotX);
    let x=n.x*cy-n.z*sy; let z=n.x*sy+n.z*cy;
    let y=n.y*cx-z*sx; z=n.y*sx+z*cx;
    const camera=760/zoom; const scale=camera/(camera+z+260);
    return {x:w/2+x*scale,y:h/2+y*scale,z,scale};
  }

  function clear(){ctx.clearRect(0,0,w,h)}
  function hexToRgb(hex){const s=hex.replace('#','');return [parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)]}
  function rgba(hex,a){const [r,g,b]=hexToRgb(hex);return `rgba(${r},${g},${b},${a})`}

  function drawBackground(){
    const grad=ctx.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,Math.max(w,h)*.63);
    grad.addColorStop(0,'rgba(27,93,145,.10)'); grad.addColorStop(.5,'rgba(8,32,60,.04)'); grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(118,174,226,.10)';
    for(let i=0;i<80;i++){
      const x=(i*83.7)%w, y=(i*137.3)%h; const r=((i%4)+1)*.22;
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    }
  }

  function draw(){
    rotX += (targetRotX-rotX)*.10; rotY += (targetRotY-rotY)*.10; zoom += (targetZoom-zoom)*.12;
    clear(); drawBackground();
    const projected=new Map(nodes.map(n=>[n.id,project(n)]));

    links.forEach(l=>{
      const a=byId.get(l.a),b=byId.get(l.b); if(!a||!b)return;
      const aa=visibilityAlpha(a), bb=visibilityAlpha(b); const alpha=Math.min(aa,bb);
      if(alpha<.07)return;
      const pa=projected.get(a.id),pb=projected.get(b.id);
      const highlighted=selected && (selected.id===a.id||selected.id===b.id);
      ctx.strokeStyle=highlighted?'rgba(110,205,255,.42)':`rgba(105,154,202,${.08*alpha})`;
      ctx.lineWidth=highlighted?1.15:.7;
      ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();
    });

    const sorted=nodes.map(n=>({n,p:projected.get(n.id)})).sort((a,b)=>a.p.z-b.p.z);
    hoverNode=null;
    const mx=pointer.x,my=pointer.y;
    sorted.forEach(({n,p})=>{
      const alpha=visibilityAlpha(n); if(alpha<.04)return;
      const baseR=n.radius*p.scale*(n.type==='core'?1.18:1);
      const rr=Math.max(2.6,baseR);
      const isSel=selected?.id===n.id;
      const dx=mx-p.x,dy=my-p.y;
      if(alpha>.3 && Math.hypot(dx,dy)<rr+7) hoverNode=n;

      ctx.beginPath();ctx.arc(p.x,p.y,rr*(isSel?3.2:2.1),0,Math.PI*2);
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rr*(isSel?3.2:2.1));
      g.addColorStop(0,rgba(n.color,.36*alpha));g.addColorStop(.38,rgba(n.color,.12*alpha));g.addColorStop(1,rgba(n.color,0));ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();ctx.arc(p.x,p.y,rr,0,Math.PI*2);ctx.fillStyle=rgba(n.color,(isSel?1:.83)*alpha);ctx.fill();
      if(isSel){ctx.strokeStyle='rgba(255,255,255,.78)';ctx.lineWidth=1.1;ctx.stroke()}

      const showLabel=n.type==='book'||n.type==='core'||isSel||(n.type==='concept'&&p.scale>.82)||(hoverNode?.id===n.id);
      if(showLabel && alpha>.2){
        const fontSize=n.type==='core'?12:n.type==='book'?10:isSel?10:8;
        ctx.font=`${n.type==='core'||n.type==='book'?700:600} ${fontSize}px Inter, system-ui, sans-serif`;
        ctx.textAlign='center';ctx.textBaseline='top';
        ctx.fillStyle=`rgba(220,239,255,${Math.min(1,.52+alpha*.48)})`;
        let label=n.type==='chapter'?`${n.label} · ${n.title}`:n.title;
        if(label.length>34)label=label.slice(0,34)+'…';
        ctx.fillText(label,p.x,p.y+rr+5);
      }
    });
    canvas.style.cursor=dragging?'grabbing':hoverNode?'pointer':'grab';
    requestAnimationFrame(draw);
  }

  const pointer={x:-999,y:-999};
  function localPoint(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
  canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);dragging=true;moved=false;const p=localPoint(e);lastX=p.x;lastY=p.y;pointer.x=p.x;pointer.y=p.y;});
  canvas.addEventListener('pointermove',e=>{const p=localPoint(e);pointer.x=p.x;pointer.y=p.y;if(!dragging)return;const dx=p.x-lastX,dy=p.y-lastY;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;targetRotY+=dx*.006;targetRotX+=dy*.006;targetRotX=Math.max(-1.25,Math.min(1.25,targetRotX));lastX=p.x;lastY=p.y;});
  canvas.addEventListener('pointerup',()=>{if(!moved&&hoverNode){selected=hoverNode;updateDetail()}dragging=false;});
  canvas.addEventListener('pointerleave',()=>{if(!dragging){pointer.x=-999;pointer.y=-999}});
  canvas.addEventListener('wheel',e=>{e.preventDefault();targetZoom*=e.deltaY>0?.91:1.10;targetZoom=Math.max(.62,Math.min(2.3,targetZoom));},{passive:false});

  let lastTouchDistance=null;
  canvas.addEventListener('touchmove',e=>{
    if(e.touches.length===2){
      const a=e.touches[0],b=e.touches[1],dist=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
      if(lastTouchDistance){targetZoom*=dist/lastTouchDistance;targetZoom=Math.max(.62,Math.min(2.3,targetZoom));}
      lastTouchDistance=dist;
    }
  },{passive:true});
  canvas.addEventListener('touchend',()=>lastTouchDistance=null);

  function updateStats(){
    const visible=nodes.filter(n=>visibilityAlpha(n)>.2).length;
    nodeCountEl.textContent=`${nodes.length} nodes`; visibleStatsEl.textContent=`${visible} visible`;
  }

  searchInput.addEventListener('input',()=>{search=searchInput.value.trim().toLowerCase();selected=null;updateDetail();updateStats()});
  resetViewBtn.addEventListener('click',()=>{targetRotX=-.18;targetRotY=.28;targetZoom=1;activeBook='all';search='';searchInput.value='';selected=null;renderFilters();updateDetail();updateStats();activeModeEl.textContent='All Books'});

  const empty=document.getElementById('emptyDetail'),detail=document.getElementById('nodeDetail');
  const detailType=document.getElementById('detailType'),detailBook=document.getElementById('detailBook'),detailKicker=document.getElementById('detailKicker'),detailTitle=document.getElementById('detailTitle'),detailSummary=document.getElementById('detailSummary'),detailConcepts=document.getElementById('detailConcepts'),detailLinks=document.getElementById('detailLinks'),detailAction=document.getElementById('detailAction'),detailActionWrap=document.getElementById('detailActionWrap');

  function bookLabel(book){
    if(book==='concept')return'Cross-book'; if(book==='core')return'6 Books';
    return books.find(b=>b.id===book)?.label || book;
  }
  function selectNode(id){const n=byId.get(id);if(n){selected=n;updateDetail()}}
  window.selectKnowledgeNode=selectNode;

  function updateDetail(){
    if(!selected){empty.hidden=false;detail.hidden=true;return}
    empty.hidden=true;detail.hidden=false;
    detailType.textContent=selected.type.toUpperCase(); detailBook.textContent=bookLabel(selected.book);
    detailBook.style.borderColor=rgba(selected.color,.25);detailBook.style.color=selected.color;
    detailKicker.textContent=selected.label==='◆'?'SHARED CONCEPT':selected.label;
    detailTitle.textContent=selected.title;detailSummary.textContent=selected.summary||'';
    detailConcepts.innerHTML=(selected.concepts||[]).map(c=>`<span>${c}</span>`).join('')||'<span>MyLifeOS</span>';
    const rel=(selected.related||[]).map(id=>byId.get(id)).filter(Boolean).slice(0,12);
    detailLinks.innerHTML=rel.length?rel.map(n=>`<button class="related-node" type="button" data-related="${n.id}"><span>${n.title}</span><span>${bookLabel(n.book)}</span></button>`).join(''):'<span style="font-size:10px;color:#5e7892">No linked nodes</span>';
    detailLinks.querySelectorAll('[data-related]').forEach(btn=>btn.addEventListener('click',()=>selectNode(btn.dataset.related)));
    if(selected.href){detailActionWrap.hidden=false;detailAction.href=selected.href;detailAction.textContent=selected.book==='b2'?'Open Book 02':'Open Book 01'} else {detailActionWrap.hidden=true}
  }

  renderFilters();updateStats();updateDetail();draw();
})();
