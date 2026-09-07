(() => {
  const refreshIcons = () => {
    try { window.lucide?.createIcons?.({attrs:{'stroke-width':1.8}}); } catch {}
  };

  translations.en['cat.files'] = 'Files';
  translations.ru['cat.files'] = 'Файлы';
  if (!categories.includes('files')) {
    const utilityIndex = categories.indexOf('utility');
    categories.splice(utilityIndex >= 0 ? utilityIndex : categories.length, 0, 'files');
  }

  Object.assign(toolText.en, {
    sha256:{title:'SHA-256 File Hash',desc:'Calculate a SHA-256 checksum locally to verify downloads and file integrity.',tag:'Files'},
    duplicates:{title:'Duplicate File Finder',desc:'Find exact duplicates among selected files using size filtering and SHA-256.',tag:'Files'},
    frametime:{title:'FPS ↔ Frame Time',desc:'Convert FPS to milliseconds per frame and compare common refresh targets.',tag:'Utility'},
    storageUnits:{title:'Storage Unit Converter',desc:'Convert GB/TB and GiB/TiB and see why advertised drive capacity looks smaller.',tag:'Utility'}
  });
  Object.assign(toolText.ru, {
    sha256:{title:'SHA-256 файла',desc:'Локально считает SHA-256 для проверки скачанного файла и его целостности.',tag:'Файлы'},
    duplicates:{title:'Поиск дубликатов',desc:'Ищет точные дубликаты среди выбранных файлов по размеру и SHA-256.',tag:'Файлы'},
    frametime:{title:'FPS ↔ время кадра',desc:'Переводит FPS в миллисекунды на кадр и сравнивает популярные значения.',tag:'Утилита'},
    storageUnits:{title:'GB / GiB / TB / TiB',desc:'Конвертер единиц накопителя и наглядное объяснение разницы ёмкости.',tag:'Утилита'}
  });

  const additions = [
    {id:'sha256-file',key:'sha256',category:'files',icon:'<i data-lucide="file-key-2" aria-hidden="true"></i>',featured:true},
    {id:'duplicate-files',key:'duplicates',category:'files',icon:'<i data-lucide="copy-check" aria-hidden="true"></i>'},
    {id:'frame-time',key:'frametime',category:'utility',icon:'<i data-lucide="timer" aria-hidden="true"></i>'},
    {id:'storage-units',key:'storageUnits',category:'utility',icon:'<i data-lucide="hard-drive" aria-hidden="true"></i>'}
  ];
  additions.forEach(item => { if (!tools.some(tool => tool.id === item.id)) tools.push(item); });

  const formatBytes = bytes => {
    if (!Number.isFinite(bytes) || bytes < 0) return '—';
    const units = ['B','KB','MB','GB','TB'];
    let value = bytes, i = 0;
    while (value >= 1000 && i < units.length - 1) { value /= 1000; i++; }
    return `${value >= 100 ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2)} ${units[i]}`;
  };

  const sha256 = async file => {
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2,'0')).join('');
  };

  const copyValue = async (text, note) => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(area);
      area.select();
      try { ok = document.execCommand?.('copy') || false; } catch {}
      area.remove();
    }
    if (note) note.textContent = ok ? (currentLang === 'ru' ? 'Скопировано' : 'Copied') : (currentLang === 'ru' ? 'Не удалось скопировать' : 'Copy failed');
  };

  function renderSha256() {
    const ru = currentLang === 'ru';
    const x = ru
      ? ['Файлы','SHA-256 файла','Выберите файл — хэш считается полностью локально через Web Crypto. Файл не загружается на сервер.','Выбрать файл','Файл не выбран','Посчитать SHA-256','Скопировать','Для очень больших файлов браузеру потребуется прочитать файл целиком в память.']
      : ['Files','SHA-256 File Hash','Choose a file and calculate its hash locally with Web Crypto. The file is never uploaded.','Choose file','No file selected','Calculate SHA-256','Copy','Very large files must be read into browser memory to calculate the hash.'];
    dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body v5-file-tool">
      <label class="file-drop" for="sha-file"><i data-lucide="file-up" aria-hidden="true"></i><strong>${x[3]}</strong><span id="sha-file-name">${x[4]}</span><input id="sha-file" type="file"></label>
      <div class="file-meta" id="sha-meta" hidden></div>
      <div class="tool-actions"><button class="mini-btn accent" id="sha-run" disabled><i data-lucide="fingerprint" aria-hidden="true"></i><span>${x[5]}</span></button></div>
      <div class="hash-result" id="sha-result" hidden><code id="sha-value"></code><button class="icon-copy" id="sha-copy" type="button" aria-label="${x[6]}"><i data-lucide="copy" aria-hidden="true"></i></button></div>
      <div class="v5-progress" id="sha-progress" hidden><div></div></div>
      <div class="muted v5-note" id="sha-note">${x[7]}</div>
    </div>`;
    refreshIcons();
    return () => {
      const input = $('#sha-file');
      const run = $('#sha-run');
      const result = $('#sha-result');
      const note = $('#sha-note');
      let selected = null;
      input.addEventListener('change', () => {
        selected = input.files?.[0] || null;
        $('#sha-file-name').textContent = selected ? selected.name : x[4];
        $('#sha-meta').hidden = !selected;
        if (selected) $('#sha-meta').textContent = `${formatBytes(selected.size)} • ${selected.type || (ru?'неизвестный тип':'unknown type')} • ${new Date(selected.lastModified).toLocaleString()}`;
        run.disabled = !selected;
        result.hidden = true;
        note.textContent = x[7];
      });
      run.addEventListener('click', async () => {
        if (!selected) return;
        run.disabled = true;
        $('#sha-progress').hidden = false;
        $('#sha-progress > div').classList.add('indeterminate');
        note.textContent = ru ? 'Читаю файл и считаю SHA-256…' : 'Reading file and calculating SHA-256…';
        try {
          const hash = await sha256(selected);
          $('#sha-value').textContent = hash;
          result.hidden = false;
          note.textContent = ru ? 'Готово. Хэш рассчитан локально.' : 'Done. Hash calculated locally.';
        } catch (error) {
          note.textContent = ru ? `Не удалось прочитать файл: ${error?.name || 'ошибка'}` : `Could not read file: ${error?.name || 'error'}`;
        } finally {
          run.disabled = false;
          $('#sha-progress').hidden = true;
          $('#sha-progress > div').classList.remove('indeterminate');
        }
      });
      $('#sha-copy').addEventListener('click', () => copyValue($('#sha-value').textContent, note));
    };
  }

  function renderDuplicates() {
    const ru = currentLang === 'ru';
    const x = ru
      ? ['Файлы','Поиск точных дубликатов','Выберите несколько файлов. Сначала PC Toolkit группирует их по размеру, затем SHA-256 считается только для совпадающих размеров. Всё происходит локально.','Выбрать файлы','Файлы не выбраны','Найти дубликаты','Проверено файлов','Дубликатов не найдено.','Группа','файла','файлов']
      : ['Files','Exact Duplicate Finder','Select multiple files. PC Toolkit groups them by size first, then hashes only same-size candidates with SHA-256. Everything stays local.','Choose files','No files selected','Find duplicates','Files checked','No duplicates found.','Group','files','files'];
    dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body v5-file-tool">
      <label class="file-drop" for="dup-files"><i data-lucide="files" aria-hidden="true"></i><strong>${x[3]}</strong><span id="dup-file-count">${x[4]}</span><input id="dup-files" type="file" multiple></label>
      <div class="tool-actions"><button class="mini-btn accent" id="dup-run" disabled><i data-lucide="scan-search" aria-hidden="true"></i><span>${x[5]}</span></button></div>
      <div class="v5-progress" id="dup-progress" hidden><div id="dup-progress-bar"></div></div>
      <div class="muted v5-note" id="dup-note"></div>
      <div class="duplicate-results" id="dup-results"></div>
    </div>`;
    refreshIcons();
    return () => {
      const input = $('#dup-files');
      const run = $('#dup-run');
      const note = $('#dup-note');
      const results = $('#dup-results');
      let selected = [];
      input.addEventListener('change', () => {
        selected = [...(input.files || [])];
        $('#dup-file-count').textContent = selected.length ? `${selected.length} ${ru ? (selected.length === 1 ? 'файл' : 'файлов') : (selected.length === 1 ? 'file' : 'files')}` : x[4];
        run.disabled = selected.length < 2;
        note.textContent = '';
        results.innerHTML = '';
      });
      run.addEventListener('click', async () => {
        if (selected.length < 2) return;
        run.disabled = true;
        results.innerHTML = '';
        const sizeGroups = new Map();
        selected.forEach(file => {
          const group = sizeGroups.get(file.size) || [];
          group.push(file);
          sizeGroups.set(file.size, group);
        });
        const candidates = [...sizeGroups.values()].filter(group => group.length > 1).flat();
        if (!candidates.length) {
          note.textContent = x[7];
          run.disabled = false;
          return;
        }
        $('#dup-progress').hidden = false;
        const hashGroups = new Map();
        let done = 0;
        try {
          for (const file of candidates) {
            note.textContent = `${ru?'Хэширую':'Hashing'} ${done + 1} / ${candidates.length}: ${file.name}`;
            const hash = await sha256(file);
            const key = `${file.size}:${hash}`;
            const group = hashGroups.get(key) || [];
            group.push(file);
            hashGroups.set(key, group);
            done++;
            $('#dup-progress-bar').style.width = `${(done / candidates.length) * 100}%`;
          }
          const duplicates = [...hashGroups.entries()].filter(([,files]) => files.length > 1);
          note.textContent = `${x[6]}: ${done} / ${selected.length}`;
          if (!duplicates.length) {
            results.innerHTML = `<div class="result-box"><span class="muted">${x[7]}</span></div>`;
          } else {
            results.innerHTML = duplicates.map(([key,files],index) => {
              const [size,hash] = key.split(':');
              return `<section class="duplicate-group"><div class="duplicate-head"><div><small>${x[8]} ${index + 1}</small><strong>${files.length} ${ru ? (files.length < 5 ? x[9] : x[10]) : x[9]} • ${formatBytes(Number(size))}</strong></div><code>${hash.slice(0,16)}…</code></div>${files.map(file => `<div class="duplicate-file"><i data-lucide="file" aria-hidden="true"></i><span title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span><small>${formatBytes(file.size)}</small></div>`).join('')}</section>`;
            }).join('');
            refreshIcons();
          }
        } catch (error) {
          note.textContent = ru ? `Ошибка чтения файла: ${error?.name || 'ошибка'}` : `File read error: ${error?.name || 'error'}`;
        } finally {
          run.disabled = false;
          $('#dup-progress').hidden = true;
        }
      });
    };
  }

  function renderFrameTime() {
    const ru = currentLang === 'ru';
    const presets = [30,60,75,120,144,165,240,360,500];
    const x = ru
      ? ['Утилита','FPS ↔ время кадра','FPS показывает количество кадров в секунду, а frame time — сколько миллисекунд есть на один кадр.','FPS','Время кадра (мс)','Популярные значения','FPS','мс / кадр']
      : ['Utility','FPS ↔ Frame Time','FPS is frames per second; frame time is the number of milliseconds available for each frame.','FPS','Frame time (ms)','Common targets','FPS','ms / frame'];
    dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body">
      <div class="form-grid"><div class="field"><label>${x[3]}</label><input id="ft-fps" type="number" min="0.01" step="1" value="144"></div><div class="field"><label>${x[4]}</label><input id="ft-ms" type="number" min="0.001" step="0.01" value="6.94"></div></div>
      <div class="frame-presets"><strong>${x[5]}</strong><div>${presets.map(fps => `<button type="button" data-fps="${fps}"><span>${fps} ${x[6]}</span><strong>${(1000/fps).toFixed(2)} ${x[7]}</strong></button>`).join('')}</div></div>
    </div>`;
    return () => {
      const fps = $('#ft-fps'), ms = $('#ft-ms');
      fps.addEventListener('input', () => { const value=Number(fps.value); ms.value=value>0?(1000/value).toFixed(3):''; });
      ms.addEventListener('input', () => { const value=Number(ms.value); fps.value=value>0?(1000/value).toFixed(2):''; });
      $$('[data-fps]',dialogContent).forEach(btn => btn.addEventListener('click', () => { fps.value=btn.dataset.fps; fps.dispatchEvent(new Event('input')); }));
    };
  }

  function renderStorageUnits() {
    const ru = currentLang === 'ru';
    const x = ru
      ? ['Утилита','GB / GiB / TB / TiB','Производители накопителей используют десятичные GB/TB (1000), а многие системные показатели основаны на двоичных GiB/TiB (1024). Поэтому «1 TB» выглядит примерно как 931 GiB.','Значение','Единица','Десятичные','Двоичные','Байты','Пример: накопитель 1 TB = 1000 GB ≈ 931.32 GiB. Это не потерянное место — используются разные единицы.']
      : ['Utility','GB / GiB / TB / TiB','Drive vendors use decimal GB/TB (1000), while many system readings are based on binary GiB/TiB (1024). That is why “1 TB” appears as about 931 GiB.','Value','Unit','Decimal','Binary','Bytes','Example: a 1 TB drive = 1000 GB ≈ 931.32 GiB. The space is not missing; the units are different.'];
    dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body">
      <div class="form-grid"><div class="field"><label>${x[3]}</label><input id="storage-value" type="number" min="0" step="0.01" value="1"></div><div class="field"><label>${x[4]}</label><select id="storage-unit"><option value="TB">TB</option><option value="GB">GB</option><option value="TiB">TiB</option><option value="GiB">GiB</option></select></div></div>
      <div class="storage-results"><div class="metric-card"><span>${x[5]}</span><strong id="storage-decimal">—</strong></div><div class="metric-card"><span>${x[6]}</span><strong id="storage-binary">—</strong></div><div class="metric-card wide"><span>${x[7]}</span><strong id="storage-bytes">—</strong></div></div>
      <div class="result-box compact-result"><span class="muted">${x[8]}</span></div>
    </div>`;
    return () => {
      const calc = () => {
        const value = Number($('#storage-value').value);
        const unit = $('#storage-unit').value;
        const factors = {GB:1e9,TB:1e12,GiB:2**30,TiB:2**40};
        const bytes = value * factors[unit];
        if (!Number.isFinite(bytes) || bytes < 0) return;
        $('#storage-decimal').textContent = `${(bytes/1e9).toLocaleString(undefined,{maximumFractionDigits:2})} GB • ${(bytes/1e12).toLocaleString(undefined,{maximumFractionDigits:4})} TB`;
        $('#storage-binary').textContent = `${(bytes/(2**30)).toLocaleString(undefined,{maximumFractionDigits:2})} GiB • ${(bytes/(2**40)).toLocaleString(undefined,{maximumFractionDigits:4})} TiB`;
        $('#storage-bytes').textContent = Math.round(bytes).toLocaleString();
      };
      $('#storage-value').addEventListener('input',calc);
      $('#storage-unit').addEventListener('change',calc);
      calc();
    };
  }

  // Correct mouse polling estimation: use each PointerEvent timestamp instead of
  // inventing tiny offsets for coalesced events.
  renderMousePolling = function renderMousePollingV5() {
    const ru = currentLang === 'ru';
    const x = ru
      ? ['Ввод','Polling Rate мыши','Оценка строится по timestamps Pointer Events. Браузер, ОС и энергосбережение могут ограничивать частоту — это не прямой замер USB-контроллера.','Быстро двигайте мышь здесь','Текущая оценка','Пиковая оценка','Событий','Медианный интервал']
      : ['Input','Mouse Polling Test','Estimate based on Pointer Event timestamps. Browser, OS and power-saving behavior may cap the rate, so this is not a direct USB-controller measurement.','Move the mouse quickly here','Current estimate','Peak estimate','Events','Median interval'];
    dialogContent.innerHTML = `${head(x[0],x[1],x[2])}<div class="tool-body"><div class="mouse-pad" id="poll-pad">${x[3]}</div><ul class="info-list"><li><span>${x[4]}</span><strong id="poll-now">— Hz</strong></li><li><span>${x[5]}</span><strong id="poll-peak">— Hz</strong></li><li><span>${x[6]}</span><strong id="poll-events">0</strong></li><li><span>${x[7]}</span><strong id="poll-ms">— ms</strong></li></ul></div>`;
    return () => {
      const pad=$('#poll-pad');
      const times=[];
      let peak=0, total=0;
      const handler=e=>{
        const batch=e.getCoalescedEvents?.() || [e];
        for (const event of batch) {
          const stamp=Number(event.timeStamp);
          if (Number.isFinite(stamp)) times.push(stamp);
          total++;
        }
        while(times.length>160) times.shift();
        if(times.length>10){
          const intervals=[];
          for(let i=1;i<times.length;i++){
            const dt=times[i]-times[i-1];
            if(dt>0.05&&dt<100) intervals.push(dt);
          }
          intervals.sort((a,b)=>a-b);
          const median=intervals[Math.floor(intervals.length/2)];
          const hz=median?1000/median:0;
          if(Number.isFinite(hz)&&hz>0&&hz<10000){
            peak=Math.max(peak,hz);
            $('#poll-now').textContent=`${Math.round(hz)} Hz`;
            $('#poll-peak').textContent=`${Math.round(peak)} Hz`;
            $('#poll-ms').textContent=`${median.toFixed(2)} ms`;
          }
        }
        $('#poll-events').textContent=total;
      };
      pad.addEventListener('pointermove',handler);
      return()=>pad.removeEventListener('pointermove',handler);
    };
  };

  // Keep Escape usable in the visual keyboard tester added in v4.
  const previousKeyboard = renderKeyboard;
  renderKeyboard = function renderKeyboardV5() {
    const init = previousKeyboard();
    return () => {
      const innerCleanup = typeof init === 'function' ? init() : null;
      const onEscape = event => {
        if (event.key === 'Escape' && dialog.open && dialogContent.querySelector('.keyboard-board')) dialog.close();
      };
      document.addEventListener('keydown',onEscape);
      return () => {
        document.removeEventListener('keydown',onEscape);
        if (typeof innerCleanup === 'function') innerCleanup();
      };
    };
  };

  // Refresh-rate measurement with cancelable RAF when the dialog is closed.
  renderRefreshRate = function renderRefreshRateV5() {
    const ru=currentLang==='ru';
    const x=ru
      ? ['Монитор','Тест герцовки','Измеряет интервалы requestAnimationFrame. Не переключайте вкладку во время замера.','Готов к замеру примерно 2 секунд','Начать измерение']
      : ['Monitor','Refresh Rate Test','Measures requestAnimationFrame intervals. Keep this tab visible during the sample.','Ready to sample for about 2 seconds','Start measurement'];
    dialogContent.innerHTML=`${head(x[0],x[1],x[2])}<div class="tool-body">${resultBox('<span id="hz-value">—</span> <small>Hz</small>',`<span id="hz-note">${x[3]}</span>`)}<div class="tool-actions"><button class="mini-btn accent" id="hz-start"><i data-lucide="play" aria-hidden="true"></i><span>${x[4]}</span></button></div></div>`;
    refreshIcons();
    return()=>{
      let raf=0, cancelled=false;
      const run=()=>{
        if(raf) cancelAnimationFrame(raf);
        cancelled=false;
        const btn=$('#hz-start'),value=$('#hz-value'),note=$('#hz-note');
        btn.disabled=true;value.textContent='…';note.textContent=ru?'Собираю кадры…':'Sampling frames…';
        const samples=[];let last=performance.now(),start=last;
        const frame=now=>{
          if(cancelled||!dialog.open||!$('#hz-value')) return;
          samples.push(now-last);last=now;
          if(now-start<2200){raf=requestAnimationFrame(frame);return;}
          raf=0;
          const clean=samples.slice(10).filter(v=>v>2&&v<50).sort((a,b)=>a-b);
          const median=clean[Math.floor(clean.length/2)];
          const hz=median?1000/median:0;
          value.textContent=hz?hz.toFixed(hz>100?0:1):'—';
          note.textContent=hz?(ru?`Медианный интервал ${median.toFixed(2)} мс • ${clean.length} кадров`:`Median frame interval ${median.toFixed(2)} ms • ${clean.length} samples`):(ru?'Не удалось получить стабильный результат.':'Unable to get a stable sample.');
          btn.disabled=false;
        };
        raf=requestAnimationFrame(frame);
      };
      $('#hz-start').addEventListener('click',run);
      return()=>{cancelled=true;if(raf)cancelAnimationFrame(raf);};
    };
  };

  const updateSnapshotV5 = () => {
    const display=$('#snap-display'), detail=$('#snap-dpr');
    if(!display||!detail)return;
    const dpr=window.devicePixelRatio||1;
    const estimatedW=Math.round(screen.width*dpr), estimatedH=Math.round(screen.height*dpr);
    display.textContent=`${screen.width} × ${screen.height}`;
    detail.textContent=currentLang==='ru'
      ? `CSS px • DPR ${dpr} • ≈ ${estimatedW} × ${estimatedH} device px`
      : `CSS px • DPR ${dpr} • ≈ ${estimatedW} × ${estimatedH} device px`;
    detail.title=currentLang==='ru'
      ? 'screen.width/height — размеры в CSS-пикселях. Умножение на DPR даёт только оценку пиксельной сетки и не гарантирует нативное разрешение панели.'
      : 'screen.width/height are CSS pixels. Multiplying by DPR only estimates the device-pixel grid and does not guarantee the panel native resolution.';
  };
  $('#refresh-snapshot')?.addEventListener('click',()=>requestAnimationFrame(updateSnapshotV5));

  const v5Renderers = {
    'sha256-file':renderSha256,
    'duplicate-files':renderDuplicates,
    'frame-time':renderFrameTime,
    'storage-units':renderStorageUnits
  };
  const previousOpenDialog = openDialog;
  openDialog = function openDialogV5(name) {
    if (!v5Renderers[name]) return previousOpenDialog(name);
    stopActive();
    dialogContent.innerHTML='';
    const init=v5Renderers[name]();
    dialog.showModal();
    requestAnimationFrame(()=>{cleanup=typeof init==='function'?(init()||null):null;refreshIcons();});
  };

  renderFilters();
  renderToolCards();
  updateSnapshotV5();
  refreshIcons();
})();
