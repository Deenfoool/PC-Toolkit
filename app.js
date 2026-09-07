const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const translations = {
  en: {
    'nav.tools':'Tools','nav.quick':'Quick check','hero.eyebrow':'Free • local • no install','hero.line1':'Everything you need to','hero.line2':'check your PC.','hero.copy':'A fast browser toolkit for monitor tests, input diagnostics, audio checks and useful hardware calculators. No account. No uploads.','hero.run':'Run PC Check','hero.browse':'Browse tools','trust.browser':'✓ Runs in your browser','trust.private':'✓ Privacy friendly','trust.mobile':'✓ Desktop & mobile','snapshot.kicker':'Your environment','snapshot.title':'Quick system snapshot','snapshot.display':'Display','snapshot.cpu':'CPU threads','snapshot.logical':'Logical processors','snapshot.memory':'Memory','snapshot.estimate':'Browser estimate','snapshot.gpu':'GPU / renderer','tools.kicker':'Browser utilities','tools.title':'Pick a tool and test it now','privacy.kicker':'Privacy first','privacy.title':'Your tests stay on your device.','privacy.copy':'PC Toolkit uses browser APIs to perform tests locally. Microphone access is requested only when you start the mic test, and the audio stream is never uploaded.','footer.tagline':'Test. Diagnose. Calculate.','footer.source':'Source','common.refresh':'Refresh','common.exit':'Exit','common.open':'Open tool','common.start':'Start','common.stop':'Stop','common.clear':'Clear','common.unavailable':'Unavailable','common.browserHidden':'Not exposed by browser','cat.all':'All','cat.monitor':'Monitor','cat.input':'Input','cat.audio':'Audio','cat.hardware':'Hardware','cat.utility':'Utility'
  },
  ru: {
    'nav.tools':'Инструменты','nav.quick':'Быстрая проверка','hero.eyebrow':'Бесплатно • локально • без установки','hero.line1':'Всё, что нужно, чтобы','hero.line2':'проверить свой ПК.','hero.copy':'Быстрый набор браузерных тестов для монитора, устройств ввода, звука и полезных расчётов по железу. Без аккаунта и загрузки данных.','hero.run':'Проверить ПК','hero.browse':'Все инструменты','trust.browser':'✓ Работает в браузере','trust.private':'✓ Данные остаются у вас','trust.mobile':'✓ ПК и смартфоны','snapshot.kicker':'Ваше окружение','snapshot.title':'Быстрый снимок системы','snapshot.display':'Экран','snapshot.cpu':'Потоки CPU','snapshot.logical':'Логические процессоры','snapshot.memory':'Память','snapshot.estimate':'Оценка браузера','snapshot.gpu':'GPU / рендерер','tools.kicker':'Браузерные утилиты','tools.title':'Выберите инструмент и проверьте прямо сейчас','privacy.kicker':'Приватность прежде всего','privacy.title':'Результаты тестов остаются на устройстве.','privacy.copy':'PC Toolkit использует браузерные API и выполняет тесты локально. Доступ к микрофону запрашивается только после запуска теста, аудио никуда не отправляется.','footer.tagline':'Проверяй. Диагностируй. Считай.','footer.source':'Исходники','common.refresh':'Обновить','common.exit':'Выйти','common.open':'Открыть','common.start':'Запустить','common.stop':'Остановить','common.clear':'Очистить','common.unavailable':'Недоступно','common.browserHidden':'Браузер не предоставляет','cat.all':'Все','cat.monitor':'Монитор','cat.input':'Ввод','cat.audio':'Аудио','cat.hardware':'Железо','cat.utility':'Утилиты'
  }
};

