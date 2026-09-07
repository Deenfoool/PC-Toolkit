const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const dialog = $('#dialog');
const dialogContent = $('#dialog-content');
const dialogClose = $('#dialog-close');
const pixelTest = $('#pixel-test');
const pixelExit = $('#pixel-exit');
let micStream = null;
let micAnimation = null;
let audioContext = null;

function getWebGLRenderer() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'Unavailable';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  } catch {
    return 'Unavailable';
  }
}

function detectBrowser() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Microsoft Edge';
  if (/OPR\//.test(ua)) return 'Opera';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari';
  return navigator.appName || 'Unknown browser';
}

function snapshot() {
  const display = `${screen.width} × ${screen.height}`;
  $('#snap-display').textContent = display;
  $('#snap-dpr').textContent = `DPR ${window.devicePixelRatio || 1} • ${screen.colorDepth || '—'}-bit color`;
  $('#snap-cpu').textContent = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency}` : 'Unavailable';
  $('#snap-memory').textContent = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unavailable';
  $('#snap-gpu').textContent = getWebGLRenderer();
}

snapshot();
$('#refresh-snapshot').addEventListener('click', snapshot);

$$('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.filter').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    const value = btn.dataset.filter;
    $$('.tool-card').forEach(card => {
      card.hidden = value !== 'all' && card.dataset.category !== value;
    });
  });
});

const head = (kicker, title, text) => `
  <div class="tool-head">
    <p class="kicker">${kicker}</p>
    <h2>${title}</h2>
    <p>${text}</p>
  </div>`;

function openDialog(name) {
  stopMic();
  const renderers = {
    'system-check': renderSystemCheck,
    'refresh-rate': renderRefreshRate,
    'dead-pixel': renderDeadPixel,
    'keyboard': renderKeyboard,
    'mouse': renderMouse,
    'speaker': renderSpeaker,
    'microphone': renderMicrophone,
    'ram': renderRam,
    'ppi': renderPpi,
    'psu': renderPsu,
    'download': renderDownload
  };
  dialogContent.innerHTML = '';
  const init = renderers[name]?.();
  dialog.showModal();
  if (typeof init === 'function') requestAnimationFrame(init);
}

$$('[data-open]').forEach(el => el.addEventListener('click', () => openDialog(el.dataset.open)));
dialogClose.addEventListener('click', () => dialog.close());
dialog.addEventListener('close', stopMic);
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

function renderSystemCheck() {
  const renderer = getWebGLRenderer();
  const memory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Not exposed by browser';
  const cpu = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} logical threads` : 'Not exposed by browser';
  const connection = navigator.connection?.effectiveType ? `${navigator.connection.effectiveType.toUpperCase()} (${navigator.connection.downlink || '?'} Mb/s est.)` : 'Not exposed by browser';
  dialogContent.innerHTML = `${head('Quick check', 'Your browser environment', 'A privacy-friendly snapshot of what the browser can detect. This is not a full hardware inventory.')}
  <div class="tool-body">
    <div class="result-box"><div class="big-result">${screen.width} × ${screen.height}</div><div class="muted">Display resolution • DPR ${window.devicePixelRatio || 1}</div></div>
    <ul class="info-list">
      <li><span>Browser</span><strong>${detectBrowser()}</strong></li>
      <li><span>CPU</span><strong>${cpu}</strong></li>
      <li><span>Memory</span><strong>${memory}</strong></li>
      <li><span>GPU / WebGL</span><strong>${renderer}</strong></li>
      <li><span>Color depth</span><strong>${screen.colorDepth || '—'} bit</strong></li>
      <li><span>Connection</span><strong>${connection}</strong></li>
      <li><span>Touch points</span><strong>${navigator.maxTouchPoints || 0}</strong></li>
    </ul>
  </div>`;
}

function renderRefreshRate() {
  dialogContent.innerHTML = `${head('Monitor', 'Refresh Rate Test', 'Measures requestAnimationFrame intervals. Keep this tab visible and avoid moving the window during the sample.')}
  <div class="tool-body">
    <div class="result-box"><div class="big-result"><span id="hz-value">—</span> <small>Hz</small></div><div class="muted" id="hz-note">Ready to sample ~2 seconds</div></div>
    <div class="tool-actions"><button class="mini-btn accent" id="hz-start">Start measurement</button></div>
  </div>`;
  return () => $('#hz-start').addEventListener('click', measureRefreshRate);
}

