(() => {
  const svg = document.getElementById('sixBookGraph');
  const viewport = document.getElementById('graphViewport');
  const searchInput = document.getElementById('graphSearch');
  const resetBtn = document.getElementById('resetGraph');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const viewLabel = document.getElementById('viewLabel');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const NS = 'http://www.w3.org/2000/svg';

  const palette = {
    core:'#6f9ef4', b1:'#f3b65e', b2:'#4fd9ee', b3:'#a46cff',
    b4:'#62d89f', b5:'#f36f91', b6:'#4d9cf5'
  };

  const book1 = [
    ['B1-00','Record','Evidence · Memory'],
    ['B1-01','Charles','Identity · Observer'],
    ['B1-02','Fragmentation','No Master Map'],
    ['B1-03','AI → Mirror','Tool → Mirror'],
    ['B1-04','One Charles','Integration'],
    ['B1-05','Daily Log','Raw Data'],
    ['B1-06','Review','Daily · Weekly · Monthly'],
    ['B1-07','Pattern','Recognition'],
    ['B1-08','Knowledge','Philosophy · Structure'],
    ['B1-09','Perspectives','Personal Map'],
    ['B1-10','Six Domains','Whole Life Map'],
    ['B1-11','Feedback Loop','Data → Action'],
    ['B1-12','Replication','Charles 1.0 → Others'],
    ['B1-13','Origin → Future','Past · Present · Future']
  ];

  const book2 = [
    ['B2-00','Identity Question','Self Observation'],
    ['B2-01','Labels ≠ Me','Values · Traits'],
    ['B2-02','Auto-Pilot','Environment · Habit'],
    ['B2-03','Choice','Responsibility · Attention'],
    ['B2-04','Tool Augmentation','Apps · AI'],
    ['B2-05','System','Raw Data → Action'],
    ['B2-06','Direction','Goals vs Direction'],
    ['B2-07','Small Change','Compounding'],
    ['B2-08','Habit → Identity','Action → Evidence'],
    ['B2-09','Future Trajectory','Who am I becoming?'],
    ['B2-10','MyLifeOS','V1 → V2 → V3'],
    ['B2-11','Become','See → Choose → Act']
  ];

  const books = {
    core:{id:'core',book:'core',x:620,y:425,r:76,title:'MyLifeOS',sub:'· 6 Books ·',cn:'记录 · 认知 · 行动 · 成长',color:palette.core},
    b1:{id:'b1',book:'b1',x:380,y:245,r:55,title:'01 Origin',sub:'起点 · 原点',cn:'Origin Layer',color:palette.b1},
    b2:{id:'b2',book:'b2',x:860,y:245,r:55,title:'02 Who Am I?',sub:'我是谁？',cn:'Identity Layer',color:palette.b2},
    b3:{id:'b3',book:'b3',x:1045,y:450,r:43,title:'03 Birth of',sub:'Life OS',cn:'PENDING',color:palette.b3,pending:true},
    b4:{id:'b4',book:'b4',x:835,y:650,r:43,title:'04 Living With',sub:'MyLifeOS',cn:'PENDING',color:palette.b4,pending:true},
    b5:{id:'b5',book:'b5',x:445,y:650,r:43,title:'05 Beyond',sub:'Myself Growth',cn:'PENDING',color:palette.b5,pending:true},
    b6:{id:'b6',book:'b6',x:195,y:450,r:43,title:'06 Creating',sub:'My Future Self',cn:'PENDING',color:palette.b6,pending:true}
  };

  const nodes = [];
  const edges = [];
  const byId = new Map();
  const nodeEls = new Map();
  const edgeEls = [];

  const addNode = n => { nodes.push(n); byId.set(n.id,n); };
  const addEdge = (a,b,type='chapter',label='') => edges.push({a,b,type,label});

  Object.values(books).forEach(addNode);

  function placeRadial(list, bookId, cx, cy, radius, startDeg, endDeg, color, side){
    list.forEach((item,i)=>{
      const t = list.length === 1 ? .5 : i/(list.length-1);
      const deg = startDeg + (endDeg-startDeg)*t;
      const a = deg*Math.PI/180;
      const x = cx + Math.cos(a)*radius;
      const y = cy + Math.sin(a)*radius;
      addNode({id:item[0],book:bookId,type:'chapter',x,y,r:7.2,label:item[1],key:item[2],color,side});
      addEdge(bookId,item[0],'chapter');
      if(i>0) addEdge(list[i-1][0],item[0],'chapter');
    });
  }

  placeRadial(book1,'b1',books.b1.x,books.b1.y,145,112,248,palette.b1,'left');
  placeRadial(book2,'b2',books.b2.x,books.b2.y,145,-68,68,palette.b2,'right');

  // Core book structure.
  ['b1','b2','b3','b4','b5','b6'].forEach(id=>addEdge('core',id,'core'));
  addEdge('b1','b2','cross','Origin → Identity');
  addEdge('b2','b3','cross','Identity → System');
  addEdge('b3','b4','pending','System → Living');
  addEdge('b4','b5','pending','Living → Beyond');
  addEdge('b5','b6','pending','Beyond → Future');
  addEdge('b6','b1','pending','Future ↔ Origin');

  // Book 1 ↔ Book 2: real continuity.
  addEdge('B1-01','B2-00','cross','Charles → Who Am I?');
  addEdge('B1-04','B2-01','cross','One Charles → Identity');
  addEdge('B1-07','B2-02','cross','Pattern → Auto-Pilot');
  addEdge('B1-11','B2-05','cross','Feedback Loop → System');
  addEdge('B1-13','B2-09','cross','Future Seed → Trajectory');

  // Reserved cross-book bridge positions — no invented chapters for Books 3–6.
  addEdge('B2-10','b3','cross','V1 · V2 · V3 → Birth');
  addEdge('B1-10','b4','pending','Six Domains → Living');
  addEdge('B1-12','b5','pending','Replication → Beyond');
  addEdge('B2-09','b6','pending','Trajectory → Future Self');

  function el(name,attrs={},text=''){
    const e=document.createElementNS(NS,name);
    Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));
    if(text) e.textContent=text;
    return e;
  }

  function makeDefs(){
    const defs=el('defs');
    const filter=el('filter',{id:'glow',x:'-120%',y:'-120%',width:'340%',height:'340%'});
    filter.appendChild(el('feGaussianBlur',{stdDeviation:'5',result:'coloredBlur'}));
    const merge=el('feMerge');
    merge.appendChild(el('feMergeNode',{in:'coloredBlur'}));
    merge.appendChild(el('feMergeNode',{in:'SourceGraphic'}));
    filter.appendChild(merge);
    defs.appendChild(filter);
    svg.appendChild(defs);
  }

  function pathFor(a,b,type){
    if(type==='chapter') return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
    const mx=(a.x+b.x)/2;
    const lift=type==='core'?0:Math.min(65,Math.abs(b.x-a.x)*.10+25);
    return `M ${a.x} ${a.y} Q ${mx} ${Math.min(a.y,b.y)-lift} ${b.x} ${b.y}`;
  }

  function drawEdge(edge,layer){
    const a=byId.get(edge.a),b=byId.get(edge.b); if(!a||!b) return;
    const p=el('path',{class:`graph-edge ${edge.type}`,d:pathFor(a,b,edge.type),'data-a':edge.a,'data-b':edge.b});
    layer.appendChild(p);edgeEls.push(p);
    if(edge.label && (edge.type==='cross' || edge.type==='pending')){
      const mx=(a.x+b.x)/2;
      const my=(a.y+b.y)/2-8;
      const t=el('text',{class:'cross-caption',x:mx,y:my,'text-anchor':'middle'},edge.label);
      t.dataset.a=edge.a;t.dataset.b=edge.b;layer.appendChild(t);
    }
  }

  function textLine(g,cls,y,text){g.appendChild(el('text',{class:cls,x:0,y,'text-anchor':'middle'},text));}

  function drawBookNode(n,layer){
    const g=el('g',{class:`book-core ${n.pending?'pending-core':''}`,'data-id':n.id,transform:`translate(${n.x} ${n.y})`});
    g.appendChild(el('circle',{class:'ring',r:n.r+9,stroke:n.color,'stroke-width':1.1}));
    g.appendChild(el('circle',{r:n.r,fill:n.pending?'rgba(255,255,255,.025)':n.color,stroke:n.color,opacity:n.id==='core'?.94:.82}));
    if(n.id==='core'){
      textLine(g,'core-title',-6,n.title);
      textLine(g,'core-title',15,n.sub);
      textLine(g,'core-sub',35,n.cn);
      g.classList.add('core-node');
    }else{
      textLine(g,'book-num',-9,n.title);
      textLine(g,'book-title',7,n.sub);
      textLine(g,'book-cn',24,n.cn);
      if(n.pending) g.appendChild(el('text',{class:'pending-label',x:0,y:n.r+22},'CONTENT TO ADD LATER'));
    }
    g.addEventListener('click',e=>{e.stopPropagation();selectNode(n.id)});
    layer.appendChild(g);nodeEls.set(n.id,g);
  }

  function drawChapterNode(n,layer){
    const g=el('g',{class:'chapter-node','data-id':n.id,transform:`translate(${n.x} ${n.y})`});
    g.appendChild(el('circle',{r:n.r,fill:n.color,opacity:.95}));
    const left=n.side==='left';
    const x=left?-13:13;
    const anchor=left?'end':'start';
    g.appendChild(el('text',{class:'chapter-id',x,y:-10,'text-anchor':anchor},n.id));
    g.appendChild(el('text',{class:'chapter-label',x,y:1,'text-anchor':anchor},n.label));
    g.appendChild(el('text',{class:'chapter-key',x,y:13,'text-anchor':anchor},n.key));
    g.addEventListener('click',e=>{e.stopPropagation();selectNode(n.id)});
    layer.appendChild(g);nodeEls.set(n.id,g);
  }

  function drawClusterLabels(layer){
    layer.appendChild(el('text',{class:'cluster-label',x:278,y:62},'BOOK 01 · 14 CHAPTER KEY NODES'));
    layer.appendChild(el('text',{class:'cluster-label',x:790,y:62},'BOOK 02 · 12 CHAPTER KEY NODES'));
    layer.appendChild(el('text',{class:'cluster-label',x:925,y:790},'BOOK 03–06 · STRUCTURE RESERVED / PENDING'));
  }

  function render(){
    svg.innerHTML='';edgeEls.length=0;nodeEls.clear();
    makeDefs();
    const edgeLayer=el('g',{id:'edgeLayer'});svg.appendChild(edgeLayer);
    edges.forEach(e=>drawEdge(e,edgeLayer));
    const nodeLayer=el('g',{id:'nodeLayer'});svg.appendChild(nodeLayer);
    drawClusterLabels(nodeLayer);
    Object.values(books).forEach(n=>drawBookNode(n,nodeLayer));
    nodes.filter(n=>n.type==='chapter').forEach(n=>drawChapterNode(n,nodeLayer));
  }

  let selected='';
  let activeFilter='all';

  function relatedTo(id){
    const set=new Set([id]);
    edges.forEach(e=>{if(e.a===id)set.add(e.b);if(e.b===id)set.add(e.a)});
    return set;
  }

  function applyVisibility(){
    const keep = selected ? relatedTo(selected) : null;
    nodeEls.forEach((g,id)=>{
      const n=byId.get(id);
      let dim=false;
      if(activeFilter!=='all'){
        const belongs=n.book===activeFilter || id===activeFilter || id==='core';
        const cross=edges.some(e=>(e.a===id||e.b===id) && (e.a===activeFilter||e.b===activeFilter));
        dim=!belongs && !cross;
      }
      if(keep && !keep.has(id)) dim=true;
      g.classList.toggle('dim',dim);
      g.classList.toggle('active',id===selected);
    });
    edgeEls.forEach(p=>{
      const a=p.dataset.a,b=p.dataset.b;
      let dim=false;
      if(activeFilter!=='all'){
        const na=byId.get(a),nb=byId.get(b);
        dim=!(na?.book===activeFilter || nb?.book===activeFilter || a===activeFilter || b===activeFilter || a==='core' || b==='core');
      }
      if(selected) dim=!(a===selected||b===selected);
      p.classList.toggle('dim',dim);
      p.classList.toggle('active',selected && (a===selected||b===selected));
    });
  }

  function selectNode(id){selected=selected===id?'':id;applyVisibility();}
  svg.addEventListener('click',()=>{selected='';applyVisibility()});

  filterButtons.forEach(btn=>btn.addEventListener('click',()=>{
    activeFilter=btn.dataset.filter;
    selected='';
    filterButtons.forEach(b=>b.classList.toggle('active',b===btn));
    const labels={all:'全部书籍',b1:'01 Origin',b2:'02 Who Am I?',b3:'03 Pending',b4:'04 Pending',b5:'05 Pending',b6:'06 Pending'};
    viewLabel.textContent=labels[activeFilter]||'全部书籍';
    applyVisibility();
  }));

  function applySearch(){
    const q=searchInput.value.trim().toLowerCase();
    nodeEls.forEach((g,id)=>{
      g.classList.remove('search-hit');
      if(!q)return;
      const n=byId.get(id);
      const hay=[id,n?.title,n?.sub,n?.cn,n?.label,n?.key].filter(Boolean).join(' ').toLowerCase();
      if(hay.includes(q))g.classList.add('search-hit');
    });
  }
  searchInput.addEventListener('input',applySearch);
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();searchInput.focus();}
  });

  let scale=1,tx=0,ty=0,dragging=false,lastX=0,lastY=0;
  function applyTransform(){svg.style.transform=`translate(${tx}px,${ty}px) scale(${scale})`;}
  function reset(){scale=1;tx=0;ty=0;applyTransform();selected='';activeFilter='all';filterButtons.forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));viewLabel.textContent='全部书籍';applyVisibility();}
  function zoom(factor){scale=Math.max(.62,Math.min(2.2,scale*factor));applyTransform();}
  resetBtn.addEventListener('click',reset);zoomInBtn.addEventListener('click',()=>zoom(1.12));zoomOutBtn.addEventListener('click',()=>zoom(.89));
  viewport.addEventListener('pointerdown',e=>{dragging=true;viewport.classList.add('dragging');lastX=e.clientX;lastY=e.clientY;viewport.setPointerCapture(e.pointerId)});
  viewport.addEventListener('pointermove',e=>{if(!dragging)return;tx+=e.clientX-lastX;ty+=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;applyTransform()});
  viewport.addEventListener('pointerup',()=>{dragging=false;viewport.classList.remove('dragging')});
  viewport.addEventListener('pointercancel',()=>{dragging=false;viewport.classList.remove('dragging')});
  viewport.addEventListener('wheel',e=>{e.preventDefault();const old=scale;scale=Math.max(.62,Math.min(2.2,scale*(e.deltaY>0?.92:1.08)));const r=viewport.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;tx=mx-(mx-tx)*(scale/old);ty=my-(my-ty)*(scale/old);applyTransform()},{passive:false});

  render();
  applyVisibility();
})();