const toolText = {
  en: {
    refresh:{title:'Refresh Rate Test',desc:'Measure the display refresh rate using frame timing.',tag:'Monitor'},
    pixels:{title:'Dead Pixel Test',desc:'Fullscreen solid colors for finding stuck and dead pixels.',tag:'Monitor'},
    ghosting:{title:'Ghosting Test',desc:'Moving high-contrast target for checking smearing and overdrive artifacts.',tag:'Monitor'},
    gradient:{title:'Gradient & Banding',desc:'Inspect grayscale, dark tones and RGB gradients for visible banding.',tag:'Monitor'},
    keyboard:{title:'Keyboard Tester',desc:'See key values and physical key codes as you press them.',tag:'Input'},
    mouse:{title:'Mouse Tester',desc:'Check mouse buttons, double-clicks and live pointer coordinates.',tag:'Input'},
    polling:{title:'Mouse Polling Test',desc:'Approximate pointer event rate while you move the mouse continuously.',tag:'Input'},
    gamepad:{title:'Gamepad Tester',desc:'Inspect connected controller buttons and analog axes in real time.',tag:'Input'},
    speaker:{title:'Speaker Test',desc:'Play left, center and right reference tones.',tag:'Audio'},
    microphone:{title:'Microphone Test',desc:'Watch live microphone input level without uploading audio.',tag:'Audio'},
    ram:{title:'RAM Latency',desc:'Estimate first-word CAS latency from MT/s and CL.',tag:'Hardware'},
    ppi:{title:'PPI Calculator',desc:'Calculate pixel density and pixel pitch for a display.',tag:'Hardware'},
    psu:{title:'PSU Headroom',desc:'Estimate practical PSU capacity from component power draw.',tag:'Hardware'},
    download:{title:'Download Time',desc:'Estimate ideal transfer time from file size and connection speed.',tag:'Utility'}
  },
  ru: {
    refresh:{title:'Тест герцовки',desc:'Измеряет частоту обновления экрана по времени отрисовки кадров.',tag:'Монитор'},
    pixels:{title:'Битые пиксели',desc:'Полноэкранные заливки для поиска битых и зависших пикселей.',tag:'Монитор'},
    ghosting:{title:'Ghosting-тест',desc:'Движущаяся контрастная цель для проверки шлейфов и артефактов Overdrive.',tag:'Монитор'},
    gradient:{title:'Градиенты и banding',desc:'Проверка серого, тёмных оттенков и RGB-переходов на полосы.',tag:'Монитор'},
    keyboard:{title:'Тест клавиатуры',desc:'Показывает нажатые клавиши и их физические коды.',tag:'Ввод'},
    mouse:{title:'Тест мыши',desc:'Проверка кнопок, двойных кликов и координат указателя.',tag:'Ввод'},
    polling:{title:'Polling Rate мыши',desc:'Приблизительно измеряет частоту событий указателя при движении мыши.',tag:'Ввод'},
    gamepad:{title:'Тест геймпада',desc:'Кнопки и аналоговые оси подключённого контроллера в реальном времени.',tag:'Ввод'},
    speaker:{title:'Тест колонок',desc:'Эталонный сигнал отдельно в левом, центре и правом канале.',tag:'Аудио'},
    microphone:{title:'Тест микрофона',desc:'Живой уровень сигнала микрофона без отправки аудио на сервер.',tag:'Аудио'},
    ram:{title:'Задержка RAM',desc:'Оценка first-word latency по частоте MT/s и таймингу CL.',tag:'Железо'},
    ppi:{title:'Калькулятор PPI',desc:'Плотность пикселей и размер пикселя по диагонали и разрешению.',tag:'Железо'},
    psu:{title:'Запас мощности БП',desc:'Оценка разумной мощности блока питания по потреблению компонентов.',tag:'Железо'},
    download:{title:'Время загрузки',desc:'Расчёт идеального времени скачивания по размеру файла и скорости.',tag:'Утилита'}
  }
};

const categories = ['all','monitor','input','audio','hardware','utility'];
const tools = [
  {id:'refresh-rate',key:'refresh',category:'monitor',icon:'Hz',featured:true},
  {id:'dead-pixel',key:'pixels',category:'monitor',icon:'▣'},
  {id:'ghosting',key:'ghosting',category:'monitor',icon:'→'},
  {id:'gradient',key:'gradient',category:'monitor',icon:'◫'},
  {id:'keyboard',key:'keyboard',category:'input',icon:'⌨'},
  {id:'mouse',key:'mouse',category:'input',icon:'↖'},
  {id:'mouse-polling',key:'polling',category:'input',icon:'Hz'},
  {id:'gamepad',key:'gamepad',category:'input',icon:'PAD'},
  {id:'speaker',key:'speaker',category:'audio',icon:'L/R'},
  {id:'microphone',key:'microphone',category:'audio',icon:'MIC'},
  {id:'ram',key:'ram',category:'hardware',icon:'RAM'},
  {id:'ppi',key:'ppi',category:'hardware',icon:'PPI'},
  {id:'psu',key:'psu',category:'hardware',icon:'PSU'},
  {id:'download',key:'download',category:'utility',icon:'⇩'}
];

const dialog = $('#dialog');
const dialogContent = $('#dialog-content');
const dialogClose = $('#dialog-close');
const screenTest = $('#screen-test');
const screenStage = $('#screen-stage');
const screenExit = $('#screen-exit');
const screenHelp = $('#screen-help');
let currentLang = localStorage.getItem('pctoolkit-lang') || (navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en');
let currentFilter = 'all';
let cleanup = null;
let micStream = null;
let micAnimation = null;
let audioContext = null;
let screenMode = null;
let screenIndex = 0;

const t = key => translations[currentLang][key] ?? translations.en[key] ?? key;
const tt = key => toolText[currentLang][key] ?? toolText.en[key];

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('pctoolkit-lang', lang);
  document.documentElement.lang = lang;
  document.title = lang === 'ru' ? 'PC Toolkit — проверка и диагностика ПК' : 'PC Toolkit — Test, Diagnose, Calculate';
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-lang]').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
  renderFilters();
  renderToolCards();
  snapshot();
}

