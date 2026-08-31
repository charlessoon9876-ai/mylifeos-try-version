const translations={
  zh:{listen:'听这一页',share:'分享',heroTitle:'我开始记录人生，后来发现了一个系统。',heroSub:'这是 Charles 如何从零散的人生记录、每日复盘与 AI 对话，一步一步走到 My Life OS 的真实起点。',startReading:'开始阅读',supportJourney:'支持这段旅程',heroNote:'免费阅读 · 多语言 · 可听书 · 持续更新',manifesto:'“我最初开始记录人生，只是不想让自己的人生就这样过去。后来我才发现，当一个人能够看见自己的人生，他就有机会重新设计自己的人生。”',contentsLabel:'CONTENTS',contentsTitle:'从人生碎片，到 My Life OS',readLabel:'已阅读',flowTitle:'My Life OS 不是先设计出来的，而是从生活里长出来的。',flow1:'经历人生',flow2:'记录 Raw Data',flow3:'每日 / 每周复盘',flow4:'看见规律',flow5:'形成六大领域',flow6:'成为 My Life OS',supportLabel:'SUPPORT THE JOURNEY',supportTitle:'如果这个故事对你有价值，你可以支持 My Life OS 继续发展。',supportText:'你的支持会帮助我继续整理这本书、制作多语言版本、声音说书，以及一步一步建立 My Life OS。',supportNote:'目前先建立网站雏形。正式支付链接会在下一阶段接入。',tier1:'I support the idea',tier10:'I support the work',tier100:'I believe in the journey',back:'返回目录',listenChapter:'听本章',markRead:'标记已读',previous:'上一章',next:'下一章',footerText:'一个真实人生，如何慢慢形成一个可以被理解、被复盘、被升级的系统。',coming:'支付功能会在下一阶段接入。',shared:'分享链接已复制。',readDone:'已标记为已读'},
  en:{listen:'Listen',share:'Share',heroTitle:'I started by recording my life. Then I discovered a system.',heroSub:'The true story of how Charles moved from scattered life records, daily reflection and AI conversations toward the beginnings of My Life OS.',startReading:'Start reading',supportJourney:'Support the journey',heroNote:'Free to read · Multilingual · Audio enabled · Continuously updated',manifesto:'“I began recording my life because I did not want it to simply pass. Later I discovered that when a person can see their life clearly, they gain the chance to redesign it.”',contentsLabel:'CONTENTS',contentsTitle:'From life fragments to My Life OS',readLabel:'read',flowTitle:'My Life OS was not designed first. It grew out of real life.',flow1:'Live the experience',flow2:'Capture raw data',flow3:'Daily / weekly review',flow4:'See the patterns',flow5:'Form six domains',flow6:'Become My Life OS',supportLabel:'SUPPORT THE JOURNEY',supportTitle:'If this story creates value for you, you can help My Life OS keep growing.',supportText:'Your support helps me continue developing the book, translations, audio narration and the My Life OS journey.',supportNote:'This is the first website prototype. Payment links will be connected in the next stage.',tier1:'I support the idea',tier10:'I support the work',tier100:'I believe in the journey',back:'Back to contents',listenChapter:'Listen',markRead:'Mark as read',previous:'Previous',next:'Next',footerText:'A real life slowly becoming a system that can be understood, reviewed and upgraded.',coming:'Payment will be connected in the next stage.',shared:'Share link copied.',readDone:'Marked as read'},
  ms:{listen:'Dengar',share:'Kongsi',heroTitle:'Saya mula merekod kehidupan saya. Kemudian saya menemui satu sistem.',heroSub:'Kisah sebenar bagaimana Charles bergerak daripada catatan hidup yang berselerak, refleksi harian dan perbualan AI menuju kepada kelahiran My Life OS.',startReading:'Mula membaca',supportJourney:'Sokong perjalanan ini',heroNote:'Percuma · Pelbagai bahasa · Audio · Dikemas kini berterusan',manifesto:'“Saya mula merekod kehidupan kerana saya tidak mahu hidup berlalu begitu sahaja. Kemudian saya sedar, apabila seseorang benar-benar dapat melihat kehidupannya, dia mempunyai peluang untuk mereka bentuknya semula.”',contentsLabel:'KANDUNGAN',contentsTitle:'Daripada serpihan kehidupan kepada My Life OS',readLabel:'dibaca',flowTitle:'My Life OS tidak direka terlebih dahulu. Ia tumbuh daripada kehidupan sebenar.',flow1:'Jalani kehidupan',flow2:'Rekod data mentah',flow3:'Semakan harian / mingguan',flow4:'Lihat corak',flow5:'Bentuk enam domain',flow6:'Menjadi My Life OS',supportLabel:'SOKONG PERJALANAN',supportTitle:'Jika kisah ini memberi nilai kepada anda, anda boleh menyokong perkembangan My Life OS.',supportText:'Sokongan anda membantu saya meneruskan buku, terjemahan, audio dan pembangunan My Life OS.',supportNote:'Ini ialah prototaip laman pertama. Pautan pembayaran akan disambungkan pada fasa seterusnya.',tier1:'I support the idea',tier10:'I support the work',tier100:'I believe in the journey',back:'Kembali',listenChapter:'Dengar bab',markRead:'Tanda dibaca',previous:'Sebelumnya',next:'Seterusnya',footerText:'Sebuah kehidupan sebenar yang perlahan-lahan menjadi sistem untuk difahami, disemak dan ditambah baik.',coming:'Pembayaran akan disambungkan pada fasa seterusnya.',shared:'Pautan telah disalin.',readDone:'Ditanda sebagai dibaca'}
};

