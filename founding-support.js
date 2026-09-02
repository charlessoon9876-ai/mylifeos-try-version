(() => {
  const languageSelect = document.getElementById('languageSelect');
  const support = document.getElementById('support');
  if (!support) return;

  const copy = {
    zh: {
      label: 'SUPPORT THE NEXT CHAPTER',
      title: '成为 My Life OS 的早期支持者',
      text: '如果这个故事与你产生共鸣，你可以成为 My Life OS 的早期支持者，帮助 Book 1、多语言版本、听书体验，以及下一阶段的发展继续前进。',
      note: '这是一份对项目发展的支持，并非投资，不承诺股份、收益或财务回报。',
      tier1: 'Reader Supporter · 读者支持者',
      tier10: 'Founding Supporter · 早期支持者',
      tier100: 'Founding Patron · 创始赞助支持者',
      wa: amount => `Hi Charles，我来自 My Life Origin 网站。我想成为 My Life OS 的早期支持者，以 US$${amount} 支持下一阶段发展。请把付款 QR 发给我，谢谢。`
    },
    en: {
      label: 'SUPPORT THE NEXT CHAPTER',
      title: 'Become a Founding Supporter of My Life OS',
      text: 'If this story resonates with you, you can become an early supporter of My Life OS and help Book 1, multilingual editions, the audiobook experience, and the next stage continue to grow.',
      note: 'This is support, not an investment. No ownership, financial return, or profit is promised.',
      tier1: 'Reader Supporter',
      tier10: 'Founding Supporter',
      tier100: 'Founding Patron',
      wa: amount => `Hi Charles, I came from the My Life Origin website. I would like to become an early supporter of My Life OS and support the next stage with US$${amount}. Please send me the payment QR. Thank you.`
    },
    ms: {
      label: 'SOKONG BAB SETERUSNYA',
      title: 'Jadi Penyokong Awal My Life OS',
      text: 'Jika kisah ini memberi makna kepada anda, anda boleh menjadi penyokong awal My Life OS dan membantu Book 1, versi pelbagai bahasa, pengalaman audiobook serta pembangunan peringkat seterusnya.',
      note: 'Ini ialah sokongan, bukan pelaburan. Tiada pemilikan, pulangan kewangan atau keuntungan dijanjikan.',
      tier1: 'Reader Supporter · Penyokong Pembaca',
      tier10: 'Founding Supporter · Penyokong Awal',
      tier100: 'Founding Patron · Penaung Awal',
      wa: amount => `Hi Charles, saya datang dari laman My Life Origin. Saya ingin menjadi penyokong awal My Life OS dan menyokong peringkat seterusnya dengan US$${amount}. Sila hantarkan QR pembayaran kepada saya. Terima kasih.`
    }
  };

  // Keep the site's shared translation dictionary aligned where available.
  if (typeof translations !== 'undefined') {
    Object.keys(copy).forEach(lang => {
      if (!translations[lang]) return;
      translations[lang].supportLabel = copy[lang].label;
      translations[lang].supportTitle = copy[lang].title;
      translations[lang].supportText = copy[lang].text;
      translations[lang].supportNote = copy[lang].note;
      translations[lang].tier1 = copy[lang].tier1;
      translations[lang].tier10 = copy[lang].tier10;
      translations[lang].tier100 = copy[lang].tier100;
    });
  }

  const labelEl = support.querySelector('[data-i18n="supportLabel"]');
  const titleEl = support.querySelector('[data-i18n="supportTitle"]');
  const textEl = support.querySelector('[data-i18n="supportText"]');
  const noteEl = support.querySelector('[data-i18n="supportNote"]');

  // Replace the original buttons so the older sponsor click handlers are removed.
  support.querySelectorAll('.support-card[data-amount]').forEach(button => {
    const clone = button.cloneNode(true);
    button.replaceWith(clone);
  });

  const buttons = [...support.querySelectorAll('.support-card[data-amount]')];
  const whatsappNumber = '60129839876';

  function apply() {
    const lang = languageSelect?.value || 'zh';
    const c = copy[lang] || copy.zh;
    if (labelEl) labelEl.textContent = c.label;
    if (titleEl) titleEl.textContent = c.title;
    if (textEl) textEl.textContent = c.text;
    if (noteEl) noteEl.textContent = c.note;

    const tiers = [c.tier1, c.tier10, c.tier100];
    buttons.forEach((button, index) => {
      const small = button.querySelector('small');
      if (small) small.textContent = tiers[index] || tiers[1];
    });
  }

  buttons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      const lang = languageSelect?.value || 'zh';
      const c = copy[lang] || copy.zh;
      const amount = button.dataset.amount || '10';
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(c.wa(amount))}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

  const style = document.createElement('style');
  style.textContent = `
    #support .support-note{max-width:660px;font-size:12px;line-height:1.65;color:#7b7063}
    #support .support-card small{line-height:1.35}
  `;
  document.head.appendChild(style);

  languageSelect?.addEventListener('change', () => window.setTimeout(apply, 0));
  window.setTimeout(apply, 0);
})();