function measureRefreshRate() {
  const btn = $('#hz-start');
  const value = $('#hz-value');
  const note = $('#hz-note');
  if (!btn) return;
  btn.disabled = true;
  value.textContent = '…';
  note.textContent = 'Sampling frames…';
  const samples = [];
  let last = performance.now();
  const start = last;
  function frame(now) {
    samples.push(now - last);
    last = now;
    if (now - start < 2200) return requestAnimationFrame(frame);
    const clean = samples.slice(10).filter(x => x > 2 && x < 50).sort((a,b) => a-b);
    const median = clean[Math.floor(clean.length / 2)];
    const hz = median ? 1000 / median : 0;
    value.textContent = hz ? hz.toFixed(hz > 100 ? 0 : 1) : '—';
    note.textContent = hz ? `Median frame interval ${median.toFixed(2)} ms • ${clean.length} samples` : 'Unable to get a stable sample.';
    btn.disabled = false;
  }
  requestAnimationFrame(frame);
}

function renderDeadPixel() {
  dialogContent.innerHTML = `${head('Monitor', 'Dead Pixel Test', 'Cycle through white, black, red, green and blue. Inspect the entire panel from a normal viewing distance.')}
  <div class="tool-body"><div class="result-box"><strong>Tip</strong><p class="muted">Clean the screen first — dust is very easy to mistake for a dead pixel.</p></div>
  <div class="tool-actions"><button class="mini-btn accent" id="pixel-start">Start fullscreen test</button></div></div>`;
  return () => $('#pixel-start').addEventListener('click', startPixelTest);
}

const pixelColors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#808080'];
let pixelIndex = 0;
function startPixelTest() {
  dialog.close();
  pixelIndex = 0;
  pixelTest.hidden = false;
  pixelTest.style.background = pixelColors[pixelIndex];
  document.documentElement.requestFullscreen?.().catch(() => {});
}
function nextPixelColor(e) {
  if (e.target === pixelExit) return;
  pixelIndex = (pixelIndex + 1) % pixelColors.length;
  pixelTest.style.background = pixelColors[pixelIndex];
}
pixelTest.addEventListener('click', nextPixelColor);
pixelExit.addEventListener('click', e => { e.stopPropagation(); stopPixelTest(); });
function stopPixelTest() {
  pixelTest.hidden = true;
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
}
document.addEventListener('keydown', e => { if (!pixelTest.hidden && e.key === 'Escape') stopPixelTest(); });

function renderKeyboard() {
  dialogContent.innerHTML = `${head('Input', 'Keyboard Tester', 'Press keys and watch the browser report key values and physical key codes.')}
  <div class="tool-body"><div class="key-log" id="key-log"><span class="muted">Click here, then press some keys…</span></div>
  <div class="tool-actions"><button class="mini-btn" id="key-clear">Clear</button></div></div>`;
  return () => {
    const log = $('#key-log');
    log.tabIndex = 0; log.focus();
    const handler = e => {
      if (!dialog.open || !$('#key-log')) return;
      e.preventDefault();
      const placeholder = $('.muted', log); if (placeholder) placeholder.remove();
      const pill = document.createElement('span');
      pill.className = 'key-pill';
      pill.textContent = `${e.key === ' ' ? 'Space' : e.key} · ${e.code}`;
      log.prepend(pill);
      while (log.children.length > 18) log.lastElementChild.remove();
    };
    dialog._keyHandler && document.removeEventListener('keydown', dialog._keyHandler);
    dialog._keyHandler = handler;
    document.addEventListener('keydown', handler);
    $('#key-clear').addEventListener('click', () => { log.innerHTML = '<span class="muted">Press some keys…</span>'; log.focus(); });
  };
}

dialog.addEventListener('close', () => {
  if (dialog._keyHandler) document.removeEventListener('keydown', dialog._keyHandler);
  dialog._keyHandler = null;
});

function renderMouse() {
  dialogContent.innerHTML = `${head('Input', 'Mouse Tester', 'Use the test area to verify button events, click timing and live pointer coordinates.')}
  <div class="tool-body"><div class="mouse-pad" id="mouse-pad">Move and click here</div>
  <ul class="info-list"><li><span>Last button</span><strong id="mouse-button">—</strong></li><li><span>Total clicks</span><strong id="mouse-clicks">0</strong></li><li><span>Double-clicks</span><strong id="mouse-dbl">0</strong></li><li><span>Position</span><strong id="mouse-pos">—</strong></li></ul></div>`;
  return () => {
    const pad = $('#mouse-pad'); let clicks = 0, dbl = 0;
    const names = ['Left', 'Middle', 'Right', 'Back', 'Forward'];
    pad.addEventListener('contextmenu', e => e.preventDefault());
    pad.addEventListener('pointermove', e => { const r = pad.getBoundingClientRect(); $('#mouse-pos').textContent = `${Math.round(e.clientX-r.left)}, ${Math.round(e.clientY-r.top)}`; });
    pad.addEventListener('pointerdown', e => { clicks++; $('#mouse-clicks').textContent = clicks; $('#mouse-button').textContent = names[e.button] || `Button ${e.button}`; pad.textContent = `${names[e.button] || 'Button'} pressed`; });
    pad.addEventListener('dblclick', () => { dbl++; $('#mouse-dbl').textContent = dbl; });
    pad.addEventListener('pointerup', () => { pad.textContent = 'Move and click here'; });
  };
}

