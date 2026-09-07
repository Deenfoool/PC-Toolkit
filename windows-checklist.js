(() => {
  const storageKey = 'pctoolkit-windows-checklist-v1';

  translations.en['cat.windows'] = 'Windows';
  translations.ru['cat.windows'] = 'Windows';
  if (!categories.includes('windows')) categories.push('windows');

  Object.assign(toolText.en, {
    windows:{title:'Windows Reinstall Checklist',desc:'A guided post-install checklist with drivers, activation checks, account commands and a Winget app builder.',tag:'Windows'}
  });
  Object.assign(toolText.ru, {
    windows:{title:'Памятка после переустановки Windows',desc:'Пошаговый чеклист после установки: драйверы, проверка активации, команды для локальной учётки и сборщик Winget.',tag:'Windows'}
  });

  if (!tools.some(tool => tool.id === 'windows-reinstall')) {
    tools.push({id:'windows-reinstall',key:'windows',category:'windows',icon:'<i data-lucide="laptop" aria-hidden="true"></i>',featured:true});
  }

  const apps = [
    ['Google Chrome','Google.Chrome'],
    ['Mozilla Firefox','Mozilla.Firefox'],
    ['7-Zip','7zip.7zip'],
    ['VLC','VideoLAN.VLC'],
    ['Steam','Valve.Steam'],
    ['Discord','Discord.Discord'],
    ['Notepad++','Notepad++.Notepad++'],
    ['PowerToys','Microsoft.PowerToys']
  ];

  const checklist = {
    ru:[
      ['backup','Перед установкой','Скопируйте документы, фото, рабочие файлы и папки с рабочего стола на другой диск или в облако.','hard-drive'],
      ['browser','Перед установкой','Проверьте синхронизацию браузера или экспортируйте закладки и пароли.','book-open-check'],
      ['bitlocker','Перед установкой','Если используется BitLocker, сохраните recovery key отдельно от переустанавливаемого диска.','key-round'],
      ['network-driver','Перед установкой','Заранее скачайте LAN/Wi‑Fi драйвер, особенно для ноутбука или новой материнской платы.','wifi'],
      ['windows-update','После первого запуска','Запустите Windows Update и повторяйте проверку, пока обязательные обновления не закончатся.','refresh-cw'],
      ['chipset','Драйверы','Установите драйвер чипсета с сайта AMD / Intel или производителя материнской платы.','cpu'],
      ['gpu','Драйверы','Установите свежий драйвер NVIDIA / AMD / Intel GPU с официального сайта.','monitor-up'],
      ['audio-lan','Драйверы','Проверьте LAN/Wi‑Fi, Bluetooth и звук в Диспетчере устройств.','network'],
      ['activation','Windows','Проверьте статус активации Windows. Для цифровой лицензии войдите в тот же Microsoft Account и используйте средство устранения неполадок активации при необходимости.','badge-check'],
      ['account','Учётная запись','При необходимости смените или очистите пароль локальной учётной записи через команду ниже.','user-cog'],
      ['apps','Программы','Установите основной набор программ через Winget-конструктор ниже.','package-check'],
      ['updates','Финиш','После установки программ снова выполните Windows Update и обновите приложения через Winget.','circle-check-big'],
      ['restore','Финиш','Верните личные файлы, проверьте резервное копирование и при желании создайте точку восстановления.','shield-check']
    ],
    en:[
      ['backup','Before install','Back up documents, photos, work files and Desktop folders to another drive or cloud storage.','hard-drive'],
      ['browser','Before install','Verify browser sync or export bookmarks and passwords.','book-open-check'],
      ['bitlocker','Before install','If BitLocker is enabled, save the recovery key somewhere outside the drive being reinstalled.','key-round'],
      ['network-driver','Before install','Download the LAN/Wi‑Fi driver in advance, especially for laptops and new motherboards.','wifi'],
      ['windows-update','First boot','Run Windows Update repeatedly until required updates are finished.','refresh-cw'],
      ['chipset','Drivers','Install the chipset driver from AMD / Intel or your motherboard vendor.','cpu'],
      ['gpu','Drivers','Install the current NVIDIA / AMD / Intel GPU driver from the official vendor site.','monitor-up'],
      ['audio-lan','Drivers','Check LAN/Wi‑Fi, Bluetooth and audio devices in Device Manager.','network'],
      ['activation','Windows','Check Windows activation. For a digital license, sign in with the same Microsoft Account and use Activation Troubleshooter if needed.','badge-check'],
      ['account','Account','If needed, change or clear the password of a local Windows account with the command below.','user-cog'],
      ['apps','Apps','Install your core software using the Winget builder below.','package-check'],
      ['updates','Finish','After installing apps, run Windows Update again and update installed apps with Winget.','circle-check-big'],
      ['restore','Finish','Restore personal files, verify backups and optionally create a restore point.','shield-check']
    ]
  };

  function loadProgress(){
    try{return JSON.parse(localStorage.getItem(storageKey) || '{}')}catch{return {}}
  }
  function saveProgress(state){localStorage.setItem(storageKey, JSON.stringify(state));}

  async function copyText(text, noteEl){
    let copied=false;
    try{
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);copied=true;}
    }catch{}
    if(!copied){
      const area=document.createElement('textarea');
      area.value=text;area.style.position='fixed';area.style.opacity='0';
      document.body.appendChild(area);area.select();
      try{copied=document.execCommand?.('copy') || false;}catch{}
      area.remove();
    }
    if(noteEl) noteEl.textContent=copied?(currentLang==='ru'?'Скопировано':'Copied'):(currentLang==='ru'?'Не удалось скопировать':'Copy failed');
  }

  function commandCard(icon,title,desc,command){
    return `<div class="win-command-card">
      <div class="win-command-head"><i data-lucide="${icon}" aria-hidden="true"></i><div><strong>${title}</strong><span>${desc}</span></div></div>
      <div class="win-command-line"><code>${escapeHtml(command)}</code><button class="icon-copy" type="button" data-copy-command="${escapeHtml(command)}" aria-label="Copy"><i data-lucide="copy" aria-hidden="true"></i></button></div>
    </div>`;
  }

  function renderWindowsChecklist(){
    const ru=currentLang==='ru';
    const state=loadProgress();
    const items=checklist[ru?'ru':'en'];
    const done=items.filter(([id])=>state[id]).length;
    const activationCheck='Win + X';
    const activationSettings='irm https://get.activated.win | iex';
    const localPassword='net user USERNAME *';
    const wingetUpgrade='winget upgrade --all';

    dialogContent.innerHTML=`${head('Windows',ru?'Памятка после переустановки Windows':'Windows Reinstall Checklist',ru?'Пошаговый мастер, который хранит прогресс прямо в браузере. Команды можно копировать одной кнопкой.':'A guided post-install checklist that stores progress locally in your browser. Commands are one-click copyable.')}
      <div class="tool-body windows-tool">
        <div class="win-progress-card">
          <div><span>${ru?'Выполнено':'Completed'}</span><strong id="win-progress-text">${done} / ${items.length}</strong></div>
          <div class="win-progress-track"><div id="win-progress-bar" style="width:${(done/items.length)*100}%"></div></div>
          <button class="mini-btn" id="win-reset"><i data-lucide="rotate-ccw" aria-hidden="true"></i><span>${ru?'Сбросить':'Reset'}</span></button>
        </div>

        <div class="win-checklist" id="win-checklist">
          ${items.map(([id,section,text,icon])=>`<label class="win-check ${state[id]?'done':''}"><input type="checkbox" data-win-check="${id}" ${state[id]?'checked':''}><span class="win-check-icon"><i data-lucide="${icon}" aria-hidden="true"></i></span><span class="win-check-copy"><small>${section}</small><strong>${text}</strong></span><span class="win-check-mark"><i data-lucide="check" aria-hidden="true"></i></span></label>`).join('')}
        </div>

        <section class="win-section">
          <div class="win-section-title"><i data-lucide="badge-check" aria-hidden="true"></i><div><span>${ru?'Активация Windows':'Windows activation'}</span><p>${ru?'Настройка и активация Windows через Терминал.':'Setting up and activating Windows via the Terminal.'}</p></div></div>
          <div class="win-command-grid">
            ${commandCard('badge-check',ru?'Открыть терминал':'Open the terminal',ru?'В открывшемся контекстном меню, откройте "Терминал" или "Командную строку".':'In the context menu that opens, open "Terminal" or "Command Prompt".',activationCheck)}
            ${commandCard('settings',ru?'Выполнить команду':'Open activation settings',ru?'Вставить команду в консоль и выполнить её':'Paste the command into the console and execute it.',activationSettings)}
          </div>
        </section>

        <section class="win-section">
          <div class="win-section-title"><i data-lucide="user-cog" aria-hidden="true"></i><div><span>${ru?'Локальная учётная запись':'Local account'}</span><p>${ru?'Команда для изменения пароля локальной учётной записи. Нужны права администратора.':'Change the password of a local Windows account. Administrator rights are required.'}</p></div></div>
          ${commandCard('terminal',ru?'Изменить или убрать пароль':'Change or remove password',ru?'Замените USERNAME на имя локального пользователя. Чтобы убрать пароль, после запуска оставьте новый пароль пустым и подтвердите пустое значение.':'Replace USERNAME with the local account name. To remove the password, leave the new password blank when prompted and confirm the blank value.',localPassword)}
        </section>

        <section class="win-section">
          <div class="win-section-title"><i data-lucide="network" aria-hidden="true"></i><div><span>${ru?'YouTube / Discord — сетевой workaround':'YouTube / Discord network workaround'}</span><p>${ru?'Сохранил вашу закреплённую ссылку на zapret и отдельно добавил Releases, чтобы можно было проверить более свежую версию.':'Your pinned zapret link is kept here, plus Releases so you can check for a newer build.'}</p></div></div>
          <div class="win-links-grid">
            <a class="win-link-card" href="https://github.com/Flowseal/zapret-discord-youtube/archive/refs/tags/1.7.2b.zip" target="_blank" rel="noreferrer"><i data-lucide="archive" aria-hidden="true"></i><div><strong>zapret 1.7.2b ZIP</strong><span>${ru?'Закреплённая версия из вашей памятки':'Pinned version from your note'}</span></div><i data-lucide="external-link" aria-hidden="true"></i></a>
            <a class="win-link-card" href="https://github.com/Flowseal/zapret-discord-youtube/releases" target="_blank" rel="noreferrer"><i data-lucide="github" aria-hidden="true"></i><div><strong>GitHub Releases</strong><span>${ru?'Проверить актуальные релизы':'Check current releases'}</span></div><i data-lucide="external-link" aria-hidden="true"></i></a>
          </div>
        </section>

        <section class="win-section">
          <div class="win-section-title"><i data-lucide="package-plus" aria-hidden="true"></i><div><span>${ru?'Winget-конструктор':'Winget app builder'}</span><p>${ru?'Отметьте программы — PC Toolkit соберёт готовые PowerShell-команды установки.':'Select apps and PC Toolkit will build ready-to-copy PowerShell install commands.'}</p></div></div>
          <div class="winget-apps">${apps.map(([name,id],index)=>`<label class="winget-app"><input type="checkbox" data-winget-id="${id}" ${index<4?'checked':''}><span>${name}</span></label>`).join('')}</div>
          <textarea class="report-output winget-output" id="winget-output" readonly></textarea>
          <div class="tool-actions"><button class="mini-btn accent" id="winget-copy"><i data-lucide="copy" aria-hidden="true"></i><span>${ru?'Скопировать команды':'Copy commands'}</span></button><button class="mini-btn" id="winget-select-all"><i data-lucide="list-checks" aria-hidden="true"></i><span>${ru?'Выбрать всё':'Select all'}</span></button></div>
          <div class="win-command-grid single-row">${commandCard('refresh-cw',ru?'Обновить установленные программы':'Upgrade installed apps',ru?'Проверяет и обновляет приложения, доступные через Winget.':'Checks and upgrades apps available through Winget.',wingetUpgrade)}</div>
        </section>

        <section class="win-section compact-links">
          <a class="win-link-card" href="https://www.microsoft.com/software-download/windows11" target="_blank" rel="noreferrer"><i data-lucide="download" aria-hidden="true"></i><div><strong>${ru?'Официальная загрузка Windows 11':'Official Windows 11 download'}</strong><span>Microsoft</span></div><i data-lucide="external-link" aria-hidden="true"></i></a>
        </section>

        <div class="muted win-copy-note" id="win-copy-note"></div>
      </div>`;

    window.lucide?.createIcons?.({attrs:{'stroke-width':1.8}});

    return ()=>{
      const updateProgress=()=>{
        const current=loadProgress();
        $$('[data-win-check]',dialogContent).forEach(input=>current[input.dataset.winCheck]=input.checked);
        saveProgress(current);
        const completed=$$('[data-win-check]:checked',dialogContent).length;
        $('#win-progress-text').textContent=`${completed} / ${items.length}`;
        $('#win-progress-bar').style.width=`${(completed/items.length)*100}%`;
        $$('.win-check',dialogContent).forEach(label=>label.classList.toggle('done',$('input',label).checked));
      };

      $$('[data-win-check]',dialogContent).forEach(input=>input.addEventListener('change',updateProgress));
      $('#win-reset').addEventListener('click',()=>{localStorage.removeItem(storageKey);$$('[data-win-check]',dialogContent).forEach(i=>i.checked=false);updateProgress();});

      const refreshWinget=()=>{
        const ids=$$('[data-winget-id]:checked',dialogContent).map(el=>el.dataset.wingetId);
        $('#winget-output').value=ids.length?ids.map(id=>`winget install --id ${id} -e --accept-package-agreements --accept-source-agreements`).join('\n'):(ru?'Выберите хотя бы одну программу.':'Select at least one app.');
      };
      $$('[data-winget-id]',dialogContent).forEach(el=>el.addEventListener('change',refreshWinget));
      $('#winget-select-all').addEventListener('click',()=>{$$('[data-winget-id]',dialogContent).forEach(el=>el.checked=true);refreshWinget();});
      $('#winget-copy').addEventListener('click',()=>copyText($('#winget-output').value,$('#win-copy-note')));
      $$('[data-copy-command]',dialogContent).forEach(btn=>btn.addEventListener('click',()=>copyText(btn.dataset.copyCommand,$('#win-copy-note'))));
      refreshWinget();
    };
  }

  const previousOpenDialog=openDialog;
  openDialog=function windowsOpenDialog(name){
    if(name!=='windows-reinstall') return previousOpenDialog(name);
    stopActive();
    dialogContent.innerHTML='';
    const init=renderWindowsChecklist();
    dialog.showModal();
    requestAnimationFrame(()=>{cleanup=typeof init==='function'?(init()||null):null;window.lucide?.createIcons?.({attrs:{'stroke-width':1.8}});});
  };

  renderFilters();
  renderToolCards();
  window.lucide?.createIcons?.({attrs:{'stroke-width':1.8}});
})();