const chapterContent={
  zh:[
    ['序章','为什么我开始记录自己的人生','我不想让人生只是发生，然后消失。记录，成为我重新看见自己的第一步。','工作、家庭、健康、金钱、责任与想法每天同时发生。最初，我只是想把这些东西留下来。\n\n后来我发现，记录并不只是保存记忆。它开始帮助我回看选择、看见重复出现的问题，也让我第一次能够把过去、现在与未来放在同一张图里。'],
    ['第一章','Charles 是谁？','在系统出现之前，先认识这个正在寻找答案的人。','这不是一个专家先设计系统，再拿到生活里测试的故事。相反，它从一个普通人的真实生活开始。\n\n我有工作、家庭、压力、目标，也有许多还没有完成的事情。My Life OS 的起点，就是先诚实地看见这个真实的自己。'],
    ['第二章','系统出现之前的人生','事情很多，但彼此没有真正连接起来。','健康是一件事，工作是一件事，家庭又是另一件事。金钱、学习、生活方式也各自占据注意力。\n\n问题不是我没有努力，而是这些努力长期分散。系统出现之前，我缺少的不是更多任务，而是一种把人生放在一起理解的方法。'],
    ['第三章','我第一次遇见 ChatGPT','AI 最初只是工具，后来慢慢变成一面镜子。','一开始，我像很多人一样，把 ChatGPT 当成问答工具。问问题、改文字、处理工作。\n\n但当对话越来越多，我开始发现：如果我持续把真实生活放进去，AI 可以帮助我整理那些自己很难长期记住和连接起来的信息。'],
    ['第四章','从两个 GPT 到一个完整的我','个人账号与工作账号，最后开始汇合。','我曾经把个人生活和工作记录放在不同的 GPT 里。这样很整齐，却也把同一个人切成了两半。\n\n后来随着使用方式升级，我逐渐意识到：真正的 Life OS 不应该只懂我的工作，也不应该只懂我的家庭。它必须能够看见完整的我。'],
    ['第五章','我开始记录自己的人生','Daily Log 让生活第一次成为可以回看的 Raw Data。','起床、运动、饮食、客户、决定、家庭对话、花费、情绪与想法，都可以成为记录。\n\n这些看似微小的内容，累积起来以后，不再只是日记，而是一套属于我自己的生命数据。'],
    ['第六章','记录开始变成复盘','从“发生了什么”走向“为什么会这样”。','Daily Log 解决的是记住。Daily Review 开始解决理解。Weekly Review 与 Monthly Review 则开始帮助我看见趋势。\n\n记录让我拥有证据，复盘让我拥有判断。两者结合以后，生活第一次开始有反馈回路。'],
    ['第七章','我第一次看见人生的规律','当记录累积，规律开始浮现。','有些问题不是偶然，有些进步也不是运气。睡眠会影响精神，工作压力会影响家庭，收入提升会改变选择，运动会影响自信。\n\n人生各个部分原来不是独立的。它们一直互相影响，只是过去我没有足够清楚地看见。'],
    ['第八章','我开始寻找人生的完整答案','我从经典、管理学、哲学与健康体系寻找答案。','《道德经》、《心经》、《金刚经》、《孙子兵法》、德鲁克、《黄帝内经》……每一种思想都给了我不同的启发。\n\n它们帮助我看得更深，但也让我开始产生一个新的问题：有没有一种方法，可以把这些不同的人生智慧放在同一个系统里？'],
    ['第九章','为什么每一本书都只解释了一部分人生？','每一套智慧都很强，但往往只照亮一部分。','管理学可以解释组织，医学可以解释身体，哲学可以解释意义，财务知识可以解释金钱。\n\n但真实人生不会分科发生。一个决定往往同时影响健康、财富、事业、家庭、成长与生活。于是，我开始需要一个更完整的框架。'],
    ['第十章','六大人生领域出现了','Health · Wealth · Career · Family · Growth · Lifestyle','六大领域不是为了把人生再次切碎，而是为了让我看清楚：现在到底哪些部分正在进步，哪些部分被忽略。\n\n当它们放在同一个画面里，我第一次能够讨论“整体人生的平衡与升级”。'],
    ['第十一章','My Life OS 开始成形','Raw Data → Review → Insight → Action → Improvement','到这里，我才真正意识到自己做的已经不只是记录。\n\n生活提供 Raw Data，复盘提炼 Insight，Insight 带来 Action，而行动又产生新的数据。这个循环开始像一个真正的操作系统。'],
    ['第十二章','从我的人生，走向一个可以复制的系统','如果一个人可以被系统帮助，下一步就是验证它能否帮助更多人。','My Life OS 先服务 Charles，才有资格讨论服务别人。\n\nBook 1 记录的不是一个已经完成的答案，而是一个系统如何从真实生活中诞生。下一步，是继续验证、简化、复制，并让更多人能够建立自己的 Life OS。']
  ],
  en:[],ms:[]
};

