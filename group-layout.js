(() => {
  const testCategories = ['monitor','input','audio','hardware','files','utility'];
  const setupCategories = ['windows','software'];

  const copy = () => currentLang === 'ru'
    ? {
        kicker:'Каталог',
        title:'Выберите, что нужно сделать',
        tests:'Тесты и диагностика',
        testsDesc:'Проверка монитора, устройств ввода, звука, производительности, файлов и полезные калькуляторы.',
        setup:'Windows и программы',
        setupDesc:'Переустановка и настройка Windows, а также базовый и диагностический софт для ПК.',
        setupBadge:'Настройка ПК',
        testsBadge:'Проверка ПК',
        empty:'В этой категории пока нет инструментов.'
      }
    : {
        kicker:'Toolkit',
        title:'Choose what you want to do',
        tests:'Tests & diagnostics',
        testsDesc:'Monitor, input, audio, performance, file checks and useful PC calculators.',
        setup:'Windows & software',
        setupDesc:'Windows reinstall/setup guidance plus essential and diagnostic PC software.',
        setupBadge:'PC setup',
        testsBadge:'PC testing',
        empty:'No tools in this category yet.'
      };

  const cardHtml = tool => {
    const text = tt(tool.key);
    return `<article class="tool-card ${tool.featured?'featured':''}" data-category="${tool.category}">
      <div class="tool-icon">${tool.icon}</div>
      <span class="tool-tag">${text.tag}</span>
      <h3>${text.title}</h3>
      <p>${text.desc}</p>
      <button class="card-action" data-open="${tool.id}">${t('common.open')} <span><i data-lucide="arrow-right" aria-hidden="true"></i></span></button>
    </article>`;
  };

  renderFilters = function groupedRenderFilters() {
    const cats = ['all', ...testCategories.filter(cat => categories.includes(cat))];
    const row = $('#filter-row');
    if (!row) return;
    row.innerHTML = cats.map(cat => `<button class="filter ${currentFilter===cat?'active':''}" data-filter="${cat}">${t(`cat.${cat}`)}</button>`).join('');
    $$('.filter', row).forEach(btn => btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      renderFilters();
      filterCards();
    }));
  };

  filterCards = function groupedFilterCards() {
    const cards = $$('#test-tool-grid .tool-card');
    let visible = 0;
    cards.forEach(card => {
      const hidden = currentFilter !== 'all' && card.dataset.category !== currentFilter;
      card.hidden = hidden;
      if (!hidden) visible++;
    });
    const empty = $('#test-group-empty');
    if (empty) empty.hidden = visible !== 0;
  };

  renderToolCards = function groupedRenderToolCards() {
    const root = $('#tool-grid');
    if (!root) return;
    const c = copy();
    const testTools = tools.filter(tool => testCategories.includes(tool.category));
    const setupTools = tools.filter(tool => setupCategories.includes(tool.category));

    const windowsTool = setupTools.find(tool => tool.category === 'windows');
    const softwareTool = setupTools.find(tool => tool.category === 'software');
    const orderedSetup = [windowsTool, softwareTool, ...setupTools.filter(tool => tool !== windowsTool && tool !== softwareTool)].filter(Boolean);

    root.classList.add('catalog-groups');
    root.innerHTML = `
      <section class="tool-supergroup test-supergroup" aria-labelledby="tests-group-title">
        <div class="tool-supergroup-head">
          <div class="supergroup-icon"><i data-lucide="activity" aria-hidden="true"></i></div>
          <div>
            <span class="supergroup-badge">${c.testsBadge}</span>
            <h3 id="tests-group-title">${c.tests}</h3>
            <p>${c.testsDesc}</p>
          </div>
          <strong class="supergroup-count">${testTools.length}</strong>
        </div>
        <div class="group-filter-slot" id="group-filter-slot"></div>
        <div class="tool-grid grouped-tool-grid" id="test-tool-grid">${testTools.map(cardHtml).join('')}</div>
        <div class="group-empty" id="test-group-empty" hidden>${c.empty}</div>
      </section>

      <section class="tool-supergroup setup-supergroup" aria-labelledby="setup-group-title">
        <div class="tool-supergroup-head">
          <div class="supergroup-icon"><i data-lucide="laptop" aria-hidden="true"></i></div>
          <div>
            <span class="supergroup-badge">${c.setupBadge}</span>
            <h3 id="setup-group-title">${c.setup}</h3>
            <p>${c.setupDesc}</p>
          </div>
          <strong class="supergroup-count">${orderedSetup.length}</strong>
        </div>
        <div class="setup-tool-grid">${orderedSetup.map(cardHtml).join('')}</div>
        <div class="setup-program-chips" aria-hidden="true">
          <span>Word</span><span>WinRAR</span><span>VPN</span><span>CrystalDiskInfo</span><span>OCCT</span><span>AIDA64</span><span>CPU-Z</span><span>MSI Afterburner</span><span>MiniTool</span>
        </div>
      </section>`;

    const toolbar = $('.filter-toolbar');
    const slot = $('#group-filter-slot');
    if (toolbar && slot && toolbar.parentElement !== slot) slot.appendChild(toolbar);

    $$('[data-open]', root).forEach(el => el.addEventListener('click', () => openDialog(el.dataset.open)));
    filterCards();
    try { window.lucide?.createIcons?.({attrs:{'stroke-width':1.8}}); } catch {}
  };

  const heading = $('.tools-section .section-heading > div');
  if (heading) {
    const c = copy();
    heading.innerHTML = `<p class="kicker">${c.kicker}</p><h2 id="tools-title">${c.title}</h2>`;
  }

  renderFilters();
  renderToolCards();

  const previousSetLanguage = setLanguage;
  setLanguage = function groupedSetLanguage(lang) {
    previousSetLanguage(lang);
    const c = copy();
    const target = $('.tools-section .section-heading > div');
    if (target) target.innerHTML = `<p class="kicker">${c.kicker}</p><h2 id="tools-title">${c.title}</h2>`;
    renderFilters();
    renderToolCards();
  };
})();