function renderFilters() {
  $('#filter-row').innerHTML = categories.map(cat => `<button class="filter ${currentFilter===cat?'active':''}" data-filter="${cat}">${t(`cat.${cat}`)}</button>`).join('');
  $$('.filter').forEach(btn => btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    renderFilters();
    filterCards();
  }));
}

function renderToolCards() {
  $('#tool-grid').innerHTML = tools.map(tool => {
    const text = tt(tool.key);
    return `<article class="tool-card ${tool.featured?'featured':''}" data-category="${tool.category}">
      <div class="tool-icon">${tool.icon}</div><span class="tool-tag">${text.tag}</span>
      <h3>${text.title}</h3><p>${text.desc}</p>
      <button class="card-action" data-open="${tool.id}">${t('common.open')} <span>→</span></button>
    </article>`;
  }).join('');
  $$('[data-open]', $('#tool-grid')).forEach(el => el.addEventListener('click', () => openDialog(el.dataset.open)));
  filterCards();
}

function filterCards() {
  $$('.tool-card').forEach(card => { card.hidden = currentFilter !== 'all' && card.dataset.category !== currentFilter; });
}

function getWebGLRenderer() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return t('common.unavailable');
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  } catch { return t('common.unavailable'); }
}

function detectBrowser() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Microsoft Edge';
  if (/OPR\//.test(ua)) return 'Opera';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari';
  return navigator.appName || t('common.unavailable');
}

function snapshot() {
  $('#snap-display').textContent = `${screen.width} × ${screen.height}`;
  $('#snap-dpr').textContent = `DPR ${window.devicePixelRatio || 1} • ${screen.colorDepth || '—'}-bit`;
  $('#snap-cpu').textContent = navigator.hardwareConcurrency || t('common.unavailable');
  $('#snap-memory').textContent = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : t('common.unavailable');
  $('#snap-gpu').textContent = getWebGLRenderer();
}

const head = (kicker,title,text) => `<div class="tool-head"><p class="kicker">${kicker}</p><h2>${title}</h2><p>${text}</p></div>`;
const resultBox = (value,note) => `<div class="result-box"><div class="big-result">${value}</div><div class="muted">${note}</div></div>`;

function stopActive() {
  if (cleanup) { try { cleanup(); } catch {} cleanup = null; }
  stopMic();
}

function openDialog(name) {
  stopActive();
  const renderers = {
    'system-check': renderSystemCheck,'refresh-rate': renderRefreshRate,'dead-pixel': renderDeadPixel,'ghosting': renderGhosting,'gradient': renderGradient,'keyboard': renderKeyboard,'mouse': renderMouse,'mouse-polling': renderMousePolling,'gamepad': renderGamepad,'speaker': renderSpeaker,'microphone': renderMicrophone,'ram': renderRam,'ppi': renderPpi,'psu': renderPsu,'download': renderDownload
  };
  dialogContent.innerHTML = '';
  const init = renderers[name]?.();
  dialog.showModal();
  if (typeof init === 'function') requestAnimationFrame(() => { cleanup = init() || null; });
}

