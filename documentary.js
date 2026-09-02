(() => {
  const cleanBookCss = document.createElement('link');
  cleanBookCss.rel = 'stylesheet';
  cleanBookCss.href = 'cleanbook.css';
  document.head.appendChild(cleanBookCss);

  const chapterOneScript = document.createElement('script');
  chapterOneScript.src = 'chapter1.js';
  document.head.appendChild(chapterOneScript);
})();

(() => {
  const select = document.getElementById('languageSelect');
  const copy = {
    zh: {
      docHeroTitle:'46年人生。2年与 AI 同行。12个月完整记录。一个 Life OS 开始成形。',
      docHeroSub:'在 AI 进入我的人生以前，我已经用了很多不同工具来记录、整理和管理生活。直到我持续使用 GPT，工具才开始从“记录我”，变成“帮助我理解自己”。',
      enterStoryBtn:'进入真实故事', journeyKicker:'THE JOURNEY', journeyTitle:'My Life OS 不是突然出现的。', journeyLead:'它经过了真实人生、不同工具、AI 对话，以及一年完整记录，才慢慢形成。',
      j1t:'46年真实人生',j1d:'工作、家庭、健康、金钱、责任、选择与错误。',j2t:'多年工具摸索',j2d:'Notebook、Excel、照片、WhatsApp、Calendar 与不同软件各自解决一部分问题。',j3t:'2年与 AI / GPT',j3d:'最初只是工具，后来逐渐成为整理、复盘与思考的伙伴。',j4t:'12个月 Daily Log',j4d:'连续记录真实生活，让记忆开始变成可以回看的数据。',j5t:'规律开始出现',j5d:'Daily → Weekly → Monthly Review，把碎片连接成模式。',j6t:'My Life OS',j6d:'不是先设计出来，而是从真实生活里长出来。',
      yearTitle:'12个月，不只是日记，而是一整年的生命数据。',yearText:'我记录工作、健康、家庭、金钱、决定、习惯、进展、错误与想法。记录后来变成复盘，复盘开始显现规律。',yearQuote:'“最初我只是怕忘记。后来我才发现，持续记录可以让我重新看见自己的人生。”',statMonths:'个月连续记录',statDays:'天真实生活',statDomains:'个人生领域',statReviews:'层复盘：日 / 周 / 月',
      turnTitle:'AI 没有创造我的人生。它帮助我看见原本已经存在的人生。',toolTitle:'Tool',toolText:'帮我回答问题、写文字、整理工作。',mirrorTitle:'Mirror',mirrorText:'当记录越来越多，它开始帮助我看见自己的重复模式。',systemTitle:'System',systemText:'过去、现在和未来开始被连接在同一个人生框架里。',bookEntryTitle:'从这里开始，这不再只是一个系统概念，而是一段可以被阅读的人生。'
    },
    en: {
      docHeroTitle:'46 Years of Life. 2 Years with AI. 12 Months Fully Logged. One Life OS Emerged.',
      docHeroSub:'Before AI entered my life, I had already used many different tools to record, organize and manage it. With continuous use of GPT, the tools gradually moved from recording me to helping me understand myself.',
      enterStoryBtn:'Enter the true story',journeyKicker:'THE JOURNEY',journeyTitle:'My Life OS did not appear overnight.',journeyLead:'It grew through real life, years of tools, AI conversations and one full year of continuous records.',
      j1t:'46 years of real life',j1d:'Work, family, health, money, responsibility, choices and mistakes.',j2t:'Years of different tools',j2d:'Notebooks, Excel, photos, WhatsApp, calendars and apps each solved one part of the problem.',j3t:'2 years with AI / GPT',j3d:'It began as a tool and gradually became a partner for organizing, reviewing and thinking.',j4t:'12 months of Daily Logs',j4d:'Continuous records turned memory into life data that could be reviewed.',j5t:'Patterns appeared',j5d:'Daily → Weekly → Monthly Review connected fragments into patterns.',j6t:'My Life OS',j6d:'Not designed first. It grew out of lived reality.',
      yearTitle:'Twelve months became more than a diary. They became a year of life data.',yearText:'I recorded work, health, family, money, decisions, habits, progress, mistakes and ideas. Records became reviews. Reviews began revealing patterns.',yearQuote:'“At first I recorded because I did not want to forget. Later I discovered that continuous records could help me see my own life again.”',statMonths:'months continuously logged',statDays:'days of real life',statDomains:'life domains',statReviews:'review layers: daily / weekly / monthly',
      turnTitle:'AI did not create my life. It helped me see the life that was already there.',toolTitle:'Tool',toolText:'It helped me answer questions, write and organize work.',mirrorTitle:'Mirror',mirrorText:'As the records accumulated, it helped me see repeating patterns in myself.',systemTitle:'System',systemText:'Past, present and future started connecting inside one life framework.',bookEntryTitle:'From here, this is no longer just a system idea. It becomes a life you can read.'
    },
    ms: {
      docHeroTitle:'46 Tahun Kehidupan. 2 Tahun Bersama AI. 12 Bulan Direkod. Satu Life OS Muncul.',
      docHeroSub:'Sebelum AI memasuki hidup saya, saya sudah menggunakan banyak alat untuk merekod, menyusun dan mengurus kehidupan. Dengan penggunaan GPT yang berterusan, alat itu mula membantu saya memahami diri sendiri.',
      enterStoryBtn:'Masuk kisah sebenar',journeyKicker:'PERJALANAN',journeyTitle:'My Life OS tidak muncul secara tiba-tiba.',journeyLead:'Ia tumbuh melalui kehidupan sebenar, pelbagai alat, perbualan AI dan satu tahun rekod berterusan.',
      j1t:'46 tahun kehidupan sebenar',j1d:'Kerja, keluarga, kesihatan, wang, tanggungjawab, pilihan dan kesilapan.',j2t:'Bertahun menggunakan alat',j2d:'Notebook, Excel, foto, WhatsApp, kalendar dan aplikasi menyelesaikan bahagian yang berbeza.',j3t:'2 tahun bersama AI / GPT',j3d:'Bermula sebagai alat, kemudian menjadi rakan untuk menyusun, menilai dan berfikir.',j4t:'12 bulan Daily Log',j4d:'Rekod berterusan menukar ingatan kepada data kehidupan yang boleh dilihat semula.',j5t:'Corak mula kelihatan',j5d:'Daily → Weekly → Monthly Review menyambungkan serpihan menjadi corak.',j6t:'My Life OS',j6d:'Bukan direka terlebih dahulu. Ia tumbuh daripada kehidupan sebenar.',
      yearTitle:'Dua belas bulan menjadi lebih daripada diari — ia menjadi setahun data kehidupan.',yearText:'Saya merekod kerja, kesihatan, keluarga, wang, keputusan, tabiat, kemajuan, kesilapan dan idea. Rekod menjadi semakan dan semakan mula menunjukkan corak.',yearQuote:'“Pada mulanya saya merekod kerana tidak mahu lupa. Kemudian saya sedar rekod berterusan membantu saya melihat semula kehidupan sendiri.”',statMonths:'bulan direkod berterusan',statDays:'hari kehidupan sebenar',statDomains:'domain kehidupan',statReviews:'lapisan semakan: harian / mingguan / bulanan',
      turnTitle:'AI tidak mencipta hidup saya. Ia membantu saya melihat kehidupan yang sudah ada.',toolTitle:'Tool',toolText:'Membantu menjawab soalan, menulis dan menyusun kerja.',mirrorTitle:'Mirror',mirrorText:'Apabila rekod bertambah, ia membantu saya melihat corak berulang dalam diri.',systemTitle:'System',systemText:'Masa lalu, kini dan masa depan mula tersambung dalam satu rangka kehidupan.',bookEntryTitle:'Dari sini, ia bukan lagi sekadar idea sistem. Ia menjadi sebuah kehidupan yang boleh dibaca.'
    }
  };
  function apply(){ const lang=select?.value||'zh'; const c=copy[lang]||copy.zh; Object.entries(c).forEach(([id,text])=>{const el=document.getElementById(id); if(el) el.textContent=text;}); }
  select?.addEventListener('change',()=>setTimeout(apply,0));
  apply();
})();