chapterContent.en=chapterContent.zh.map(([k,t,i,b],idx)=>[
  idx===0?'Prologue':`Chapter ${idx}`,
  ['Why I Started Recording My Life','Who Is Charles?','Life Before the System','The First Time I Met ChatGPT','From Two GPTs to One Complete Me','I Started Recording My Life','Recording Became Review','The First Time I Saw the Patterns','Searching for a Complete Answer to Life','Why Every Book Explains Only Part of Life','The Six Life Domains Appeared','My Life OS Began to Take Shape','From My Life to a Repeatable System'][idx],
  ['I did not want life to simply happen and disappear. Recording became the first way I could see myself again.','Before the system, meet the person who was searching for answers.','There was a lot happening, but almost nothing was truly connected.','AI began as a tool and gradually became a mirror.','Personal life and work were separated, until I realized the system needed to see the whole person.','Daily Log turned ordinary life into reviewable raw data.','I moved from “what happened” toward “why did it happen?”','As records accumulated, patterns began to emerge.','I searched across philosophy, management, health and classical wisdom.','Every framework was powerful, but usually illuminated only one part of life.','Health · Wealth · Career · Family · Growth · Lifestyle','Raw Data → Review → Insight → Action → Improvement','If a system can help one real person, the next question is whether it can help others.'][idx],
  ['Work, family, health, money, responsibility and ideas all happened at once. At first I simply wanted to preserve them.\n\nThen I discovered that recording was not only about memory. It helped me revisit choices, notice repeated problems, and place past, present and future on the same map.','This is not a story about an expert who designed a system first and then tested it on life. It begins with the opposite: a real person, living a normal life.\n\nMy Life OS started with the decision to see that real person clearly.','Health was one thing, work another, family another. Money, learning and lifestyle all competed for attention.\n\nThe problem was not a lack of effort. The problem was fragmentation.','At first I used ChatGPT for questions, writing and work.\n\nAs the conversations grew, I realized that consistent life input could help AI organize information I could never connect reliably on my own.','I once separated personal and work life into different GPT spaces. It was tidy, but it also split one human being into two.\n\nA real Life OS had to understand the whole person.','Wake-up time, exercise, food, clients, decisions, family conversations, spending and ideas all became records.\n\nOver time these small entries formed a personal body of life data.','Daily Log helped me remember. Daily Review helped me understand. Weekly and Monthly Review helped me see direction.\n\nRecording created evidence; review created judgment. Together they formed a feedback loop.','Some problems were not random, and some improvements were not luck. Sleep affected energy. Work pressure affected family. Exercise affected confidence.\n\nThe domains of life had always influenced one another; I simply had not seen it clearly enough.','Taoist thought, Buddhist texts, Sun Tzu, Drucker, traditional health systems and other frameworks all gave me different lenses.\n\nThey also raised a new question: could these different forms of wisdom live inside one life system?','Management explains organizations. Medicine explains the body. Philosophy explains meaning. Finance explains money.\n\nBut real life does not happen in separate subjects. One decision can affect every domain at once.','The six domains were not created to fragment life again. They were created to reveal what was growing and what was being ignored.\n\nFor the first time I could talk about the balance and upgrading of a whole life.','At this point I realized I was no longer simply keeping records.\n\nLife produced raw data, reviews produced insight, insight produced action, and action produced new data. It began to behave like an operating system.','My Life OS had to serve Charles before it could claim to serve anyone else.\n\nBook 1 is not the story of a finished answer. It is the story of how a system was born from real life—and where the next experiment begins.'][idx]
]);

