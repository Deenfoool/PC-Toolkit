(() => {
  const previousOpenDialog = openDialog;

  function injectMasEasterEgg() {
    const tool = $('.windows-tool', dialogContent);
    if (!tool || $('#mas-easter-egg', tool)) return;

    const ru = currentLang === 'ru';
    const activationSection = [...tool.querySelectorAll('.win-section')].find(section =>
      section.querySelector('.win-section-title')?.textContent.includes(ru ? 'Активация Windows' : 'Windows activation')
    );
    if (!activationSection) return;

    const section = document.createElement('section');
    section.className = 'win-section mas-easter-egg';
    section.id = 'mas-easter-egg';
    section.innerHTML = `
      <div class="win-section-title">
        <i data-lucide="sparkles" aria-hidden="true"></i>
        <div>
          <span>Microsoft Activation Scripts (MAS) <small class="mas-badge">${ru ? 'пасхалка' : 'easter egg'}</small></span>
          <p>${ru
            ? 'Для тех, кто слишком внимательно читает памятку. Выглядит максимально серьёзно — но это именно шутка, а не инструкция по обходу активации.'
            : 'For people who read the checklist a little too carefully. It looks very serious, but this is intentionally a joke rather than an activation-bypass guide.'}</p>
        </div>
      </div>
      <div class="mas-terminal" role="note" aria-label="MAS easter egg">
        <div class="mas-terminal-top"><span></span><span></span><span></span><strong>PowerShell</strong></div>
        <code><span class="mas-prompt">PS C:\&gt;</span> Win + X → Terminal (Admin) → get.neactivated.win → <span class="mas-nope">[nice try]</span></code>
      </div>
      <div class="mas-serious-note">
        <i data-lucide="shield-alert" aria-hidden="true"></i>
        <p>${ru
          ? 'Серьёзная часть: не вставляйте в PowerShell команды, которые скачивают и сразу запускают неизвестный удалённый код. Для активации Windows используйте цифровую лицензию, ключ продукта и официальный раздел Settings → System → Activation.'
          : 'Serious part: do not paste PowerShell commands that download and immediately execute unknown remote code. Use a digital license, product key, and the official Settings → System → Activation page for Windows activation.'}</p>
      </div>`;

    activationSection.insertAdjacentElement('afterend', section);
    window.lucide?.createIcons?.({attrs:{'stroke-width':1.8}});
  }

  openDialog = function masEasterEggOpenDialog(name) {
    const result = previousOpenDialog(name);
    if (name === 'windows-reinstall') {
      requestAnimationFrame(() => requestAnimationFrame(injectMasEasterEgg));
    }
    return result;
  };
})();
