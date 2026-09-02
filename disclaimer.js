(() => {
  const footer = document.querySelector('footer');
  const languageSelect = document.getElementById('languageSelect');
  if (!footer || document.querySelector('.publication-disclaimer')) return;

  const copy = {
    zh: {
      label: 'DISCLAIMER & TERMS',
      title: '个人分享，不构成专业建议，也不保证任何结果。',
      summary: 'My Life Origin 与 My Life OS 来自我的个人经历、记录、反思、实验以及 AI 使用经验。内容仅用于教育、信息分享与个人反思。',
      details: [
        '本网站内容不构成医疗、财务、投资、法律、心理或其他专业建议。',
        '每个人的背景、条件和结果都不同。使用本网站提到的任何方法、框架、习惯、复盘方式、AI 工作流程或 Life OS 方法，并不保证改善、成功、财务收益、健康改善或任何特定结果。',
        '你应对自己的决定、行动和风险负责。在作出重要的健康、财务、法律或其他高影响决定前，请在适当情况下咨询合资格的专业人士。',
        'AI 生成或协助整理的内容可能存在错误、遗漏、偏差或限制，应结合事实核对与人的判断使用。',
        'My Life OS 是一套个人自我管理与反思框架，不是结果保证，也不替代专业服务。'
      ],
      open: '查看完整声明',
      close: '收起声明',
      short: 'Personal experience · Educational sharing · No guaranteed results'
    },
    en: {
      label: 'DISCLAIMER & TERMS',
      title: 'Personal sharing, not professional advice, and no results are guaranteed.',
      summary: 'My Life Origin and My Life OS are based on my personal experiences, records, reflections, experiments, and use of AI. The content is shared for educational, informational, and personal reflection purposes only.',
      details: [
        'Nothing on this website constitutes medical, financial, investment, legal, psychological, or other professional advice.',
        'Individual circumstances and results vary. Using any idea, framework, habit, review method, AI workflow, or Life OS approach described here does not guarantee improvement, success, financial gain, health improvement, or any specific outcome.',
        'You are responsible for your own decisions, actions, and risks. Where appropriate, consult a qualified professional before making important health, financial, legal, or other high-impact decisions.',
        'AI-generated or AI-assisted content may contain errors, omissions, bias, or limitations and should be used with fact-checking and human judgment.',
        'My Life OS is a personal self-management and reflection framework. It is not a guarantee of results and does not replace professional services.'
      ],
      open: 'Read full disclaimer',
      close: 'Close disclaimer',
      short: 'Personal experience · Educational sharing · No guaranteed results'
    },
    ms: {
      label: 'PENAFIAN & TERMA',
      title: 'Perkongsian peribadi, bukan nasihat profesional, dan tiada hasil yang dijamin.',
      summary: 'My Life Origin dan My Life OS berdasarkan pengalaman, rekod, refleksi, eksperimen serta penggunaan AI saya sendiri. Kandungan dikongsi untuk tujuan pendidikan, maklumat dan refleksi peribadi sahaja.',
      details: [
        'Tiada kandungan di laman ini merupakan nasihat perubatan, kewangan, pelaburan, undang-undang, psikologi atau nasihat profesional lain.',
        'Keadaan dan hasil setiap individu berbeza. Penggunaan idea, rangka kerja, tabiat, kaedah semakan, aliran kerja AI atau pendekatan Life OS yang diterangkan di sini tidak menjamin peningkatan, kejayaan, keuntungan kewangan, peningkatan kesihatan atau apa-apa hasil tertentu.',
        'Anda bertanggungjawab terhadap keputusan, tindakan dan risiko anda sendiri. Jika sesuai, dapatkan nasihat profesional yang berkelayakan sebelum membuat keputusan penting berkaitan kesihatan, kewangan, undang-undang atau perkara berimpak tinggi lain.',
        'Kandungan yang dijana atau dibantu oleh AI mungkin mengandungi kesilapan, kekurangan, bias atau batasan dan perlu digunakan bersama semakan fakta serta pertimbangan manusia.',
        'My Life OS ialah rangka kerja pengurusan diri dan refleksi peribadi. Ia bukan jaminan hasil dan tidak menggantikan perkhidmatan profesional.'
      ],
      open: 'Baca penafian penuh',
      close: 'Tutup penafian',
      short: 'Pengalaman peribadi · Perkongsian pendidikan · Tiada jaminan hasil'
    }
  };

  const section = document.createElement('section');
  section.className = 'publication-disclaimer';
  section.innerHTML = `
    <div class="shell publication-disclaimer-inner">
      <div class="publication-disclaimer-head">
        <p class="publication-disclaimer-label" id="disclaimerLabel"></p>
        <h2 id="disclaimerTitle"></h2>
        <p class="publication-disclaimer-summary" id="disclaimerSummary"></p>
      </div>
      <details class="publication-disclaimer-details" id="disclaimerDetails">
        <summary id="disclaimerToggle"></summary>
        <div class="publication-disclaimer-copy" id="disclaimerCopy"></div>
      </details>
      <p class="publication-disclaimer-short" id="disclaimerShort"></p>
    </div>`;
  footer.parentNode.insertBefore(section, footer);

  const style = document.createElement('style');
  style.textContent = `
    .publication-disclaimer{background:#f3eee6;border-top:1px solid rgba(67,52,39,.12);padding:64px 0 52px;color:#27221d}
    .publication-disclaimer-inner{max-width:980px}
    .publication-disclaimer-head{max-width:780px}
    .publication-disclaimer-label{margin:0 0 14px;font-size:11px;font-weight:800;letter-spacing:.18em;color:#9a6b3e}
    .publication-disclaimer h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(28px,4vw,44px);line-height:1.16;margin:0 0 18px;color:#211b16}
    .publication-disclaimer-summary{font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.8;color:#5f574f;margin:0}
    .publication-disclaimer-details{margin-top:28px;border-top:1px solid rgba(67,52,39,.14);border-bottom:1px solid rgba(67,52,39,.14);padding:18px 0}
    .publication-disclaimer-details summary{cursor:pointer;list-style:none;font-size:13px;font-weight:800;letter-spacing:.04em;color:#6d4e32}
    .publication-disclaimer-details summary::-webkit-details-marker{display:none}
    .publication-disclaimer-details summary:after{content:' +';font-size:16px}
    .publication-disclaimer-details[open] summary:after{content:' −'}
    .publication-disclaimer-copy{padding-top:18px;max-width:820px}
    .publication-disclaimer-copy p{margin:0 0 14px;font-size:14px;line-height:1.8;color:#686057}
    .publication-disclaimer-short{margin:20px 0 0;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:#958a7f}
    @media(max-width:700px){.publication-disclaimer{padding:48px 0 42px}.publication-disclaimer-summary{font-size:16px;line-height:1.75}.publication-disclaimer-copy p{font-size:13px}}
  `;
  document.head.appendChild(style);

  const label = document.getElementById('disclaimerLabel');
  const title = document.getElementById('disclaimerTitle');
  const summary = document.getElementById('disclaimerSummary');
  const details = document.getElementById('disclaimerDetails');
  const toggle = document.getElementById('disclaimerToggle');
  const body = document.getElementById('disclaimerCopy');
  const short = document.getElementById('disclaimerShort');

  function render() {
    const lang = languageSelect?.value || 'zh';
    const c = copy[lang] || copy.zh;
    label.textContent = c.label;
    title.textContent = c.title;
    summary.textContent = c.summary;
    body.innerHTML = c.details.map(item => `<p>${item}</p>`).join('');
    short.textContent = c.short;
    toggle.textContent = details.open ? c.close : c.open;
  }

  details.addEventListener('toggle', render);
  languageSelect?.addEventListener('change', () => setTimeout(render, 0));
  render();
})();