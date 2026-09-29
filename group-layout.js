(() => {
  const testCategories = ['monitor','input','audio','hardware','files','utility'];
  const setupCategories = ['windows','software'];
  const filterToolbar = $('.filter-toolbar');
  const initialView = new URL(window.location.href).searchParams.get('view');
  let activeGroup = initialView === 'setup' ? 'setup' : 'tests';

  const copy = () => currentLang === 'ru'
    ? {
        kicker:'Каталог',
        title:'Что будем делать?',
        tests:'Тесты и диагностика',
        testsShort:'Тесты',
        testsDesc:'Монитор, клавиатура и мышь, звук, железо, файлы и полезные калькуляторы.',
        setup:'Windows и программы',
        setupShort:'Windows и программы',
        setupDesc:'Переустановка и настройка Windows, а также установка основного и диагностического софта.',
        setupBadge:'Настройка ПК',
        testsBadge:'Проверка ПК',
        empty:'В этой категории пока нет инструментов.'
      }
    : {
        kicker:'Toolkit',
        title:'What do you want to do?',
        tests:'Tests & diagnostics',
        testsShort:'Tests',
        testsDesc:'Monitor, input, audio, hardware, file checks and useful PC calculators.',
        setup:'Windows & software',
        setupShort:'Windows & software',
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

  function syncUrl() {
    const url = new URL(window.location.href);
    if (activeGroup === 'setup') url.searchParams.set('view','setup');
    else url.searchParams.delete('view');
    history.replaceState({catalogView:activeGroup},'',url);
  }

  function renderSwitcher() {
    const host = $('#catalog-switcher');
    if (!host) return;
    const c = copy();
    host.innerHTML = `
      <div class="catalog-tabs" role="tablist" aria-label="${c.title}">
        <button type="button" role="tab" aria-selected="${activeGroup==='tests'}" class="catalog-tab ${activeGroup==='tests'?'active':''}" data-catalog-view="tests">
          <span class="catalog-tab-icon"><i data-lucide="activity" aria-hidden="true"></i></span>
          <span><strong>${c.tests}</strong><small>${c.testsDesc}</small></span>
        </button>
        <button type="button" role="tab" aria-selected="${activeGroup==='setup'}" class="catalog-tab setup-tab ${activeGroup==='setup'?'active':''}" data-catalog-view="setup">
          <span class="catalog-tab-icon"><i data-lucide="laptop" aria-hidden="true"></i></span>
          <span><strong>${c.setup}</strong><small>${c.setupDesc}</small></span>
        </button>
      </div>`;

    $$('[data-catalog-view]',host).forEach(button => button.addEventListener('click',() => {
      setActiveGroup(button.dataset.catalogView);
    }));
  }

  function updateFastNav() {
    const c = copy();
    const tests = $('#nav-tests');
    const setup = $('#nav-setup');
    if (tests) {
      tests.textContent = c.testsShort;
      tests.classList.toggle('active-section',activeGroup==='tests');
    }
    if (setup) {
      setup.textContent = c.setupShort;
      setup.classList.toggle('active-section',activeGroup==='setup');
    }
  }

  function setActiveGroup(group,{scroll=false,updateUrl=true}={}) {
    if (!['tests','setup'].includes(group)) return;
    activeGroup = group;
    if (activeGroup === 'setup') currentFilter = 'all';
    if (updateUrl) syncUrl();
    renderSwitcher();
    renderFilters();
    renderToolCards();
    updateFastNav();
    if (scroll) $('#tools')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  renderFilters = function tabbedRenderFilters() {
    const row = $('#filter-row');
    if (!row) return;
    if (filterToolbar) filterToolbar.hidden = activeGroup !== 'tests';
    if (activeGroup !== 'tests') {
      row.innerHTML = '';
      return;
    }

    const cats = ['all', ...testCategories.filter(cat => categories.includes(cat))];
    row.innerHTML = cats.map(cat => `<button class="filter ${currentFilter===cat?'active':''}" data-filter="${cat}">${t(`cat.${cat}`)}</button>`).join('');
    $$('.filter',row).forEach(btn => btn.addEventListener('click',() => {
      currentFilter = btn.dataset.filter;
      renderFilters();
      filterCards();
    }));
  };

  filterCards = function tabbedFilterCards() {
    if (activeGroup !== 'tests') return;
    const cards = $$('#tool-grid .tool-card');
    let visible = 0;
    cards.forEach(card => {
      const hidden = currentFilter !== 'all' && card.dataset.category !== currentFilter;
      card.hidden = hidden;
      if (!hidden) visible++;
    });
    const empty = $('#test-group-empty');
    if (empty) empty.hidden = visible !== 0;
  };

  renderToolCards = function tabbedRenderToolCards() {
    const root = $('#tool-grid');
    if (!root) return;
    const c = copy();
    root.classList.add('catalog-groups');

    if (activeGroup === 'tests') {
      const testTools = tools.filter(tool => testCategories.includes(tool.category));
      root.innerHTML = `
        <section class="tool-supergroup test-supergroup" aria-labelledby="tests-group-title">
          <div class="tool-supergroup-head compact-supergroup-head">
            <div class="supergroup-icon"><i data-lucide="activity" aria-hidden="true"></i></div>
            <div>
              <span class="supergroup-badge">${c.testsBadge}</span>
              <h3 id="tests-group-title">${c.tests}</h3>
            </div>
            <strong class="supergroup-count">${testTools.length}</strong>
          </div>
          <div class="tool-grid grouped-tool-grid">${testTools.map(cardHtml).join('')}</div>
          <div class="group-empty" id="test-group-empty" hidden>${c.empty}</div>
        </section>`;
    } else {
      const setupTools = tools.filter(tool => setupCategories.includes(tool.category));
      const windowsTool = setupTools.find(tool => tool.category === 'windows');
      const softwareTool = setupTools.find(tool => tool.category === 'software');
      const orderedSetup = [windowsTool,softwareTool,...setupTools.filter(tool => tool !== windowsTool && tool !== softwareTool)].filter(Boolean);

      root.innerHTML = `
        <section class="tool-supergroup setup-supergroup" aria-labelledby="setup-group-title">
          <div class="tool-supergroup-head compact-supergroup-head">
            <div class="supergroup-icon"><i data-lucide="laptop" aria-hidden="true"></i></div>
            <div>
              <span class="supergroup-badge">${c.setupBadge}</span>
              <h3 id="setup-group-title">${c.setup}</h3>
            </div>
            <strong class="supergroup-count">${orderedSetup.length}</strong>
          </div>
          <div class="setup-tool-grid">${orderedSetup.map(cardHtml).join('')}</div>
          <div class="setup-program-chips" aria-hidden="true">
            <span>Word</span><span>WinRAR</span><span>VPN</span><span>CrystalDiskInfo</span><span>OCCT</span><span>AIDA64</span><span>CPU-Z</span><span>MSI Afterburner</span><span>MiniTool</span>
          </div>
        </section>`;
    }

    $$('[data-open]',root).forEach(el => el.addEventListener('click',() => openDialog(el.dataset.open)));
    filterCards();
    try { window.lucide?.createIcons?.({attrs:{'stroke-width':1.8}}); } catch {}
  };

  function updateHeading() {
    const target = $('.tools-section .section-heading > div');
    if (!target) return;
    const c = copy();
    target.innerHTML = `<p class="kicker">${c.kicker}</p><h2 id="tools-title">${c.title}</h2>`;
  }

  $$('[data-catalog-nav]').forEach(link => link.addEventListener('click',event => {
    event.preventDefault();
    setActiveGroup(link.dataset.catalogNav,{scroll:true});
  }));

  window.addEventListener('popstate',() => {
    const view = new URL(window.location.href).searchParams.get('view');
    setActiveGroup(view === 'setup' ? 'setup' : 'tests',{updateUrl:false});
  });

  updateHeading();
  renderSwitcher();
  renderFilters();
  renderToolCards();
  updateFastNav();

  const previousSetLanguage = setLanguage;
  setLanguage = function tabbedSetLanguage(lang) {
    previousSetLanguage(lang);
    updateHeading();
    renderSwitcher();
    renderFilters();
    renderToolCards();
    updateFastNav();
  };
})();