function renderSystemCheck() {
  const hidden = t('common.browserHidden');
  const memory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : hidden;
  const cpu = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency}` : hidden;
  const connection = navigator.connection?.effectiveType ? `${navigator.connection.effectiveType.toUpperCase()} • ${navigator.connection.downlink || '?'} Mbps` : hidden;
  const labels = currentLang==='ru' ? ['Браузер','Потоки CPU','Память','GPU / WebGL','Глубина цвета','Соединение','Точки касания'] : ['Browser','CPU threads','Memory','GPU / WebGL','Color depth','Connection','Touch points'];
  const intro = currentLang==='ru' ? ['Быстрая проверка','Окружение браузера','Снимок того, что браузер может определить без установки программ. Это не полный инвентарь железа.'] : ['Quick check','Your browser environment','A privacy-friendly snapshot of what the browser can detect without installing software. This is not a full hardware inventory.'];
  dialogContent.innerHTML = `${head(...intro)}<div class="tool-body">${resultBox(`${screen.width} × ${screen.height}`,`DPR ${window.devicePixelRatio||1}`)}<ul class="info-list">
    <li><span>${labels[0]}</span><strong>${detectBrowser()}</strong></li><li><span>${labels[1]}</span><strong>${cpu}</strong></li><li><span>${labels[2]}</span><strong>${memory}</strong></li><li><span>${labels[3]}</span><strong>${getWebGLRenderer()}</strong></li><li><span>${labels[4]}</span><strong>${screen.colorDepth||'—'} bit</strong></li><li><span>${labels[5]}</span><strong>${connection}</strong></li><li><span>${labels[6]}</span><strong>${navigator.maxTouchPoints||0}</strong></li></ul></div>`;
}

function renderRefreshRate() {
  const x = currentLang==='ru' ? ['Монитор','Тест герцовки','Измерение интервалов requestAnimationFrame. Не переключайте вкладку во время замера.','Готово к замеру примерно 2 секунд','Начать измерение'] : ['Monitor','Refresh Rate Test','Measures requestAnimationFrame intervals. Keep this tab visible during the sample.','Ready to sample for about 2 seconds','Start measurement'];
  dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body">${resultBox('<span id="hz-value">—</span> <small>Hz</small>',`<span id="hz-note">${x[3]}</span>`)}<div class="tool-actions"><button class="mini-btn accent" id="hz-start">${x[4]}</button></div></div>`;
  return () => $('#hz-start').addEventListener('click', measureRefreshRate);
}
function measureRefreshRate() {
  const btn=$('#hz-start'), value=$('#hz-value'), note=$('#hz-note'); if(!btn)return;
  btn.disabled=true; value.textContent='…'; note.textContent=currentLang==='ru'?'Собираю кадры…':'Sampling frames…';
  const samples=[]; let last=performance.now(); const start=last;
  const frame=now=>{samples.push(now-last);last=now;if(now-start<2200)return requestAnimationFrame(frame);const clean=samples.slice(10).filter(v=>v>2&&v<50).sort((a,b)=>a-b);const median=clean[Math.floor(clean.length/2)];const hz=median?1000/median:0;value.textContent=hz?hz.toFixed(hz>100?0:1):'—';note.textContent=hz?(currentLang==='ru'?`Медианный интервал ${median.toFixed(2)} мс • ${clean.length} кадров`:`Median frame interval ${median.toFixed(2)} ms • ${clean.length} samples`):(currentLang==='ru'?'Не удалось получить стабильный результат.':'Unable to get a stable sample.');btn.disabled=false;};
  requestAnimationFrame(frame);
}

function renderDeadPixel() {
  const x=currentLang==='ru'?['Монитор','Тест битых пикселей','Переключайтесь между белым, чёрным, красным, зелёным, синим и серым цветами.','Сначала протрите экран: пыль легко принять за битый пиксель.','Запустить на весь экран']:['Monitor','Dead Pixel Test','Cycle through white, black, red, green, blue and gray. Inspect the whole panel.','Clean the screen first: dust is easy to mistake for a dead pixel.','Start fullscreen test'];
  dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="result-box"><strong>${currentLang==='ru'?'Совет':'Tip'}</strong><p class="muted">${x[3]}</p></div><div class="tool-actions"><button class="mini-btn accent" id="pixel-start">${x[4]}</button></div></div>`;
  return()=>$('#pixel-start').addEventListener('click',()=>startScreenTest('pixels'));
}

function renderGhosting() {
  const x=currentLang==='ru'?['Монитор','Ghosting-тест','Следите за белым блоком на тёмном фоне. Длинный след за объектом может указывать на медленный отклик или агрессивный Overdrive.','Скорость','Медленно','Средне','Быстро','Запустить']:['Monitor','Ghosting Test','Watch the white target on the dark background. Long trails can reveal slow pixel response or aggressive overdrive.','Speed','Slow','Medium','Fast','Start test'];
  dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="field"><label>${x[3]}</label><select id="ghost-speed"><option value="2.2">${x[4]}</option><option value="1.2" selected>${x[5]}</option><option value="0.7">${x[6]}</option></select></div><div class="tool-actions"><button class="mini-btn accent" id="ghost-start">${x[7]}</button></div></div>`;
  return()=>$('#ghost-start').addEventListener('click',()=>startScreenTest('ghosting',{duration:$('#ghost-speed').value}));
}