chapterContent.ms=chapterContent.en.map(([k,t,i,b],idx)=>[idx===0?'Prolog':`Bab ${idx}`,t,i,b]);

let lang=localStorage.getItem('origin.lang')||'zh';
let currentChapter=0;
let speaking=false;
const readSet=new Set(JSON.parse(localStorage.getItem('origin.read')||'[]'));
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function applyLanguage(){
  document.documentElement.lang=lang==='zh'?'zh-Hans':lang;
  $('#languageSelect').value=lang;
  $$('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(translations[lang][key])el.textContent=translations[lang][key]});
  renderChapters();
  if($('#reader').classList.contains('open'))openReader(currentChapter);
}

function renderChapters(){
  $('#chapterGrid').innerHTML=chapterContent[lang].map((c,i)=>`<button class="chapter-card ${readSet.has(i)?'read':''}" data-chapter="${i}"><span class="chapter-no">${c[0]}</span><h3>${c[1]}</h3><p>${c[2]}</p>${readSet.has(i)?'<span class="read-mark">✓ READ</span>':''}</button>`).join('');
  $('#readCount').textContent=readSet.size;
  $$('[data-chapter]').forEach(btn=>btn.addEventListener('click',()=>openReader(Number(btn.dataset.chapter))));
}

function openReader(i){
  currentChapter=i;
  stopSpeech();
  const c=chapterContent[lang][i];
  $('#readerKicker').textContent=c[0];$('#readerTitle').textContent=c[1];$('#readerIntro').textContent=c[2];
  $('#readerBody').innerHTML=c[3].split('\n\n').map(p=>`<p>${p}</p>`).join('');
  $('#prevChapter').disabled=i===0;$('#nextChapter').disabled=i===chapterContent[lang].length-1;
  $('#reader').classList.add('open');$('#reader').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}

function closeReader(){stopSpeech();$('#reader').classList.remove('open');$('#reader').setAttribute('aria-hidden','true');document.body.style.overflow=''}
function markRead(){readSet.add(currentChapter);localStorage.setItem('origin.read',JSON.stringify([...readSet]));renderChapters();toast(translations[lang].readDone)}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}
function stopSpeech(){speechSynthesis.cancel();speaking=false}
function speakText(text){if(speaking){stopSpeech();return}const u=new SpeechSynthesisUtterance(text);u.lang=lang==='zh'?'zh-CN':lang==='ms'?'ms-MY':'en-US';u.rate=.95;u.onend=()=>speaking=false;speaking=true;speechSynthesis.speak(u)}

$('#languageSelect').addEventListener('change',e=>{lang=e.target.value;localStorage.setItem('origin.lang',lang);applyLanguage()});
$$('[data-close-reader]').forEach(el=>el.addEventListener('click',closeReader));
$('#markReadBtn').addEventListener('click',markRead);
$('#prevChapter').addEventListener('click',()=>currentChapter>0&&openReader(currentChapter-1));
$('#nextChapter').addEventListener('click',()=>currentChapter<chapterContent[lang].length-1&&openReader(currentChapter+1));
$('#listenChapterBtn').addEventListener('click',()=>{const c=chapterContent[lang][currentChapter];speakText(`${c[1]}. ${c[2]}. ${c[3]}`)});
$('#listenPageBtn').addEventListener('click',()=>speakText(`${translations[lang].heroTitle}. ${translations[lang].heroSub}. ${translations[lang].manifesto}`));
$('#shareBtn').addEventListener('click',async()=>{const data={title:'Book 1 — My Life Origin',text:translations[lang].heroTitle,url:location.href};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(location.href);toast(translations[lang].shared)}}catch(e){}});
$$('.support-card').forEach(btn=>btn.addEventListener('click',()=>toast(`${btn.dataset.amount} USD · ${translations[lang].coming}`)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeReader()});
applyLanguage();