function tone(pan = 0) {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const panner = audioContext.createStereoPanner ? audioContext.createStereoPanner() : null;
  osc.frequency.value = 440;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.7);
  if (panner) { panner.pan.value = pan; osc.connect(gain).connect(panner).connect(audioContext.destination); }
  else { osc.connect(gain).connect(audioContext.destination); }
  osc.start(); osc.stop(audioContext.currentTime + 0.72);
}
function renderSpeaker() {
  dialogContent.innerHTML = `${head('Audio', 'Speaker Test', 'Use a moderate volume. The center tone should sound equally strong in both channels.')}
  <div class="tool-body"><div class="result-box"><div class="big-result">L · C · R</div><div class="muted">440 Hz reference tone</div></div>
  <div class="tool-actions"><button class="mini-btn" data-pan="-1">Left</button><button class="mini-btn accent" data-pan="0">Center</button><button class="mini-btn" data-pan="1">Right</button></div></div>`;
  return () => $$('[data-pan]', dialogContent).forEach(btn => btn.addEventListener('click', () => tone(Number(btn.dataset.pan))));
}

function renderMicrophone() {
  dialogContent.innerHTML = `${head('Audio', 'Microphone Test', 'The browser will request microphone permission. Audio is analyzed locally and is not uploaded.')}
  <div class="tool-body"><div class="result-box"><div class="level-track"><div class="level-bar" id="mic-level"></div></div><p class="muted" id="mic-note">Permission is requested only after you press Start.</p></div>
  <div class="tool-actions"><button class="mini-btn accent" id="mic-start">Start microphone</button><button class="mini-btn" id="mic-stop" disabled>Stop</button></div></div>`;
  return () => { $('#mic-start').addEventListener('click', startMic); $('#mic-stop').addEventListener('click', stopMic); };
}
async function startMic() {
  const note = $('#mic-note');
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(micStream);
    const analyser = audioContext.createAnalyser(); analyser.fftSize = 1024;
    source.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    $('#mic-start').disabled = true; $('#mic-stop').disabled = false; note.textContent = 'Listening locally…';
    const draw = () => {
      if (!micStream || !$('#mic-level')) return;
      analyser.getByteTimeDomainData(data);
      let sum = 0; for (const value of data) { const v = (value - 128) / 128; sum += v * v; }
      const rms = Math.sqrt(sum / data.length);
      $('#mic-level').style.width = `${Math.min(100, rms * 360)}%`;
      micAnimation = requestAnimationFrame(draw);
    }; draw();
  } catch (err) {
    if (note) note.textContent = `Microphone unavailable: ${err.name || 'permission denied'}`;
  }
}
function stopMic() {
  if (micAnimation) cancelAnimationFrame(micAnimation);
  micAnimation = null;
  if (micStream) micStream.getTracks().forEach(track => track.stop());
  micStream = null;
  const level = $('#mic-level'); if (level) level.style.width = '0%';
  const start = $('#mic-start'); if (start) start.disabled = false;
  const stop = $('#mic-stop'); if (stop) stop.disabled = true;
}

function renderRam() {
  dialogContent.innerHTML = `${head('Hardware', 'RAM First-Word Latency', 'A simplified estimate using CAS latency and effective transfer rate. Lower is better when comparing otherwise similar memory.')}
  <div class="tool-body"><div class="form-grid"><div class="field"><label>Memory speed (MT/s)</label><input id="ram-speed" type="number" min="1" value="6000"></div><div class="field"><label>CAS latency (CL)</label><input id="ram-cl" type="number" min="1" value="30"></div></div>
  <div class="result-box" style="margin-top:14px"><div class="big-result"><span id="ram-result">10.0</span> <small>ns</small></div><div class="muted">Approx. first-word CAS latency</div></div></div>`;
  return () => {
    const calc = () => { const mt = Number($('#ram-speed').value); const cl = Number($('#ram-cl').value); $('#ram-result').textContent = mt > 0 && cl > 0 ? ((cl * 2000) / mt).toFixed(2) : '—'; };
    $('#ram-speed').addEventListener('input', calc); $('#ram-cl').addEventListener('input', calc); calc();
  };
}