function renderGradient() {
  const x=currentLang==='ru'?['Монитор','Градиенты и banding','Полноэкранные плавные переходы помогают заметить цветовые полосы, потерю деталей в тенях и неравномерность.','Нажимайте на экран, чтобы переключать серый, RGB и тёмный градиенты.','Запустить']:['Monitor','Gradient & Banding','Fullscreen gradients help reveal visible banding, crushed dark tones and uneven transitions.','Click the screen to cycle grayscale, RGB and dark gradients.','Start test'];
  dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="result-box"><p class="muted">${x[3]}</p></div><div class="tool-actions"><button class="mini-btn accent" id="gradient-start">${x[4]}</button></div></div>`;
  return()=>$('#gradient-start').addEventListener('click',()=>startScreenTest('gradient'));
}

const pixelColors=['#fff','#000','#f00','#0f0','#00f','#808080'];
const gradientClasses=['gradient-gray','gradient-rgb','gradient-dark'];
function startScreenTest(mode,opts={}) {
  dialog.close(); screenMode=mode; screenIndex=0; screenTest.hidden=false; screenStage.className='screen-stage'; screenStage.innerHTML='';
  if(mode==='pixels'){screenStage.style.background=pixelColors[0];screenHelp.textContent=currentLang==='ru'?'Клик / тап — следующий цвет • Esc — выход':'Click / tap — next color • Esc — exit';}
  if(mode==='gradient'){screenStage.classList.add('gradient-stage',gradientClasses[0]);screenHelp.textContent=currentLang==='ru'?'Клик / тап — следующий градиент • Esc — выход':'Click / tap — next gradient • Esc — exit';}
  if(mode==='ghosting'){screenStage.innerHTML='<div class="ghost-track"><div class="ghost-object"></div></div>';screenStage.style.setProperty('--ghost-duration',`${opts.duration||1.2}s`);screenHelp.textContent=currentLang==='ru'?'Наблюдайте за шлейфом объекта • Esc — выход':'Watch the moving target for trails • Esc — exit';}
  document.documentElement.requestFullscreen?.().catch(()=>{});
}
function nextScreenPattern(e){if(e.target===screenExit||screenMode==='ghosting')return;screenIndex++;if(screenMode==='pixels'){screenStage.style.background=pixelColors[screenIndex%pixelColors.length];}if(screenMode==='gradient'){gradientClasses.forEach(c=>screenStage.classList.remove(c));screenStage.classList.add(gradientClasses[screenIndex%gradientClasses.length]);}}
function stopScreenTest(){screenTest.hidden=true;screenMode=null;screenStage.innerHTML='';screenStage.removeAttribute('style');if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});}

function renderKeyboard() {
  const x=currentLang==='ru'?['Ввод','Тест клавиатуры','Нажимайте клавиши — браузер покажет символ и физический код.','Кликните сюда и нажимайте клавиши…','Очистить']:['Input','Keyboard Tester','Press keys to see the reported value and physical key code.','Click here, then press some keys…','Clear'];
  dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="key-log" id="key-log"><span class="muted">${x[3]}</span></div><div class="tool-actions"><button class="mini-btn" id="key-clear">${x[4]}</button></div></div>`;
  return()=>{const log=$('#key-log');log.tabIndex=0;log.focus();const handler=e=>{if(!dialog.open||!$('#key-log'))return;e.preventDefault();$('.muted',log)?.remove();const pill=document.createElement('span');pill.className='key-pill';pill.textContent=`${e.key===' '?'Space':e.key} · ${e.code}`;log.prepend(pill);while(log.children.length>20)log.lastElementChild.remove();};document.addEventListener('keydown',handler);$('#key-clear').addEventListener('click',()=>{log.innerHTML=`<span class="muted">${x[3]}</span>`;log.focus();});return()=>document.removeEventListener('keydown',handler);};
}

