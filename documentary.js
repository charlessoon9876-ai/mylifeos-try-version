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