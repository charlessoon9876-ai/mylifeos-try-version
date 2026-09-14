(() => {
  const svg = document.getElementById('mindMap');
  const viewport = document.getElementById('mapViewport');
  const fitBtn = document.getElementById('fitView');
  const NS = 'http://www.w3.org/2000/svg';

  const colors = { b1:'#5bbcff', b2:'#9684ff', b3:'#3bd8bc', b4:'#ffb261', b5:'#ef75b9', b6:'#ffd36b', hub:'#dff6ff' };

  const books = [
    {id:'b1', x:30, y:35, w:660, h:510, title:'01 · ORIGIN', sub:'Origin Layer · 看见人生', color:colors.b1},
    {id:'b2', x:720, y:35, w:660, h:510, title:'02 · WHO AM I?', sub:'Identity Layer · 看见自己', color:colors.b2},
    {id:'b3', x:1410, y:35, w:360, h:245, title:'03 · BIRTH OF LIFE OS', sub:'System Layer · 建立系统', color:colors.b3, pending:true},
    {id:'b4', x:1800, y:35, w:360, h:245, title:'04 · LIVING WITH MYLIFEOS', sub:'Application Layer · 活进现实', color:colors.b4, pending:true},
    {id:'b5', x:1410, y:310, w:360, h:235, title:'05 · BEYOND MYSELF', sub:'Growth / Academy · 走向他人', color:colors.b5, pending:true},
    {id:'b6', x:1800, y:310, w:360, h:235, title:'06 · CREATING MY FUTURE SELF', sub:'Future Layer · 创造未来', color:colors.b6, pending:true}
  ];

  const b1 = [
    ['B1-00','Record','Evidence · Memory'],['B1-01','Charles','Identity · Observer'],['B1-02','Fragmentation','No Master Map'],['B1-03','AI → Mirror','Tool becomes Mirror'],
    ['B1-04','One Charles','Integration'],['B1-05','Daily Log','Raw Data'],['B1-06','Review','Daily · Weekly · Monthly'],['B1-07','Pattern','Recognition'],
    ['B1-08','Knowledge','Philosophy · Structure'],['B1-09','Perspectives','Personal Map'],['B1-10','Six Domains','Whole Life Map'],['B1-11','Feedback Loop','Data → Action'],
    ['B1-12','Replication','Charles 1.0 → Others'],['B1-13','Origin → Future','Past · Present · Future']
  ];
  const b2 = [
    ['B2-00','Identity Question','Self Observation'],['B2-01','Labels ≠ Me','Values · Traits'],['B2-02','Auto-Pilot','Environment · Habit'],['B2-03','Choice','Responsibility · Attention'],
    ['B2-04','Tool Augmentation','Apps · AI'],['B2-05','System','Raw Data → Action'],['B2-06','Direction','Goals vs Direction'],['B2-07','Small Change','Compounding'],
    ['B2-08','Habit → Identity','Action → Evidence'],['B2-09','Future Trajectory','Who am I becoming?'],['B2-10','MyLifeOS','V1 → V2 → V3'],['B2-11','Become','See → Choose → Act']
  ];

  const nodes = [];
  const edges = [];
  const nodeById = new Map();

  function addNode(n){ nodes.push(n); nodeById.set(n.id,n); }
  function addEdge(a,b,type='main',label=''){ edges.push({a,b,type,label}); }

  function layoutChapters(bookId, arr, originX, originY, cols, gapX, gapY, color){
    arr.forEach((it,i)=>{
      const col=i%cols, row=Math.floor(i/cols);
      addNode({id:it[0], book:bookId, x:originX+col*gapX, y:originY+row*gapY, r:8, label:it[1], key:it[2], color});
      if(i>0) addEdge(arr[i-1][0],it[0],'main');
    });
  }

  layoutChapters('b1',b1,105,155,2,300,54,colors.b1);
  layoutChapters('b2',b2,795,155,2,300,60,colors.b2);

  [
    ['B3-H','b3',1590,145,'System Architecture','Pending chapters',colors.b3],
    ['B4-H','b4',1980,145,'Real-Life Validation','Pending chapters',colors.b4],
    ['B5-H','b5',1590,420,'Academy / Growth','Pending chapters',colors.b5],
    ['B6-H','b6',1980,420,'Future Self Design','Pending chapters',colors.b6]
  ].forEach(n=>addNode({id:n[0],book:n[1],x:n[2],y:n[3],r:12,label:n[4],key:n[5],color:n[6],pending:true}));

  const hubs = [
    ['H-RECORD',420,665,'Record','Evidence begins'],['H-REVIEW',650,665,'Review','Facts → reflection'],['H-PATTERN',880,665,'Pattern','Repeated truth'],
    ['H-IDENTITY',1110,665,'Identity','Evidence → self'],['H-SYSTEM',1340,665,'MyLifeOS','V1 → V2 → V3'],['H-ACTION',1570,665,'Action','System enters life'],
    ['H-ACADEMY',1800,665,'Beyond Self','Replicate method'],['H-FUTURE',2030,665,'Future Self','Design forward']
  ];
  hubs.forEach(h=>addNode({id:h[0],book:'hub',x:h[1],y:h[2],r:13,label:h[3],key:h[4],color:colors.hub,hub:true}));
  for(let i=1;i<hubs.length;i++) addEdge(hubs[i-1][0],hubs[i][0],'bridge');

  addEdge('B1-00','H-RECORD','cross'); addEdge('B1-05','H-RECORD','cross');
  addEdge('B1-06','H-REVIEW','cross'); addEdge('B1-07','H-PATTERN','cross');
  addEdge('B1-01','H-IDENTITY','cross'); addEdge('B1-11','H-SYSTEM','cross');
  addEdge('B1-12','H-ACADEMY','cross'); addEdge('B1-13','H-FUTURE','cross');

  addEdge('B2-00','H-IDENTITY','cross'); addEdge('B2-01','H-IDENTITY','cross'); addEdge('B2-08','H-IDENTITY','cross');
  addEdge('B2-05','H-SYSTEM','cross'); addEdge('B2-10','H-SYSTEM','cross');
  addEdge('B2-03','H-ACTION','cross'); addEdge('B2-07','H-ACTION','cross'); addEdge('B2-11','H-ACTION','cross');
  addEdge('B2-06','H-FUTURE','cross'); addEdge('B2-09','H-FUTURE','cross');

  addEdge('B1-01','B2-00','cross','Who is Charles?');
  addEdge('B1-04','B2-01','cross','One Charles → Identity');
  addEdge('B1-07','B2-02','cross','Pattern → Auto-Pilot');
  addEdge('B1-11','B2-05','cross','Feedback Loop → System');
  addEdge('B1-13','B2-09','cross','Future seed → Trajectory');
  addEdge('B2-10','B3-H','bridge','Self understanding → System');
  addEdge('B3-H','B4-H','bridge','System → Real life');
  addEdge('B4-H','B5-H','bridge','Validation → Replication');
  addEdge('B5-H','B6-H','bridge','Beyond self → Future');
  addEdge('B2-09','B6-H','cross','Trajectory → Created Future');
  addEdge('B1-10','B4-H','cross','Six Domains → Living');
  addEdge('B1-12','B5-H','cross','Replication → Academy');

  function el(name,attrs={},text=''){
    const e=document.createElementNS(NS,name); Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v)); if(text)e.textContent=text; return e;
  }

  const defs=el('defs');
  const filter=el('filter',{id:'glow',x:'-100%',y:'-100%',width:'300%',height:'300%'});
  filter.appendChild(el('feGaussianBlur',{stdDeviation:'4',result:'blur'}));
  const merge=el('feMerge'); merge.appendChild(el('feMergeNode',{in:'blur'})); merge.appendChild(el('feMergeNode',{in:'SourceGraphic'})); filter.appendChild(merge); defs.appendChild(filter); svg.appendChild(defs);

  const zones=el('g');
  books.forEach(b=>{
    const g=el('g',{class:'book-zone',id:`zone-${b.id}`});
    g.appendChild(el('rect',{class:'book-zone-bg',x:b.x,y:b.y,width:b.w,height:b.h,rx:18}));
    g.appendChild(el('rect',{x:b.x,y:b.y,width:5,height:b.h,rx:3,fill:b.color,opacity:.72}));
    g.appendChild(el('text',{class:'book-title',x:b.x+28,y:b.y+42,fill:b.color},b.title));
    g.appendChild(el('text',{class:'book-subtitle',x:b.x+28,y:b.y+64},b.sub));
    if(b.pending){
      g.appendChild(el('text',{class:'pending-title',x:b.x+28,y:b.y+105},'STRUCTURE RESERVED'));
      g.appendChild(el('text',{class:'pending-copy',x:b.x+28,y:b.y+127},'章节内容待补充 · 只保留跨书承接位置'));
    }
    zones.appendChild(g);
  });
  svg.appendChild(zones);

  const edgeLayer=el('g',{id:'edgeLayer'}); svg.appendChild(edgeLayer);
  const nodeLayer=el('g',{id:'nodeLayer'}); svg.appendChild(nodeLayer);

  function edgePath(a,b,type){
    const dx=b.x-a.x;
    if(type==='main') return `M ${a.x} ${a.y} C ${a.x+dx*.45} ${a.y}, ${b.x-dx*.45} ${b.y}, ${b.x} ${b.y}`;
    const lift=Math.max(45,Math.min(160,Math.abs(dx)*.18+Math.abs(b.y-a.y)*.08));
    const midY=Math.min(a.y,b.y)-lift;
    return `M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
  }

  const edgeEls=[];
  edges.forEach(ed=>{
    const a=nodeById.get(ed.a),b=nodeById.get(ed.b); if(!a||!b)return;
    const p=el('path',{class:`edge ${ed.type}`,d:edgePath(a,b,ed.type),'data-a':ed.a,'data-b':ed.b});
    edgeLayer.appendChild(p); edgeEls.push(p);
    if(ed.label){
      const mx=(a.x+b.x)/2, my=Math.min(a.y,b.y)-18;
      edgeLayer.appendChild(el('text',{class:'chain-label',x:mx,y:my,'text-anchor':'middle'},ed.label));
    }
  });

  const nodeEls=new Map();
  nodes.forEach(n=>{
    const g=el('g',{class:`node ${n.hub?'hub-node':''} ${n.pending?'pending-node':''}`,'data-id':n.id,transform:`translate(${n.x} ${n.y})`});
    g.appendChild(el('circle',{r:n.r,fill:n.hub?colors.hub:n.pending?'rgba(255,255,255,.02)':n.color,opacity:n.hub?1:.92}));
    if(!n.hub && !n.pending) g.appendChild(el('text',{class:'node-id',x:17,y:-8},n.id));
    g.appendChild(el('text',{class:'node-label',x:17,y:4},n.label));
    g.appendChild(el('text',{class:'node-key',x:17,y:18},n.key));
    g.addEventListener('click',e=>{e.stopPropagation();highlight(n.id)});
    nodeLayer.appendChild(g); nodeEls.set(n.id,g);
  });

  function highlight(id){
    const connected=new Set([id]);
    edges.forEach(ed=>{if(ed.a===id)connected.add(ed.b);if(ed.b===id)connected.add(ed.a)});
    nodeEls.forEach((g,nid)=>{g.classList.toggle('active',nid===id);g.classList.toggle('dim',!connected.has(nid));});
    edgeEls.forEach(p=>{const on=p.dataset.a===id||p.dataset.b===id;p.classList.toggle('active',on);p.classList.toggle('dim',!on);});
  }
  svg.addEventListener('click',()=>{nodeEls.forEach(g=>g.classList.remove('active','dim'));edgeEls.forEach(p=>p.classList.remove('active','dim'));});

  let scale=1, tx=0, ty=0, dragging=false, lx=0,ly=0;
  function apply(){svg.style.transform=`translate(${tx}px,${ty}px) scale(${scale})`}
  function fit(){scale=1;tx=0;ty=0;apply()}
  fitBtn.addEventListener('click',fit);
  viewport.addEventListener('pointerdown',e=>{dragging=true;viewport.classList.add('dragging');lx=e.clientX;ly=e.clientY;viewport.setPointerCapture(e.pointerId)});
  viewport.addEventListener('pointermove',e=>{if(!dragging)return;tx+=e.clientX-lx;ty+=e.clientY-ly;lx=e.clientX;ly=e.clientY;apply()});
  viewport.addEventListener('pointerup',()=>{dragging=false;viewport.classList.remove('dragging')});
  viewport.addEventListener('wheel',e=>{e.preventDefault();const old=scale;scale=Math.max(.55,Math.min(2.25,scale*(e.deltaY>0?.92:1.08)));const r=viewport.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;tx=mx-(mx-tx)*(scale/old);ty=my-(my-ty)*(scale/old);apply()},{passive:false});
})();