function renderMouse() {
  const x=currentLang==='ru'?['Ввод','Тест мыши','Проверяйте кнопки, двойные клики и движение указателя в области теста.','Двигайте мышь и нажимайте здесь','Последняя кнопка','Всего кликов','Двойных кликов','Позиция']:['Input','Mouse Tester','Use the test area to verify buttons, double-clicks and pointer movement.','Move and click here','Last button','Total clicks','Double-clicks','Position'];
  dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="mouse-pad" id="mouse-pad">${x[3]}</div><ul class="info-list"><li><span>${x[4]}</span><strong id="mouse-button">—</strong></li><li><span>${x[5]}</span><strong id="mouse-clicks">0</strong></li><li><span>${x[6]}</span><strong id="mouse-dbl">0</strong></li><li><span>${x[7]}</span><strong id="mouse-pos">—</strong></li></ul></div>`;
  return()=>{const pad=$('#mouse-pad');let clicks=0,dbl=0;const names=currentLang==='ru'?['Левая','Средняя','Правая','Назад','Вперёд']:['Left','Middle','Right','Back','Forward'];pad.addEventListener('contextmenu',e=>e.preventDefault());pad.addEventListener('pointermove',e=>{const r=pad.getBoundingClientRect();$('#mouse-pos').textContent=`${Math.round(e.clientX-r.left)}, ${Math.round(e.clientY-r.top)}`;});pad.addEventListener('pointerdown',e=>{clicks++;$('#mouse-clicks').textContent=clicks;$('#mouse-button').textContent=names[e.button]||`Button ${e.button}`;});pad.addEventListener('dblclick',()=>{$('#mouse-dbl').textContent=++dbl;});};
}

function renderMousePolling() {
  const x=currentLang==='ru'?['Ввод','Polling Rate мыши','Двигайте мышь быстро и непрерывно внутри поля. Это частота событий браузера, а не лабораторное измерение USB polling rate.','Двигайте мышь здесь','Текущая оценка','Пиковая оценка','Событий в выборке']:['Input','Mouse Polling Test','Move the mouse quickly and continuously inside the area. This measures browser pointer events, not raw USB polling rate.','Move the mouse here','Current estimate','Peak estimate','Events in sample'];
  dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="mouse-pad" id="poll-pad">${x[3]}</div><ul class="info-list"><li><span>${x[4]}</span><strong id="poll-now">— Hz</strong></li><li><span>${x[5]}</span><strong id="poll-peak">— Hz</strong></li><li><span>${x[6]}</span><strong id="poll-events">0</strong></li></ul></div>`;
  return()=>{const pad=$('#poll-pad');const times=[];let peak=0;const handler=e=>{const batch=e.getCoalescedEvents?e.getCoalescedEvents():[e];const now=performance.now();for(let i=0;i<batch.length;i++)times.push(now+i*0.001);while(times.length>120)times.shift();if(times.length>8){const intervals=[];for(let i=1;i<times.length;i++)intervals.push(times[i]-times[i-1]);const useful=intervals.filter(v=>v>.05&&v<50).sort((a,b)=>a-b);const median=useful[Math.floor(useful.length/2)];const hz=median?1000/median:0;if(Number.isFinite(hz)&&hz<10000){peak=Math.max(peak,hz);$('#poll-now').textContent=`${Math.round(hz)} Hz`;$('#poll-peak').textContent=`${Math.round(peak)} Hz`;}}$('#poll-events').textContent=times.length;};pad.addEventListener('pointermove',handler);return()=>pad.removeEventListener('pointermove',handler);};
}

function renderGamepad() {
  const x=currentLang==='ru'?['Ввод','Тест геймпада','Подключите контроллер и нажмите любую кнопку. Поддержка зависит от браузера и Gamepad API.','Геймпад не найден. Нажмите кнопку на контроллере.']:['Input','Gamepad Tester','Connect a controller and press any button. Availability depends on the browser Gamepad API.','No gamepad detected. Press a button on the controller.'];
  dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="gamepad-grid" id="gamepad-grid"><div class="result-box"><span class="muted">${x[3]}</span></div></div></div>`;
  return()=>{let raf;const draw=()=>{const pads=[...(navigator.getGamepads?.()||[])].filter(Boolean);const grid=$('#gamepad-grid');if(!grid)return;if(!pads.length){grid.innerHTML=`<div class="result-box"><span class="muted">${x[3]}</span></div>`;}else{grid.innerHTML=pads.map(p=>`<div class="gamepad-card"><strong>${escapeHtml(p.id)}</strong><div class="muted">${p.mapping||'standard'} • ${p.buttons.length} buttons • ${p.axes.length} axes</div><div class="pad-buttons">${p.buttons.map((b,i)=>`<span class="pad-button ${b.pressed?'active':''}" title="${b.value.toFixed(2)}">${i}</span>`).join('')}</div><div class="axes">${p.axes.map((a,i)=>`<div class="axis">Axis ${i}: ${a.toFixed(2)}<div class="axis-track"><div class="axis-fill" style="width:${Math.min(100,Math.max(0,(a+1)*50))}%"></div></div></div>`).join('')}</div></div>`).join('');}raf=requestAnimationFrame(draw);};draw();return()=>cancelAnimationFrame(raf);};
}
function escapeHtml(str=''){return str.replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));}

function tone(pan=0){audioContext||=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume?.();const osc=audioContext.createOscillator(),gain=audioContext.createGain(),panner=audioContext.createStereoPanner?audioContext.createStereoPanner():null;osc.frequency.value=440;gain.gain.setValueAtTime(.0001,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.12,audioContext.currentTime+.02);gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.7);if(panner){panner.pan.value=pan;osc.connect(gain).connect(panner).connect(audioContext.destination)}else osc.connect(gain).connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.72)}
function renderSpeaker(){const x=currentLang==='ru'?['Аудио','Тест колонок','Используйте умеренную громкость. Центральный тон должен одинаково звучать в обоих каналах.','Левый','Центр','Правый']:['Audio','Speaker Test','Use a moderate volume. The center tone should sound equally strong in both channels.','Left','Center','Right'];dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body">${resultBox('L · C · R','440 Hz')}<div class="tool-actions"><button class="mini-btn" data-pan="-1">${x[3]}</button><button class="mini-btn accent" data-pan="0">${x[4]}</button><button class="mini-btn" data-pan="1">${x[5]}</button></div></div>`;return()=>$$('[data-pan]',dialogContent).forEach(btn=>btn.addEventListener('click',()=>tone(Number(btn.dataset.pan))));}

