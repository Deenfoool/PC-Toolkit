(() => {
  const iconFor = {
    'refresh-rate':'gauge',
    'dead-pixel':'grid-2x2',
    'ghosting':'move-horizontal',
    'gradient':'blend',
    'keyboard':'keyboard',
    'mouse':'mouse-pointer-2',
    'mouse-polling':'radio-tower',
    'gamepad':'gamepad-2',
    'speaker':'volume-2',
    'microphone':'mic',
    'ram':'memory-stick',
    'ppi':'scan-line',
    'psu':'plug-zap',
    'download':'download',
    'fps-stability':'chart-line',
    'contrast':'contrast',
    'color-test':'palette',
    'pc-report':'clipboard-list'
  };

  const newText = {
    en: {
      fps:{title:'FPS Stability Test',desc:'Measure frame pacing, average FPS, 1% low and jitter in the browser.',tag:'Monitor'},
      contrast:{title:'Contrast & Shadow Test',desc:'Fullscreen patterns for black detail, white detail and checkerboard contrast.',tag:'Monitor'},
      color:{title:'Color Test',desc:'Fullscreen RGB bars, grayscale steps and saturation patterns.',tag:'Monitor'},
      report:{title:'PC Report',desc:'Build a copyable browser/system report for support, troubleshooting or sharing.',tag:'Utility'}
    },
    ru: {
      fps:{title:'Стабильность FPS',desc:'Замер frame pacing, среднего FPS, 1% low и джиттера прямо в браузере.',tag:'Монитор'},
      contrast:{title:'Контраст и тени',desc:'Полноэкранные шаблоны для деталей в чёрном, белом и контрастной сетки.',tag:'Монитор'},
      color:{title:'Тест цветов',desc:'Полноэкранные RGB-полосы, градации серого и тест насыщенности.',tag:'Монитор'},
      report:{title:'Отчёт о ПК',desc:'Создаёт копируемый отчёт об окружении браузера для поддержки и диагностики.',tag:'Утилита'}
    }
  };

  Object.assign(toolText.en, newText.en);
  Object.assign(toolText.ru, newText.ru);

  for (const tool of tools) {
    const icon = iconFor[tool.id];
    if (icon) tool.icon = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
  }

  const additions = [
    {id:'fps-stability',key:'fps',category:'monitor',icon:`<i data-lucide="chart-line" aria-hidden="true"></i>`},
    {id:'contrast',key:'contrast',category:'monitor',icon:`<i data-lucide="contrast" aria-hidden="true"></i>`},
    {id:'color-test',key:'color',category:'monitor',icon:`<i data-lucide="palette" aria-hidden="true"></i>`},
    {id:'pc-report',key:'report',category:'utility',icon:`<i data-lucide="clipboard-list" aria-hidden="true"></i>`,featured:true}
  ];
  additions.forEach(item => {
    if (!tools.some(tool => tool.id === item.id)) tools.push(item);
  });

  function refreshLucide() {
    if (window.lucide?.createIcons) {
      window.lucide.createIcons({attrs:{'stroke-width':1.8}});
    }
  }

  function decorateStaticIcons() {
    const gitHubLinks = $$('.top-nav a[href*="github.com"], .footer-links a[href*="github.com"]');
    gitHubLinks.forEach(link => {
      if (!link.querySelector('svg') && !link.querySelector('[data-lucide]')) {
        const raw = link.textContent.replace('↗','').trim();
        link.innerHTML = `${raw} <i data-lucide="external-link" aria-hidden="true"></i>`;
      }
    });

    $$('.trust-row span').forEach(span => {
      const clean = span.textContent.replace(/^✓\s*/, '');
      span.innerHTML = `<i data-lucide="check" aria-hidden="true"></i><span>${clean}</span>`;
    });

    const close = $('#dialog-close');
    if (close) close.innerHTML = '<i data-lucide="x" aria-hidden="true"></i>';

    const screenClose = $('#screen-exit');
    if (screenClose && !screenClose.querySelector('[data-lucide]')) {
      const label = screenClose.textContent.trim();
      screenClose.innerHTML = `<i data-lucide="x" aria-hidden="true"></i><span>${label}</span>`;
    }
    refreshLucide();
  }

  const originalRenderToolCards = renderToolCards;
  renderToolCards = function patchedRenderToolCards() {
    originalRenderToolCards();
    $$('.card-action span', $('#tool-grid')).forEach(span => {
      span.innerHTML = '<i data-lucide="arrow-right" aria-hidden="true"></i>';
    });
    refreshLucide();
  };

  const originalSetLanguage = setLanguage;
  setLanguage = function patchedSetLanguage(lang) {
    originalSetLanguage(lang);
    decorateStaticIcons();
  };

  function renderFpsStability() {
    const ru = currentLang === 'ru';
    const x = ru
      ? ['Монитор','Стабильность FPS','Тест длится 6 секунд и оценивает плавность кадров в текущей вкладке. Не переключайтесь между окнами во время замера.','Готов к тесту','Запустить 6-секундный тест','Средний FPS','1% low','Джиттер','Просадки']
      : ['Monitor','FPS Stability Test','The test runs for 6 seconds and evaluates frame pacing in this tab. Keep the tab visible during the sample.','Ready to test','Run 6-second test','Average FPS','1% low','Jitter','Frame drops'];
    dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body">
      <div class="fps-metrics">
        <div class="metric-card"><span>${x[5]}</span><strong id="fps-avg">—</strong></div>
        <div class="metric-card"><span>${x[6]}</span><strong id="fps-low">—</strong></div>
        <div class="metric-card"><span>${x[7]}</span><strong id="fps-jitter">—</strong></div>
        <div class="metric-card"><span>${x[8]}</span><strong id="fps-drops">—</strong></div>
      </div>
      <canvas class="fps-canvas" id="fps-canvas" width="720" height="210" aria-label="Frame time chart"></canvas>
      <div class="result-box compact-result"><span class="muted" id="fps-note">${x[3]}</span></div>
      <div class="tool-actions"><button class="mini-btn accent" id="fps-start"><i data-lucide="play" aria-hidden="true"></i><span>${x[4]}</span></button></div>
    </div>`;
    refreshLucide();
    return () => $('#fps-start').addEventListener('click', runFpsStability);
  }

  function runFpsStability() {
    const button = $('#fps-start');
    const note = $('#fps-note');
    const canvas = $('#fps-canvas');
    if (!button || !canvas) return;
    button.disabled = true;
    note.textContent = currentLang === 'ru' ? 'Собираю frame times…' : 'Collecting frame times…';
    const samples = [];
    let last = performance.now();
    const started = last;

    const frame = now => {
      const delta = now - last;
      last = now;
      if (delta > 1 && delta < 200) samples.push(delta);
      drawFpsChart(canvas, samples.slice(-180));
      if (now - started < 6000) return requestAnimationFrame(frame);

      const clean = samples.slice(10);
      if (!clean.length) {
        note.textContent = currentLang === 'ru' ? 'Недостаточно данных.' : 'Not enough data.';
        button.disabled = false;
        return;
      }
      const mean = clean.reduce((a,b)=>a+b,0)/clean.length;
      const avgFps = 1000/mean;
      const sorted = [...clean].sort((a,b)=>b-a);
      const worstCount = Math.max(1, Math.ceil(sorted.length * .01));
      const worstMean = sorted.slice(0,worstCount).reduce((a,b)=>a+b,0)/worstCount;
      const oneLow = 1000/worstMean;
      const variance = clean.reduce((sum,v)=>sum+(v-mean)**2,0)/clean.length;
      const jitter = Math.sqrt(variance);
      const medianSorted = [...clean].sort((a,b)=>a-b);
      const median = medianSorted[Math.floor(medianSorted.length/2)];
      const drops = clean.filter(v=>v > median * 1.5).length;

      $('#fps-avg').textContent = avgFps.toFixed(avgFps >= 100 ? 0 : 1);
      $('#fps-low').textContent = oneLow.toFixed(oneLow >= 100 ? 0 : 1);
      $('#fps-jitter').textContent = `${jitter.toFixed(2)} ms`;
      $('#fps-drops').textContent = `${drops}`;
      note.textContent = currentLang === 'ru'
        ? `Медианный frame time: ${median.toFixed(2)} мс • ${clean.length} кадров. Результат зависит от браузера и нагрузки системы.`
        : `Median frame time: ${median.toFixed(2)} ms • ${clean.length} frames. Results depend on browser and system load.`;
      button.disabled = false;
    };
    requestAnimationFrame(frame);
  }

  function drawFpsChart(canvas, samples) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle = 'rgba(255,255,255,.08)';
    ctx.lineWidth = 1;
    for (let y=1;y<4;y++) {
      ctx.beginPath(); ctx.moveTo(0,(h/4)*y); ctx.lineTo(w,(h/4)*y); ctx.stroke();
    }
    if (samples.length < 2) return;
    const max = Math.max(35, ...samples);
    ctx.strokeStyle = '#8cff4f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    samples.forEach((v,i)=>{
      const x = (i/(samples.length-1))*w;
      const y = h - Math.min(h, (v/max)*h);
      i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
    });
    ctx.stroke();
  }

  const contrastPatterns = ['contrast-checker','contrast-shadows','contrast-highlights'];
  const colorPatterns = ['color-bars','color-steps','color-saturation'];

  function renderContrast() {
    const ru = currentLang === 'ru';
    const x = ru
      ? ['Монитор','Контраст и тени','Три полноэкранных паттерна: шахматный контраст, почти чёрные ступени и почти белые ступени.','Кликните по экрану для переключения паттернов.','Запустить']
      : ['Monitor','Contrast & Shadow Test','Three fullscreen patterns: checkerboard contrast, near-black steps and near-white steps.','Click the screen to switch patterns.','Start test'];
    dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body"><div class="result-box"><span class="muted">${x[3]}</span></div><div class="tool-actions"><button class="mini-btn accent" id="contrast-start"><i data-lucide="maximize" aria-hidden="true"></i><span>${x[4]}</span></button></div></div>`;
    refreshLucide();
    return () => $('#contrast-start').addEventListener('click', () => startPatternTest('contrast'));
  }

  function renderColorTest() {
    const ru = currentLang === 'ru';
    const x = ru
      ? ['Монитор','Тест цветов','RGB-полосы, ступени серого и насыщенные цветовые блоки для быстрой визуальной проверки панели.','Кликните по экрану для переключения паттернов.','Запустить']
      : ['Monitor','Color Test','RGB bars, grayscale steps and saturated color blocks for a quick visual panel check.','Click the screen to switch patterns.','Start test'];
    dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body"><div class="result-box"><span class="muted">${x[3]}</span></div><div class="tool-actions"><button class="mini-btn accent" id="color-start"><i data-lucide="maximize" aria-hidden="true"></i><span>${x[4]}</span></button></div></div>`;
    refreshLucide();
    return () => $('#color-start').addEventListener('click', () => startPatternTest('color'));
  }

  function startPatternTest(mode) {
    dialog.close();
    screenMode = mode;
    screenIndex = 0;
    screenTest.hidden = false;
    screenStage.className = 'screen-stage pattern-stage';
    screenStage.innerHTML = '';
    screenStage.removeAttribute('style');
    applyPattern(mode, 0);
    screenHelp.textContent = currentLang === 'ru' ? 'Клик / тап — следующий паттерн • Esc — выход' : 'Click / tap — next pattern • Esc — exit';
    document.documentElement.requestFullscreen?.().catch(()=>{});
  }

  function applyPattern(mode, index) {
    const all = [...contrastPatterns, ...colorPatterns];
    all.forEach(name => screenStage.classList.remove(name));
    const list = mode === 'contrast' ? contrastPatterns : colorPatterns;
    screenStage.classList.add(list[index % list.length]);
    if (mode === 'contrast') {
      if (index % list.length === 1) screenStage.innerHTML = makeToneSteps(false);
      else if (index % list.length === 2) screenStage.innerHTML = makeToneSteps(true);
      else screenStage.innerHTML = '';
    } else if (mode === 'color') {
      screenStage.innerHTML = index % list.length === 1 ? makeGraySteps() : '';
    }
  }

  function makeToneSteps(light) {
    const values = light ? [255,253,251,248,245,242,238,234] : [0,2,4,6,8,11,14,18];
    return `<div class="tone-steps">${values.map((v,i)=>`<div style="background:rgb(${v},${v},${v})"><span>${i}</span></div>`).join('')}</div>`;
  }

  function makeGraySteps() {
    return `<div class="gray-steps">${Array.from({length:16},(_,i)=>{const v=Math.round((i/15)*255);return `<div style="background:rgb(${v},${v},${v})"><span>${i}</span></div>`}).join('')}</div>`;
  }

  screenTest.addEventListener('click', e => {
    if (e.target === screenExit) return;
    if (screenMode === 'contrast' || screenMode === 'color') applyPattern(screenMode, screenIndex);
  });

  function renderPcReport() {
    const ru = currentLang === 'ru';
    const x = ru
      ? ['Утилита','Отчёт о ПК','Браузер не видит всё железо, но этот отчёт удобно отправлять в поддержку или прикладывать к описанию проблемы.','Скопировать отчёт','Скопировано','Обновить отчёт']
      : ['Utility','PC Report','The browser cannot see every hardware detail, but this report is useful for support and troubleshooting.','Copy report','Copied','Refresh report'];
    const report = buildPcReport();
    dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body"><textarea class="report-output" id="report-output" readonly>${escapeHtml(report)}</textarea><div class="tool-actions"><button class="mini-btn accent" id="report-copy"><i data-lucide="copy" aria-hidden="true"></i><span>${x[3]}</span></button><button class="mini-btn" id="report-refresh"><i data-lucide="refresh-cw" aria-hidden="true"></i><span>${x[5]}</span></button></div><div class="muted report-note" id="report-note"></div></div>`;
    refreshLucide();
    return () => {
      $('#report-copy').addEventListener('click', async () => {
        const text = $('#report-output').value;
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          $('#report-output').select();
          document.execCommand?.('copy');
        }
        $('#report-note').textContent = x[4];
      });
      $('#report-refresh').addEventListener('click', () => {
        $('#report-output').value = buildPcReport();
        $('#report-note').textContent = '';
      });
    };
  }

  function buildPcReport() {
    const ru = currentLang === 'ru';
    const connection = navigator.connection;
    const rows = [
      ['PC Toolkit', 'Browser System Report'],
      [ru?'Дата':'Date', new Date().toLocaleString()],
      [ru?'Браузер':'Browser', detectBrowser()],
      [ru?'User Agent':'User Agent', navigator.userAgent],
      [ru?'Платформа':'Platform', navigator.userAgentData?.platform || navigator.platform || '—'],
      [ru?'Экран':'Display', `${screen.width} × ${screen.height}`],
      ['DPR', window.devicePixelRatio || 1],
      [ru?'Viewport':'Viewport', `${window.innerWidth} × ${window.innerHeight}`],
      [ru?'Глубина цвета':'Color depth', `${screen.colorDepth || '—'} bit`],
      [ru?'Потоки CPU':'CPU threads', navigator.hardwareConcurrency || '—'],
      [ru?'Память браузера':'Browser memory estimate', navigator.deviceMemory ? `${navigator.deviceMemory} GB` : '—'],
      ['GPU / WebGL', getWebGLRenderer()],
      [ru?'Точки касания':'Touch points', navigator.maxTouchPoints || 0],
      [ru?'Соединение':'Connection', connection?.effectiveType ? `${connection.effectiveType.toUpperCase()} / ${connection.downlink || '?'} Mbps` : '—'],
      [ru?'Язык':'Language', navigator.language || '—'],
      [ru?'Часовой пояс':'Time zone', Intl.DateTimeFormat().resolvedOptions().timeZone || '—']
    ];
    return rows.map(([key,value]) => `${key}: ${value}`).join('\n');
  }

  const originalOpenDialog = openDialog;
  openDialog = function patchedOpenDialog(name) {
    if (!['fps-stability','contrast','color-test','pc-report'].includes(name)) return originalOpenDialog(name);
    stopActive();
    const renderers = {
      'fps-stability':renderFpsStability,
      'contrast':renderContrast,
      'color-test':renderColorTest,
      'pc-report':renderPcReport
    };
    dialogContent.innerHTML = '';
    const init = renderers[name]();
    dialog.showModal();
    requestAnimationFrame(() => { cleanup = typeof init === 'function' ? (init() || null) : null; refreshLucide(); });
  };

  renderToolCards();
  decorateStaticIcons();
})();