(() => {
  const whatsappNumber = '60129839876';
  const message = encodeURIComponent('Hi Charles, I came from the My Life Origin website and would like to know more about My Life OS.');
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  const style = document.createElement('style');
  style.textContent = `
    .whatsapp-contact{position:fixed;right:20px;bottom:20px;z-index:60;display:flex;align-items:center;gap:10px;padding:12px 16px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:#1f1a16;color:#f7efe4;text-decoration:none;box-shadow:0 12px 30px rgba(0,0,0,.24);font:700 14px/1.1 Inter,system-ui,sans-serif;transition:transform .2s ease,box-shadow .2s ease}
    .whatsapp-contact:hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(0,0,0,.3)}
    .whatsapp-contact .wa-dot{width:10px;height:10px;border-radius:50%;background:#25D366;box-shadow:0 0 0 4px rgba(37,211,102,.14)}
    .whatsapp-contact small{display:block;font-size:10px;font-weight:600;color:#b9aa97;margin-top:3px;letter-spacing:.04em}
    @media (max-width:720px){.whatsapp-contact{right:12px;bottom:12px;padding:11px 13px}.whatsapp-contact small{display:none}}
  `;
  document.head.appendChild(style);

  const link = document.createElement('a');
  link.className = 'whatsapp-contact';
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label','Contact Charles on WhatsApp');
  link.innerHTML = `<span class="wa-dot"></span><span>WhatsApp 联系 Charles<small>+60 12-983 9876</small></span>`;
  document.body.appendChild(link);
})();