function renderMicrophone(){const x=currentLang==='ru'?['Аудио','Тест микрофона','Браузер запросит доступ к микрофону. Анализ идёт локально, звук не отправляется.','Доступ будет запрошен только после запуска.','Запустить микрофон','Остановить']:['Audio','Microphone Test','The browser will request microphone permission. Audio is analyzed locally and never uploaded.','Permission is requested only after you press Start.','Start microphone','Stop'];dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="result-box"><div class="level-track"><div class="level-bar" id="mic-level"></div></div><p class="muted" id="mic-note">${x[3]}</p></div><div class="tool-actions"><button class="mini-btn accent" id="mic-start">${x[4]}</button><button class="mini-btn" id="mic-stop" disabled>${x[5]}</button></div></div>`;return()=>{$('#mic-start').addEventListener('click',startMic);$('#mic-stop').addEventListener('click',stopMic);};}
async function startMic(){const note=$('#mic-note');try{micStream=await navigator.mediaDevices.getUserMedia({audio:true});audioContext||=new(window.AudioContext||window.webkitAudioContext)();await audioContext.resume?.();const source=audioContext.createMediaStreamSource(micStream),analyser=audioContext.createAnalyser();analyser.fftSize=1024;source.connect(analyser);const data=new Uint8Array(analyser.fftSize);$('#mic-start').disabled=true;$('#mic-stop').disabled=false;note.textContent=currentLang==='ru'?'Слушаю локально…':'Listening locally…';const draw=()=>{if(!micStream||!$('#mic-level'))return;analyser.getByteTimeDomainData(data);let sum=0;for(const value of data){const v=(value-128)/128;sum+=v*v}const rms=Math.sqrt(sum/data.length);$('#mic-level').style.width=`${Math.min(100,rms*360)}%`;micAnimation=requestAnimationFrame(draw)};draw()}catch(err){if(note)note.textContent=currentLang==='ru'?`Микрофон недоступен: ${err.name||'нет разрешения'}`:`Microphone unavailable: ${err.name||'permission denied'}`;}}
function stopMic(){if(micAnimation)cancelAnimationFrame(micAnimation);micAnimation=null;if(micStream)micStream.getTracks().forEach(track=>track.stop());micStream=null;const level=$('#mic-level');if(level)level.style.width='0%';const start=$('#mic-start');if(start)start.disabled=false;const stop=$('#mic-stop');if(stop)stop.disabled=true;}

function renderRam(){const x=currentLang==='ru'?['Железо','Задержка RAM','Упрощённая оценка first-word CAS latency. Чем ниже — тем лучше при прочих равных.','Скорость памяти (MT/s)','CAS latency (CL)','Приблизительная first-word latency']:['Hardware','RAM First-Word Latency','A simplified estimate of first-word CAS latency. Lower is better when other factors are similar.','Memory speed (MT/s)','CAS latency (CL)','Approx. first-word latency'];dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="form-grid"><div class="field"><label>${x[3]}</label><input id="ram-speed" type="number" min="1" value="6000"></div><div class="field"><label>${x[4]}</label><input id="ram-cl" type="number" min="1" value="30"></div></div><div class="result-box" style="margin-top:14px"><div class="big-result"><span id="ram-result">10.0</span> <small>ns</small></div><div class="muted">${x[5]}</div></div></div>`;return()=>{const calc=()=>{const mt=Number($('#ram-speed').value),cl=Number($('#ram-cl').value);$('#ram-result').textContent=mt>0&&cl>0?((cl*2000)/mt).toFixed(2):'—'};$('#ram-speed').addEventListener('input',calc);$('#ram-cl').addEventListener('input',calc);calc();};}
function renderPpi(){const x=currentLang==='ru'?['Железо','Калькулятор PPI','Плотность пикселей по разрешению и диагонали экрана.','Ширина (px)','Высота (px)','Диагональ (дюймы)','Шаг пикселя']:['Hardware','PPI Calculator','Calculate pixel density from resolution and display diagonal.','Width (px)','Height (px)','Diagonal (inches)','Pixel pitch'];dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="form-grid"><div class="field"><label>${x[3]}</label><input id="ppi-w" type="number" value="2560"></div><div class="field"><label>${x[4]}</label><input id="ppi-h" type="number" value="1440"></div><div class="field"><label>${x[5]}</label><input id="ppi-d" type="number" step="0.1" value="27"></div></div><div class="result-box" style="margin-top:14px"><div class="big-result"><span id="ppi-result">108.8</span> <small>PPI</small></div><div class="muted" id="ppi-pitch"></div></div></div>`;return()=>{const calc=()=>{const w=Number($('#ppi-w').value),h=Number($('#ppi-h').value),d=Number($('#ppi-d').value),ppi=d>0?Math.hypot(w,h)/d:0;$('#ppi-result').textContent=ppi?ppi.toFixed(1):'—';$('#ppi-pitch').textContent=ppi?`${x[6]} ${(25.4/ppi).toFixed(3)} mm`:'—'};['#ppi-w','#ppi-h','#ppi-d'].forEach(id=>$(id).addEventListener('input',calc));calc();};}
function renderPsu(){const x=currentLang==='ru'?['Железо','Запас мощности БП','Быстрая оценка мощности. Она не оценивает качество конкретной модели блока питания.','GPU (W)','CPU (W)','Остальные компоненты (W)','Запас (%)','Рекомендуемая мощность','Расчётное потребление']:['Hardware','PSU Headroom Calculator','A quick capacity estimate. It does not rate PSU quality or transient behavior of a specific model.','GPU power (W)','CPU power (W)','Other components (W)','Headroom (%)','Recommended capacity','Estimated system draw'];dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="form-grid"><div class="field"><label>${x[3]}</label><input id="psu-gpu" type="number" value="250"></div><div class="field"><label>${x[4]}</label><input id="psu-cpu" type="number" value="125"></div><div class="field"><label>${x[5]}</label><input id="psu-other" type="number" value="80"></div><div class="field"><label>${x[6]}</label><input id="psu-headroom" type="number" value="35"></div></div><div class="result-box" style="margin-top:14px"><div class="big-result"><span id="psu-result">650</span> <small>W</small></div><div class="muted" id="psu-load"></div></div></div>`;return()=>{const calc=()=>{const gpu=Number($('#psu-gpu').value)||0,cpu=Number($('#psu-cpu').value)||0,other=Number($('#psu-other').value)||0,h=Math.max(0,Number($('#psu-headroom').value)||0),draw=gpu+cpu+other,recommended=Math.ceil(draw*(1+h/100)/50)*50;$('#psu-result').textContent=recommended||'—';$('#psu-load').textContent=`${x[8]}: ${draw} W • ${x[6]}: ${h}%`};['#psu-gpu','#psu-cpu','#psu-other','#psu-headroom'].forEach(id=>$(id).addEventListener('input',calc));calc();};}
function renderDownload(){const x=currentLang==='ru'?['Утилита','Время загрузки','Идеальное время скачивания. Реальная скорость обычно ниже из-за накладных расходов и ограничений сервера.','Размер файла (GB)','Скорость (Mbps)','Идеальное время передачи']:['Utility','Download Time Calculator','Estimate ideal transfer time. Real downloads are usually slower because of overhead and server limits.','File size (GB)','Connection (Mbps)','Ideal transfer time'];dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="form-grid"><div class="field"><label>${x[3]}</label><input id="dl-size" type="number" step="0.1" value="80"></div><div class="field"><label>${x[4]}</label><input id="dl-speed" type="number" step="0.1" value="100"></div></div><div class="result-box" style="margin-top:14px"><div class="big-result" id="dl-result"></div><div class="muted">${x[5]}</div></div></div>`;return()=>{const format=sec=>{if(!isFinite(sec)||sec<=0)return'—';const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=Math.round(sec%60);return currentLang==='ru'?[h?`${h} ч`:null,(h||m)?`${m} мин`:null,`${s} с`].filter(Boolean).join(' '):[h?`${h}h`:null,(h||m)?`${m}m`:null,`${s}s`].filter(Boolean).join(' ')};const calc=()=>{$('#dl-result').textContent=format((Number($('#dl-size').value)*8*1000)/Number($('#dl-speed').value))};$('#dl-size').addEventListener('input',calc);$('#dl-speed').addEventListener('input',calc);calc();};}

$$('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
$$('[data-open]').forEach(el=>el.addEventListener('click',()=>openDialog(el.dataset.open)));
$('#refresh-snapshot').addEventListener('click',snapshot);
dialogClose.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog.addEventListener('close',stopActive);
screenTest.addEventListener('click',nextScreenPattern);
screenExit.addEventListener('click',e=>{e.stopPropagation();stopScreenTest();});
document.addEventListener('keydown',e=>{if(!screenTest.hidden&&e.key==='Escape')stopScreenTest();});
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&!screenTest.hidden)stopScreenTest();});

setLanguage(currentLang);