function renderPpi() {
  dialogContent.innerHTML = `${head('Hardware', 'PPI Calculator', 'Calculate pixel density from horizontal resolution, vertical resolution and diagonal size.')}
  <div class="tool-body"><div class="form-grid"><div class="field"><label>Width (px)</label><input id="ppi-w" type="number" value="2560"></div><div class="field"><label>Height (px)</label><input id="ppi-h" type="number" value="1440"></div><div class="field"><label>Diagonal (inches)</label><input id="ppi-d" type="number" step="0.1" value="27"></div></div>
  <div class="result-box" style="margin-top:14px"><div class="big-result"><span id="ppi-result">108.8</span> <small>PPI</small></div><div class="muted" id="ppi-pitch">Pixel pitch 0.233 mm</div></div></div>`;
  return () => {
    const calc = () => { const w=Number($('#ppi-w').value), h=Number($('#ppi-h').value), d=Number($('#ppi-d').value); const ppi = d>0 ? Math.hypot(w,h)/d : 0; $('#ppi-result').textContent = ppi ? ppi.toFixed(1) : '—'; $('#ppi-pitch').textContent = ppi ? `Pixel pitch ${(25.4/ppi).toFixed(3)} mm` : 'Enter valid values'; };
    ['#ppi-w','#ppi-h','#ppi-d'].forEach(id => $(id).addEventListener('input', calc)); calc();
  };
}

function renderPsu() {
  dialogContent.innerHTML = `${head('Hardware', 'PSU Headroom Calculator', 'A quick capacity estimate — not a PSU quality rating. Enter realistic sustained power figures, not marketing labels.')}
  <div class="tool-body"><div class="form-grid"><div class="field"><label>GPU power (W)</label><input id="psu-gpu" type="number" value="250"></div><div class="field"><label>CPU package power (W)</label><input id="psu-cpu" type="number" value="125"></div><div class="field"><label>Other components (W)</label><input id="psu-other" type="number" value="80"></div><div class="field"><label>Headroom (%)</label><input id="psu-headroom" type="number" value="35"></div></div>
  <div class="result-box" style="margin-top:14px"><div class="big-result"><span id="psu-result">650</span> <small>W PSU</small></div><div class="muted" id="psu-load">Estimated system draw: 455 W</div></div></div>`;
  return () => {
    const calc = () => { const gpu=Number($('#psu-gpu').value)||0, cpu=Number($('#psu-cpu').value)||0, other=Number($('#psu-other').value)||0, head=Math.max(0,Number($('#psu-headroom').value)||0); const draw=gpu+cpu+other; const raw=draw*(1+head/100); const recommended=Math.ceil(raw/50)*50; $('#psu-result').textContent = recommended || '—'; $('#psu-load').textContent = `Estimated system draw: ${draw} W • capacity includes ${head}% headroom`; };
    ['#psu-gpu','#psu-cpu','#psu-other','#psu-headroom'].forEach(id => $(id).addEventListener('input', calc)); calc();
  };
}

function renderDownload() {
  dialogContent.innerHTML = `${head('Utility', 'Download Time Calculator', 'Estimate ideal download time from file size and connection speed. Real downloads are usually a little slower due to overhead and server limits.')}
  <div class="tool-body"><div class="form-grid"><div class="field"><label>File size (GB)</label><input id="dl-size" type="number" step="0.1" value="80"></div><div class="field"><label>Connection (Mbps)</label><input id="dl-speed" type="number" step="0.1" value="100"></div></div>
  <div class="result-box" style="margin-top:14px"><div class="big-result" id="dl-result">1h 46m 40s</div><div class="muted">Ideal transfer time</div></div></div>`;
  return () => {
    const format = sec => { if (!isFinite(sec) || sec <= 0) return '—'; const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=Math.round(sec%60); return [h?`${h}h`:null, (h||m)?`${m}m`:null, `${s}s`].filter(Boolean).join(' '); };
    const calc = () => { const gb=Number($('#dl-size').value), mbps=Number($('#dl-speed').value); $('#dl-result').textContent = format((gb*8*1000)/mbps); };
    $('#dl-size').addEventListener('input', calc); $('#dl-speed').addEventListener('input', calc); calc();
  };
}
