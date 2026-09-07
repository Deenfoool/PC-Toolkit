(() => {
  const ruNow = () => currentLang === 'ru';
  const refreshV4Icons = () => window.lucide?.createIcons?.({attrs:{'stroke-width':1.8}});

  const v4Text = {
    en: {
      sharpness:{title:'Sharpness & Geometry',desc:'Fullscreen pixel grids, fine lines and geometry patterns for focus and scaling checks.',tag:'Monitor'},
      full:{title:'Full PC Check',desc:'Guided browser diagnostics for display timing, input events and environment capabilities.',tag:'Utility'}
    },
    ru: {
      sharpness:{title:'Резкость и геометрия',desc:'Полноэкранные сетки, тонкие линии и геометрические паттерны для проверки резкости и масштабирования.',tag:'Монитор'},
      full:{title:'Полная проверка ПК',desc:'Пошаговая браузерная диагностика герцовки, устройств ввода и доступных возможностей.',tag:'Утилита'}
    }
  };
  Object.assign(toolText.en, v4Text.en);
  Object.assign(toolText.ru, v4Text.ru);

  const v4Tools = [
    {id:'sharpness',key:'sharpness',category:'monitor',icon:'scan'},
    {id:'full-check',key:'full',category:'utility',icon:'activity',featured:true}
  ];
  for (const item of v4Tools) {
    if (!tools.some(tool => tool.id === item.id)) {
      tools.push({...item, icon:`<i data-lucide="${item.icon}" aria-hidden="true"></i>`});
    }
  }

  const k = (code,label,u=1) => ({code,label,u});
  const keyboardRows = [
    [k('Escape','Esc'),k('F1','F1'),k('F2','F2'),k('F3','F3'),k('F4','F4'),k('F5','F5'),k('F6','F6'),k('F7','F7'),k('F8','F8'),k('F9','F9'),k('F10','F10'),k('F11','F11'),k('F12','F12')],
    [k('Backquote','`'),k('Digit1','1'),k('Digit2','2'),k('Digit3','3'),k('Digit4','4'),k('Digit5','5'),k('Digit6','6'),k('Digit7','7'),k('Digit8','8'),k('Digit9','9'),k('Digit0','0'),k('Minus','-'),k('Equal','='),k('Backspace','Backspace',2)],
    [k('Tab','Tab',1.5),k('KeyQ','Q'),k('KeyW','W'),k('KeyE','E'),k('KeyR','R'),k('KeyT','T'),k('KeyY','Y'),k('KeyU','U'),k('KeyI','I'),k('KeyO','O'),k('KeyP','P'),k('BracketLeft','['),k('BracketRight',']'),k('Backslash','\\',1.5)],
    [k('CapsLock','Caps',1.8),k('KeyA','A'),k('KeyS','S'),k('KeyD','D'),k('KeyF','F'),k('KeyG','G'),k('KeyH','H'),k('KeyJ','J'),k('KeyK','K'),k('KeyL','L'),k('Semicolon',';'),k('Quote',"'"),k('Enter','Enter',2.2)],
    [k('ShiftLeft','Shift',2.25),k('KeyZ','Z'),k('KeyX','X'),k('KeyC','C'),k('KeyV','V'),k('KeyB','B'),k('KeyN','N'),k('KeyM','M'),k('Comma',','),k('Period','.'),k('Slash','/'),k('ShiftRight','Shift',2.75)],
    [k('ControlLeft','Ctrl',1.4),k('MetaLeft','Win',1.2),k('AltLeft','Alt',1.2),k('Space','Space',6),k('AltRight','Alt',1.2),k('MetaRight','Win',1.2),k('ContextMenu','Menu',1.2),k('ControlRight','Ctrl',1.4)]
  ];
  const navKeys = [
    k('Insert','Ins'),k('Home','Home'),k('PageUp','PgUp'),
    k('Delete','Del'),k('End','End'),k('PageDown','PgDn'),
    k('ArrowUp','↑'),k('ArrowLeft','←'),k('ArrowDown','↓'),k('ArrowRight','→')
  ];
  const numpadKeys = [
    k('NumLock','Num'),k('NumpadDivide','/'),k('NumpadMultiply','*'),k('NumpadSubtract','-'),
    k('Numpad7','7'),k('Numpad8','8'),k('Numpad9','9'),k('NumpadAdd','+'),
    k('Numpad4','4'),k('Numpad5','5'),k('Numpad6','6'),k('Numpad1','1'),
    k('Numpad2','2'),k('Numpad3','3'),k('Numpad0','0'),k('NumpadDecimal','.'),k('NumpadEnter','Enter')
  ];
  const allKeyboardCodes = [...keyboardRows.flat(), ...navKeys, ...numpadKeys].map(item => item.code);

  const keyMarkup = item => `<div class="kb-key" data-code="${item.code}" style="--u:${item.u}" title="${item.code}"><span>${item.label}</span></div>`;

  function renderKeyboardV4() {
    const ru = ruNow();
    const x = ru
      ? ['Ввод','Визуальный тест клавиатуры','Нажимайте клавиши. Проверенные клавиши останутся подсвеченными, а текущая — загорится ярче. Физические коды помогают находить проблемы независимо от раскладки.','Проверено','Последняя клавиша','Сбросить']
      : ['Input','Visual Keyboard Tester','Press keys. Tested keys remain highlighted and the current key lights up brighter. Physical codes make hardware checks independent of the active layout.','Tested','Last key','Reset'];
    dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body">
      <div class="keyboard-stats">
        <div class="metric-card"><span>${x[3]}</span><strong id="kb-tested">0 / ${allKeyboardCodes.length}</strong></div>
        <div class="metric-card"><span>${x[4]}</span><strong id="kb-last">—</strong></div>
      </div>
      <div class="keyboard-scroll" id="keyboard-focus" tabindex="0">
        <div class="keyboard-board">
          <div class="kb-main">${keyboardRows.map(row=>`<div class="kb-row">${row.map(keyMarkup).join('')}</div>`).join('')}</div>
          <div class="kb-side">
            <div class="kb-nav">${navKeys.map(keyMarkup).join('')}</div>
            <div class="kb-numpad">${numpadKeys.map(keyMarkup).join('')}</div>
          </div>
        </div>
      </div>
      <div class="tool-actions"><button class="mini-btn" id="kb-reset"><i data-lucide="rotate-ccw" aria-hidden="true"></i><span>${x[5]}</span></button></div>
    </div>`;
    refreshV4Icons();
    return () => {
      const seen = new Set();
      const focus = $('#keyboard-focus');
      const update = () => { const el=$('#kb-tested'); if (el) el.textContent = `${seen.size} / ${allKeyboardCodes.length}`; };
      const down = e => {
        if (!dialog.open || !$('#keyboard-focus')) return;
        e.preventDefault();
        const el = $(`.kb-key[data-code="${CSS.escape(e.code)}"]`);
        if (el) {
          el.classList.add('active','seen');
          seen.add(e.code);
          update();
        }
        const last = $('#kb-last');
        if (last) last.textContent = `${e.key === ' ' ? 'Space' : e.key} · ${e.code}`;
      };
      const up = e => {
        const el = $(`.kb-key[data-code="${CSS.escape(e.code)}"]`);
        el?.classList.remove('active');
      };
      const reset = () => {
        seen.clear();
        $$('.kb-key.seen').forEach(el=>el.classList.remove('seen','active'));
        const last=$('#kb-last'); if(last) last.textContent='—';
        update();
        focus?.focus();
      };
      document.addEventListener('keydown',down);
      document.addEventListener('keyup',up);
      $('#kb-reset')?.addEventListener('click',reset);
      focus?.focus();
      return () => {
        document.removeEventListener('keydown',down);
        document.removeEventListener('keyup',up);
      };
    };
  }

  function renderMouseV4() {
    const ru = ruNow();
    const x = ru
      ? ['Ввод','Расширенный тест мыши','Проверяйте все кнопки, колесо, двойные клики и движение. Счётчики помогают заметить пропуски или фантомные события.','Двигайте, кликайте и крутите колесо здесь','Левая','Средняя','Правая','Назад','Вперёд','Двойные','Колесо ↑','Колесо ↓','Путь','Позиция','Сбросить']
      : ['Input','Advanced Mouse Tester','Test every button, wheel scrolling, double-clicks and movement. Counters help reveal missed or phantom events.','Move, click and scroll here','Left','Middle','Right','Back','Forward','Double','Wheel ↑','Wheel ↓','Distance','Position','Reset'];
    dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body">
      <div class="mouse-v4">
        <div class="mouse-device" aria-hidden="true">
          <i data-lucide="mouse" class="mouse-device-icon"></i>
          <span class="mouse-live left" data-mouse-zone="0"></span>
          <span class="mouse-live middle" data-mouse-zone="1"></span>
          <span class="mouse-live right" data-mouse-zone="2"></span>
        </div>
        <div class="mouse-pad mouse-pad-v4" id="mouse-v4-pad">${x[3]}</div>
      </div>
      <div class="mouse-metrics">
        ${[x[4],x[5],x[6],x[7],x[8]].map((label,i)=>`<div class="mini-metric"><span>${label}</span><strong data-mouse-count="${i}">0</strong></div>`).join('')}
        <div class="mini-metric"><span>${x[9]}</span><strong id="mouse-v4-double">0</strong></div>
        <div class="mini-metric"><span>${x[10]}</span><strong id="mouse-v4-up">0</strong></div>
        <div class="mini-metric"><span>${x[11]}</span><strong id="mouse-v4-down">0</strong></div>
        <div class="mini-metric"><span>${x[12]}</span><strong id="mouse-v4-distance">0 px</strong></div>
        <div class="mini-metric"><span>${x[13]}</span><strong id="mouse-v4-pos">—</strong></div>
      </div>
      <div class="tool-actions"><button class="mini-btn" id="mouse-v4-reset"><i data-lucide="rotate-ccw" aria-hidden="true"></i><span>${x[14]}</span></button></div>
    </div>`;
    refreshV4Icons();
    return () => {
      const pad = $('#mouse-v4-pad');
      const counts = [0,0,0,0,0];
      let doubles=0, up=0, down=0, distance=0, lastPoint=null;
      const paintCount = i => { const el=$(`[data-mouse-count="${i}"]`); if(el) el.textContent=counts[i]; };
      const pointerDown = e => {
        e.preventDefault();
        if (e.button >= 0 && e.button < counts.length) { counts[e.button]++; paintCount(e.button); }
        $(`[data-mouse-zone="${e.button}"]`)?.classList.add('active');
      };
      const pointerUp = e => $(`[data-mouse-zone="${e.button}"]`)?.classList.remove('active');
      const pointerMove = e => {
        const r=pad.getBoundingClientRect();
        const pos=$('#mouse-v4-pos'); if(pos) pos.textContent=`${Math.round(e.clientX-r.left)}, ${Math.round(e.clientY-r.top)}`;
        if (lastPoint) distance += Math.hypot(e.clientX-lastPoint.x,e.clientY-lastPoint.y);
        lastPoint={x:e.clientX,y:e.clientY};
        const dist=$('#mouse-v4-distance'); if(dist) dist.textContent=`${Math.round(distance)} px`;
      };
      const dbl = () => { doubles++; const el=$('#mouse-v4-double'); if(el) el.textContent=doubles; };
      const wheel = e => {
        e.preventDefault();
        if (e.deltaY < 0) { up++; const el=$('#mouse-v4-up'); if(el) el.textContent=up; }
        if (e.deltaY > 0) { down++; const el=$('#mouse-v4-down'); if(el) el.textContent=down; }
      };
      const context = e => e.preventDefault();
      const reset = () => {
        counts.fill(0); doubles=0; up=0; down=0; distance=0; lastPoint=null;
        counts.forEach((_,i)=>paintCount(i));
        $('#mouse-v4-double').textContent='0'; $('#mouse-v4-up').textContent='0'; $('#mouse-v4-down').textContent='0';
        $('#mouse-v4-distance').textContent='0 px'; $('#mouse-v4-pos').textContent='—';
        $$('.mouse-live.active').forEach(el=>el.classList.remove('active'));
      };
      pad.addEventListener('pointerdown',pointerDown);
      pad.addEventListener('pointerup',pointerUp);
      pad.addEventListener('pointercancel',pointerUp);
      pad.addEventListener('pointermove',pointerMove);
      pad.addEventListener('dblclick',dbl);
      pad.addEventListener('wheel',wheel,{passive:false});
      pad.addEventListener('contextmenu',context);
      $('#mouse-v4-reset')?.addEventListener('click',reset);
      return () => {};
    };
  }

  function renderGhostingV4() {
    const ru = ruNow();
    const x = ru
      ? ['Монитор','Motion / Ghosting Lab','Настройте скорость, фон и вид цели. Смотрите на шлейф, инверсные ореолы и читаемость движущегося объекта. Это визуальный тест, а не измерение времени отклика в миллисекундах.','Скорость','Медленно','Средне','Быстро','Фон','Тёмный','Серый','Светлый','Цель','Блок','Полосы','Текст','Запустить']
      : ['Monitor','Motion / Ghosting Lab','Choose speed, background and target style. Watch for trails, inverse halos and moving-object clarity. This is a visual test, not a millisecond response-time measurement.','Speed','Slow','Medium','Fast','Background','Dark','Gray','Light','Target','Block','Stripes','Text','Start test'];
    dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body">
      <div class="form-grid">
        <div class="field"><label>${x[3]}</label><select id="motion-speed"><option value="2.2">${x[4]}</option><option value="1.2" selected>${x[5]}</option><option value=".65">${x[6]}</option></select></div>
        <div class="field"><label>${x[7]}</label><select id="motion-bg"><option value="dark">${x[8]}</option><option value="mid">${x[9]}</option><option value="light">${x[10]}</option></select></div>
        <div class="field"><label>${x[11]}</label><select id="motion-target"><option value="block">${x[12]}</option><option value="stripes">${x[13]}</option><option value="text">${x[14]}</option></select></div>
      </div>
      <div class="tool-actions"><button class="mini-btn accent" id="motion-start"><i data-lucide="maximize" aria-hidden="true"></i><span>${x[15]}</span></button></div>
    </div>`;
    refreshV4Icons();
    return () => $('#motion-start')?.addEventListener('click', () => {
      const duration=$('#motion-speed').value, bg=$('#motion-bg').value, target=$('#motion-target').value;
      startScreenTest('ghosting',{duration});
      const track=$('.ghost-track',screenStage), obj=$('.ghost-object',screenStage);
      track?.classList.add(`motion-bg-${bg}`);
      obj?.classList.add(`motion-target-${target}`);
      if (target === 'text' && obj) obj.innerHTML='<span>PC TOOLKIT</span>';
    });
  }

  const sharpPatterns = ['sharp-grid','sharp-pixels','sharp-crosshair'];
  function applySharpnessPattern(index) {
    sharpPatterns.forEach(c=>screenStage.classList.remove(c));
    screenStage.classList.add('sharpness-stage', sharpPatterns[index % sharpPatterns.length]);
    screenStage.innerHTML = index % sharpPatterns.length === 2 ? '<div class="geometry-label">+ 1px / 50% / CENTER +</div>' : '';
  }
  function renderSharpness() {
    const ru=ruNow();
    const x=ru
      ? ['Монитор','Резкость и геометрия','Три паттерна: тонкая сетка, 1-пиксельная шахматка и центральная геометрия. Они помогают увидеть размытие от масштабирования, перешарп и проблемы с геометрией.','Для корректной 1px-проверки браузер желательно держать на масштабе 100%.','Запустить']
      : ['Monitor','Sharpness & Geometry','Three patterns: fine grid, 1-pixel checkerboard and centered geometry. They help reveal scaling blur, oversharpening and geometry issues.','For the 1px pattern, browser zoom should ideally be 100%.','Start test'];
    dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body"><div class="result-box"><span class="muted">${x[3]}</span></div><div class="tool-actions"><button class="mini-btn accent" id="sharp-start"><i data-lucide="maximize" aria-hidden="true"></i><span>${x[4]}</span></button></div></div>`;
    refreshV4Icons();
    return () => $('#sharp-start')?.addEventListener('click',()=>{
      dialog.close(); screenMode='sharpness'; screenIndex=0; screenTest.hidden=false;
      screenStage.className='screen-stage'; screenStage.removeAttribute('style'); applySharpnessPattern(0);
      screenHelp.textContent=ruNow()?'Клик / тап — следующий паттерн • Esc — выход':'Click / tap — next pattern • Esc — exit';
      document.documentElement.requestFullscreen?.().catch(()=>{});
    });
  }
  screenTest.addEventListener('click',e=>{
    if(e.target===screenExit) return;
    if(screenMode==='sharpness') applySharpnessPattern(screenIndex);
  });

  function browserCapabilities() {
    return {
      secure: window.isSecureContext,
      webgl: getWebGLRenderer() !== t('common.unavailable'),
      fullscreen: !!document.fullscreenEnabled || !!document.documentElement.requestFullscreen,
      gamepad: typeof navigator.getGamepads === 'function',
      microphone: !!navigator.mediaDevices?.getUserMedia,
      clipboard: !!navigator.clipboard?.writeText
    };
  }

  function buildFullCheckReport(session) {
    const ru=ruNow(), c=browserCapabilities();
    const lines=[
      'PC Toolkit — Full PC Check',
      `${ru?'Дата':'Date'}: ${new Date().toLocaleString()}`,
      `${ru?'Браузер':'Browser'}: ${detectBrowser()}`,
      `${ru?'Экран':'Display'}: ${screen.width} × ${screen.height} @ DPR ${window.devicePixelRatio||1}`,
      `${ru?'Глубина цвета':'Color depth'}: ${screen.colorDepth||'—'} bit`,
      `${ru?'Потоки CPU':'CPU threads'}: ${navigator.hardwareConcurrency||'—'}`,
      `${ru?'Память браузера':'Browser memory estimate'}: ${navigator.deviceMemory?`${navigator.deviceMemory} GB`:'—'}`,
      `GPU / WebGL: ${getWebGLRenderer()}`,
      `${ru?'Герцовка':'Refresh estimate'}: ${session.refreshHz ? `${session.refreshHz} Hz` : ru?'не проверено':'not tested'}`,
      `${ru?'Джиттер кадров':'Frame jitter'}: ${session.refreshJitter != null ? `${session.refreshJitter} ms` : '—'}`,
      `${ru?'Клавиатура':'Keyboard event'}: ${session.keySeen ? (ru?'обнаружено':'detected') : (ru?'не проверено':'not tested')}`,
      `${ru?'Движение мыши':'Pointer movement'}: ${session.pointerSeen ? (ru?'обнаружено':'detected') : (ru?'не проверено':'not tested')}`,
      `${ru?'Клик мыши':'Pointer click'}: ${session.clickSeen ? (ru?'обнаружено':'detected') : (ru?'не проверено':'not tested')}`,
      `${ru?'Безопасный контекст':'Secure context'}: ${c.secure?'yes':'no'}`,
      `Fullscreen API: ${c.fullscreen?'yes':'no'}`,
      `Gamepad API: ${c.gamepad?'yes':'no'}`,
      `Microphone API: ${c.microphone?'yes':'no'}`,
      `Clipboard API: ${c.clipboard?'yes':'no'}`,
      '',
      ru?'Примечание: браузерная проверка не заменяет аппаратную диагностику, SMART, датчики температур или MemTest.':'Note: browser checks do not replace hardware diagnostics, SMART, temperature sensors or MemTest.'
    ];
    return lines.join('\n');
  }

  function renderFullPcCheck() {
    const ru=ruNow();
    const session={refreshHz:null,refreshJitter:null,keySeen:false,pointerSeen:false,clickSeen:false};
    let step=0, stepCleanup=()=>{}, raf=0;
    const labels=ru
      ? ['Окружение','Экран','Ввод','Итог']
      : ['Environment','Display','Input','Summary'];

    dialogContent.innerHTML=`<div class="full-check-shell"><div class="check-progress" id="check-progress"></div><div id="check-stage"></div></div>`;

    const cleanupStep=()=>{ try{stepCleanup();}catch{} stepCleanup=()=>{}; if(raf) cancelAnimationFrame(raf); raf=0; };
    const progress=()=>{
      const el=$('#check-progress'); if(!el)return;
      el.innerHTML=labels.map((label,i)=>`<div class="check-progress-item ${i===step?'active':''} ${i<step?'done':''}"><span>${i<step?'<i data-lucide="check"></i>':i+1}</span><small>${label}</small></div>`).join('');
    };
    const nav=(back=true,next=true,nextLabel=null)=>`<div class="check-nav">${back?`<button class="mini-btn" id="check-back"><i data-lucide="arrow-left"></i><span>${ru?'Назад':'Back'}</span></button>`:'<span></span>'}${next?`<button class="mini-btn accent" id="check-next"><span>${nextLabel||(ru?'Далее':'Next')}</span><i data-lucide="arrow-right"></i></button>`:''}</div>`;

    const renderStep=()=>{
      cleanupStep(); progress();
      const stage=$('#check-stage'); if(!stage)return;

      if(step===0){
        const c=browserCapabilities();
        const caps=[
          [ru?'Защищённый контекст':'Secure context',c.secure],
          ['WebGL',c.webgl],['Fullscreen API',c.fullscreen],['Gamepad API',c.gamepad],
          [ru?'Микрофон API':'Microphone API',c.microphone],['Clipboard API',c.clipboard]
        ];
        stage.innerHTML=`${head(ru?'Полная проверка':'Full check',ru?'Шаг 1 — окружение':'Step 1 — Environment',ru?'Сначала фиксируем то, что браузер действительно может увидеть. Это не полный перечень железа.':'First, capture what the browser can actually see. This is not a full hardware inventory.')}
          <div class="tool-body">
            <div class="check-system-grid">
              <div class="metric-card"><span>${ru?'Экран':'Display'}</span><strong>${screen.width} × ${screen.height}</strong></div>
              <div class="metric-card"><span>${ru?'Потоки CPU':'CPU threads'}</span><strong>${navigator.hardwareConcurrency||'—'}</strong></div>
              <div class="metric-card"><span>${ru?'Память':'Memory'}</span><strong>${navigator.deviceMemory?`${navigator.deviceMemory} GB`:'—'}</strong></div>
              <div class="metric-card"><span>GPU / WebGL</span><strong>${escapeHtml(getWebGLRenderer())}</strong></div>
            </div>
            <div class="capability-list">${caps.map(([name,ok])=>`<div><span>${name}</span><strong class="${ok?'ok':'warn'}"><i data-lucide="${ok?'circle-check':'circle-alert'}"></i>${ok?(ru?'Доступно':'Available'):(ru?'Недоступно':'Unavailable')}</strong></div>`).join('')}</div>
            ${nav(false,true)}
          </div>`;
      }

      if(step===1){
        stage.innerHTML=`${head(ru?'Полная проверка':'Full check',ru?'Шаг 2 — экран':'Step 2 — Display timing',ru?'Замеряем интервалы кадров через requestAnimationFrame. Не переключайте вкладку во время теста.':'Measure frame intervals with requestAnimationFrame. Keep this tab visible during the test.')}
          <div class="tool-body">
            <div class="check-refresh-result"><div class="big-result"><span id="check-hz">${session.refreshHz||'—'}</span> <small>Hz</small></div><p class="muted" id="check-refresh-note">${session.refreshHz?(ru?`Джиттер ${session.refreshJitter} мс`:`Jitter ${session.refreshJitter} ms`):(ru?'Тест ещё не запускался.':'Not tested yet.')}</p></div>
            <div class="tool-actions"><button class="mini-btn" id="check-refresh"><i data-lucide="play"></i><span>${ru?'Запустить замер ~2 сек':'Run ~2s measurement'}</span></button></div>
            ${nav(true,true)}
          </div>`;
        const run=()=>{
          const btn=$('#check-refresh'), note=$('#check-refresh-note'), value=$('#check-hz'); if(!btn)return;
          btn.disabled=true; note.textContent=ru?'Собираю кадры…':'Sampling frames…'; value.textContent='…';
          const samples=[]; let last=performance.now(), start=last;
          const frame=now=>{
            if(!dialog.open)return;
            const d=now-last; last=now; if(d>1&&d<100)samples.push(d);
            if(now-start<2200){raf=requestAnimationFrame(frame);return;}
            const clean=samples.slice(10); const sorted=[...clean].sort((a,b)=>a-b);
            const median=sorted[Math.floor(sorted.length/2)];
            const mean=clean.reduce((a,b)=>a+b,0)/Math.max(1,clean.length);
            const variance=clean.reduce((sum,v)=>sum+(v-mean)**2,0)/Math.max(1,clean.length);
            session.refreshHz=median?Number((1000/median).toFixed(median<8?0:1)):null;
            session.refreshJitter=Number(Math.sqrt(variance).toFixed(2));
            value.textContent=session.refreshHz||'—';
            note.textContent=session.refreshHz?(ru?`Медианный frame time ${median.toFixed(2)} мс • джиттер ${session.refreshJitter} мс`:`Median frame time ${median.toFixed(2)} ms • jitter ${session.refreshJitter} ms`):(ru?'Не удалось получить стабильный результат.':'Unable to get a stable result.');
            btn.disabled=false; raf=0;
          };
          raf=requestAnimationFrame(frame);
        };
        $('#check-refresh')?.addEventListener('click',run);
      }

      if(step===2){
        stage.innerHTML=`${head(ru?'Полная проверка':'Full check',ru?'Шаг 3 — устройства ввода':'Step 3 — Input devices',ru?'Нажмите любую клавишу, подвигайте мышью в поле и сделайте один клик. Мы проверяем только приход браузерных событий.':'Press any key, move the mouse inside the pad and click once. This only verifies browser input events.')}
          <div class="tool-body">
            <div class="input-check-grid">
              <div class="input-check-card ${session.keySeen?'passed':''}" id="check-key-card"><i data-lucide="keyboard"></i><strong>${ru?'Клавиатура':'Keyboard'}</strong><span id="check-key-state">${session.keySeen?(ru?'Событие получено':'Event detected'):(ru?'Нажмите клавишу':'Press a key')}</span></div>
              <div class="input-check-card ${session.pointerSeen?'passed':''}" id="check-move-card"><i data-lucide="mouse-pointer-2"></i><strong>${ru?'Движение мыши':'Pointer movement'}</strong><span id="check-move-state">${session.pointerSeen?(ru?'Событие получено':'Event detected'):(ru?'Подвигайте мышью':'Move the pointer')}</span></div>
              <div class="input-check-card ${session.clickSeen?'passed':''}" id="check-click-card"><i data-lucide="mouse-pointer-click"></i><strong>${ru?'Клик':'Pointer click'}</strong><span id="check-click-state">${session.clickSeen?(ru?'Событие получено':'Event detected'):(ru?'Сделайте клик':'Click once')}</span></div>
            </div>
            <div class="mouse-pad check-input-pad" id="check-input-pad">${ru?'Двигайте и кликайте здесь':'Move and click here'}</div>
            ${nav(true,true)}
          </div>`;
        const key=e=>{if(!dialog.open)return;e.preventDefault();session.keySeen=true;$('#check-key-card')?.classList.add('passed');const s=$('#check-key-state');if(s)s.textContent=ru?'Событие получено':'Event detected';};
        const move=()=>{session.pointerSeen=true;$('#check-move-card')?.classList.add('passed');const s=$('#check-move-state');if(s)s.textContent=ru?'Событие получено':'Event detected';};
        const click=e=>{e.preventDefault();session.clickSeen=true;$('#check-click-card')?.classList.add('passed');const s=$('#check-click-state');if(s)s.textContent=ru?'Событие получено':'Event detected';};
        const pad=$('#check-input-pad');
        document.addEventListener('keydown',key); pad?.addEventListener('pointermove',move); pad?.addEventListener('pointerdown',click); pad?.addEventListener('contextmenu',click);
        stepCleanup=()=>{document.removeEventListener('keydown',key);pad?.removeEventListener('pointermove',move);pad?.removeEventListener('pointerdown',click);pad?.removeEventListener('contextmenu',click);};
      }

      if(step===3){
        const completed=[!!session.refreshHz,session.keySeen,session.pointerSeen,session.clickSeen].filter(Boolean).length;
        const report=buildFullCheckReport(session);
        stage.innerHTML=`${head(ru?'Полная проверка':'Full check',ru?'Готово — итог проверки':'Done — Check summary',ru?'Это сводка браузерных тестов, а не заключение о состоянии всего железа.':'This is a browser-diagnostics summary, not a verdict on all PC hardware.')}
          <div class="tool-body">
            <div class="check-summary-banner"><i data-lucide="${completed===4?'circle-check-big':'circle-dot-dashed'}"></i><div><strong>${completed} / 4 ${ru?'проверок выполнено':'checks completed'}</strong><span>${completed===4?(ru?'Основные браузерные тесты завершены.':'Core browser checks completed.'):(ru?'Некоторые шаги были пропущены — это нормально.':'Some optional checks were skipped.')}</span></div></div>
            <textarea class="report-output full-check-report" id="full-check-report" readonly>${escapeHtml(report)}</textarea>
            <div class="tool-actions"><button class="mini-btn accent" id="full-check-copy"><i data-lucide="copy"></i><span>${ru?'Скопировать отчёт':'Copy report'}</span></button><button class="mini-btn" id="full-check-restart"><i data-lucide="rotate-ccw"></i><span>${ru?'Начать заново':'Start over'}</span></button></div>
            ${nav(true,false)}
          </div>`;
        $('#full-check-copy')?.addEventListener('click',async()=>{
          const text=$('#full-check-report').value;
          try{await navigator.clipboard.writeText(text);}catch{$('#full-check-report').select();document.execCommand?.('copy');}
        });
        $('#full-check-restart')?.addEventListener('click',()=>{session.refreshHz=null;session.refreshJitter=null;session.keySeen=false;session.pointerSeen=false;session.clickSeen=false;step=0;renderStep();});
      }

      $('#check-back')?.addEventListener('click',()=>{if(step>0){step--;renderStep();}});
      $('#check-next')?.addEventListener('click',()=>{if(step<3){step++;renderStep();}});
      refreshV4Icons();
    };

    return () => {
      renderStep();
      return () => cleanupStep();
    };
  }

  renderKeyboard = renderKeyboardV4;
  renderMouse = renderMouseV4;
  renderGhosting = renderGhostingV4;
  renderSystemCheck = renderFullPcCheck;

  const previousOpenDialog = openDialog;
  openDialog = function openDialogV4(name) {
    if (!['sharpness','full-check'].includes(name)) return previousOpenDialog(name);
    stopActive();
    dialogContent.innerHTML='';
    const renderer = name==='sharpness' ? renderSharpness : renderFullPcCheck;
    const init=renderer();
    dialog.showModal();
    requestAnimationFrame(()=>{cleanup=typeof init==='function'?(init()||null):null;refreshV4Icons();});
  };

  renderToolCards();
  refreshV4Icons();
})();