(() => {
  const whatsappNumber = '60129839876';
  const languageSelect = document.getElementById('languageSelect');

  const messages = {
    zh: amount => `Hi Charles，我来自 My Life Origin 网站。我想支持你的旅程 US$${amount}。请把付款 QR 发给我，谢谢。`,
    en: amount => `Hi Charles, I came from the My Life Origin website. I would like to support your journey with US$${amount}. Please send me the payment QR. Thank you.`,
    ms: amount => `Hi Charles, saya datang dari laman My Life Origin. Saya ingin menyokong perjalanan ini dengan US$${amount}. Sila hantarkan QR pembayaran kepada saya. Terima kasih.`
  };

  document.querySelectorAll('.support-card[data-amount]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const amount = button.dataset.amount || '10';
      const lang = languageSelect?.value || 'zh';
      const makeMessage = messages[lang] || messages.zh;
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(makeMessage(amount))}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }, true);
  });

  const note = document.querySelector('.support-note');
  if (note) {
    const setNote = () => {
      const lang = languageSelect?.value || 'zh';
      note.textContent = lang === 'en'
        ? 'Choose an amount to message Charles on WhatsApp. Charles will reply with the payment QR.'
        : lang === 'ms'
          ? 'Pilih jumlah untuk mesej Charles melalui WhatsApp. Charles akan membalas dengan QR pembayaran.'
          : '选择支持金额后会直接打开 WhatsApp。Charles 会在 WhatsApp 回复付款 QR。';
    };
    languageSelect?.addEventListener('change', () => setTimeout(setNote, 0));
    setNote();
  }
})();

(() => {
  const image = document.querySelector('.image-book-cover img');
  if (!image) return;

  const source = image.getAttribute('src');
  if (!source) return;

  fetch(source, { cache: 'no-store' })
    .then(response => response.text())
    .then(text => {
      const encoded = text.trim();
      if (encoded.startsWith('/9j/')) {
        image.src = `data:image/jpeg;base64,${encoded}`;
      } else if (encoded.startsWith('iVBOR')) {
        image.src = `data:image/png;base64,${encoded}`;
      }
    })
    .catch(() => {});
})();

(() => {
  const anchor = document.querySelector('.origin-flow');
  const languageSelect = document.getElementById('languageSelect');
  if (!anchor || document.querySelector('.origin-to-yours')) return;

  const copy = {
    zh: {
      label: 'FROM MY ORIGIN TO YOURS',
      line1: '这本书，是我的 Origin。',
      line2: '你的 Life OS，将从你自己的数据、你自己的规律、你自己的人生开始。',
      note: '每一个 Life OS，都应该从一个真实的人生开始。',
      data: 'YOUR DATA', patterns: 'YOUR PATTERNS', life: 'YOUR LIFE'
    },
    en: {
      label: 'FROM MY ORIGIN TO YOURS',
      line1: 'This book is my origin.',
      line2: 'Your Life OS would begin with your own data, your own patterns, and your own life.',
      note: 'Every Life OS should begin with a real life.',
      data: 'YOUR DATA', patterns: 'YOUR PATTERNS', life: 'YOUR LIFE'
    },
    ms: {
      label: 'DARIPADA ORIGIN SAYA KEPADA ANDA',
      line1: 'Buku ini ialah origin saya.',
      line2: 'Life OS anda akan bermula dengan data anda sendiri, corak anda sendiri dan kehidupan anda sendiri.',
      note: 'Setiap Life OS sepatutnya bermula daripada kehidupan yang sebenar.',
      data: 'DATA ANDA', patterns: 'CORAK ANDA', life: 'HIDUP ANDA'
    }
  };

  const section = document.createElement('section');
  section.className = 'origin-to-yours';
  section.innerHTML = `
    <div class="shell origin-to-yours-inner">
      <p class="origin-to-yours-label" id="originToYoursLabel"></p>
      <div class="origin-to-yours-rule" aria-hidden="true"></div>
      <blockquote class="origin-to-yours-quote">
        <span id="originToYoursLine1"></span>
        <strong id="originToYoursLine2"></strong>
      </blockquote>
      <div class="origin-to-yours-steps" aria-label="Your Life OS begins here">
        <span id="originToYoursData"></span>
        <i aria-hidden="true">→</i>
        <span id="originToYoursPatterns"></span>
        <i aria-hidden="true">→</i>
        <span id="originToYoursLife"></span>
      </div>
      <p class="origin-to-yours-note" id="originToYoursNote"></p>
    </div>`;
  anchor.insertAdjacentElement('beforebegin', section);

  const style = document.createElement('style');
  style.textContent = `
    .origin-to-yours{position:relative;overflow:hidden;background:#171512;color:#f6efe5;padding:112px 0 108px}
    .origin-to-yours:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 78% 24%,rgba(185,132,73,.12),transparent 34%),linear-gradient(135deg,rgba(255,255,255,.018),transparent 42%);pointer-events:none}
    .origin-to-yours-inner{position:relative;max-width:980px}
    .origin-to-yours-label{margin:0 0 22px;font:800 10px/1.2 Inter,system-ui,sans-serif;letter-spacing:.25em;color:#c99b67}
    .origin-to-yours-rule{width:76px;height:1px;background:#a97745;margin-bottom:42px}
    .origin-to-yours-quote{margin:0;max-width:900px;font-family:Georgia,'Times New Roman',serif}
    .origin-to-yours-quote span{display:block;font-size:clamp(27px,3.7vw,46px);line-height:1.25;color:#cfc5b9;margin-bottom:14px}
    .origin-to-yours-quote strong{display:block;font-size:clamp(37px,5.4vw,70px);line-height:1.08;font-weight:500;letter-spacing:-.025em;color:#fffaf2}
    .origin-to-yours-steps{display:flex;align-items:center;gap:18px;margin-top:54px;padding-top:24px;border-top:1px solid rgba(201,155,103,.24);font:800 10px/1 Inter,system-ui,sans-serif;letter-spacing:.18em;color:#d4b18c}
    .origin-to-yours-steps i{font-style:normal;color:#78624d;font-size:14px;letter-spacing:0}
    .origin-to-yours-note{margin:28px 0 0;max-width:620px;color:#9f9589;font-size:15px;line-height:1.7}
    @media(max-width:700px){
      .origin-to-yours{padding:76px 0 78px}
      .origin-to-yours-inner{width:min(100% - 42px,980px)}
      .origin-to-yours-rule{margin-bottom:32px}
      .origin-to-yours-quote span{font-size:27px}
      .origin-to-yours-quote strong{font-size:41px;line-height:1.12}
      .origin-to-yours-steps{gap:10px;flex-wrap:wrap;margin-top:42px;letter-spacing:.13em}
      .origin-to-yours-steps i{font-size:12px}
      .origin-to-yours-note{font-size:14px}
    }
  `;
  document.head.appendChild(style);

  function apply() {
    const c = copy[languageSelect?.value || 'zh'] || copy.zh;
    document.getElementById('originToYoursLabel').textContent = c.label;
    document.getElementById('originToYoursLine1').textContent = c.line1;
    document.getElementById('originToYoursLine2').textContent = c.line2;
    document.getElementById('originToYoursData').textContent = c.data;
    document.getElementById('originToYoursPatterns').textContent = c.patterns;
    document.getElementById('originToYoursLife').textContent = c.life;
    document.getElementById('originToYoursNote').textContent = c.note;
  }

  languageSelect?.addEventListener('change', () => setTimeout(apply, 0));
  apply();
})();
