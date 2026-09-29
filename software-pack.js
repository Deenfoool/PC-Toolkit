(() => {
  const refreshIcons = () => {
    try { window.lucide?.createIcons?.({attrs:{'stroke-width':1.8}}); } catch {}
  };

  translations.en['cat.software'] = 'Software';
  translations.ru['cat.software'] = 'Софт';
  if (!categories.includes('software')) {
    const windowsIndex = categories.indexOf('windows');
    categories.splice(windowsIndex >= 0 ? windowsIndex : categories.length, 0, 'software');
  }

  Object.assign(toolText.en, {
    softwarePack:{
      title:'Essential PC Software',
      desc:'Official download links and a Winget builder for everyday apps, diagnostics, VPN, monitoring and disk tools.',
      tag:'Software'
    }
  });
  Object.assign(toolText.ru, {
    softwarePack:{
      title:'Набор программ для ПК',
      desc:'Официальные ссылки и Winget-конструктор для софта после установки Windows, диагностики, VPN и дисков.',
      tag:'Софт'
    }
  });

  if (!tools.some(tool => tool.id === 'software-pack')) {
    tools.push({
      id:'software-pack',
      key:'softwarePack',
      category:'software',
      icon:'<i data-lucide="package" aria-hidden="true"></i>',
      featured:true
    });
  }

  const apps = [
    {
      id:'word',
      name:'Microsoft Word / Microsoft 365',
      icon:'file-text',
      group:'everyday',
      url:'https://www.microsoft.com/microsoft-365/word',
      winget:'Microsoft.Office',
      license:{ru:'Нужна лицензия',en:'License required'},
      desc:{
        ru:'Word и остальные приложения Microsoft 365. Десктопная версия требует подходящую лицензию или подписку.',
        en:'Word and the Microsoft 365 desktop apps. The desktop version requires an eligible license or subscription.'
      },
      note:{
        ru:'Winget-пакет устанавливает Microsoft 365 Apps; активация выполняется вашей лицензией Microsoft.',
        en:'The Winget package installs Microsoft 365 Apps; activation still requires your Microsoft license.'
      }
    },
    {
      id:'winrar',
      name:'WinRAR',
      icon:'archive',
      group:'everyday',
      url:'https://www.rarlab.com/download.htm',
      winget:'RARLab.WinRAR',
      license:{ru:'Trial',en:'Trial'},
      desc:{
        ru:'Архиватор RAR/ZIP. На сайте используем только официальный RARLAB, без зеркал и репаков.',
        en:'RAR/ZIP archive manager. PC Toolkit links only to the official RARLAB source, not mirrors or repacks.'
      }
    },
    {
      id:'proton',
      name:'Proton VPN',
      icon:'shield',
      group:'network',
      url:'https://protonvpn.com/download-windows',
      winget:'Proton.ProtonVPN',
      license:{ru:'Есть бесплатный тариф',en:'Free plan available'},
      desc:{
        ru:'VPN-клиент для Windows. Выбран как понятный вариант с официальным Windows-приложением и бесплатным тарифом.',
        en:'VPN client for Windows, with an official Windows app and a free plan available.'
      }
    },
    {
      id:'cdi',
      name:'CrystalDiskInfo',
      icon:'hard-drive',
      group:'storage',
      url:'https://crystalmark.info/en/download/',
      winget:'CrystalDewWorld.CrystalDiskInfo',
      license:{ru:'Бесплатно',en:'Free'},
      desc:{
        ru:'SMART, температура и состояние HDD/SSD/NVMe. Полезен сразу после сборки или переустановки системы.',
        en:'SMART data, temperature and health information for HDD/SSD/NVMe drives.'
      }
    },
    {
      id:'occt',
      name:'OCCT',
      icon:'activity',
      group:'diagnostics',
      url:'https://www.ocbase.com/download-personal',
      winget:'OCBase.OCCT.Personal',
      license:{ru:'Personal бесплатно',en:'Free for personal use'},
      desc:{
        ru:'Стресс-тест CPU/GPU/RAM/VRAM и поиск ошибок стабильности. Personal-лицензия предназначена для личного использования.',
        en:'CPU/GPU/RAM/VRAM stress testing and stability error detection. Personal edition is for personal use.'
      },
      warning:{
        ru:'Во время стресс-теста следите за температурой. Останавливайте тест при ненормальном нагреве, ошибках или нестабильности.',
        en:'Watch temperatures during stress tests. Stop if temperatures become abnormal or the system shows errors or instability.'
      }
    },
    {
      id:'aida',
      name:'AIDA64 Extreme',
      icon:'gauge',
      group:'diagnostics',
      url:'https://www.aida64.com/downloads',
      winget:'FinalWire.AIDA64.Extreme',
      license:{ru:'Trial / платно',en:'Trial / paid'},
      desc:{
        ru:'Подробная информация о железе, датчиках и бенчмарках. Extreme — домашняя редакция AIDA64.',
        en:'Detailed hardware, sensor and benchmark information. Extreme is the home-user edition of AIDA64.'
      }
    },
    {
      id:'cpuz',
      name:'CPU-Z',
      icon:'cpu',
      group:'diagnostics',
      url:'https://www.cpuid.com/softwares/cpu-z.html',
      winget:'CPUID.CPU-Z',
      license:{ru:'Бесплатно',en:'Free'},
      desc:{
        ru:'Быстрая информация о CPU, материнской плате и памяти: модель, частоты, тайминги и SPD.',
        en:'Quick CPU, motherboard and memory details including clocks, timings and SPD information.'
      }
    },
    {
      id:'afterburner',
      name:'MSI Afterburner',
      icon:'gauge',
      group:'diagnostics',
      url:'https://www.msi.com/Landing/afterburner/graphics-cards',
      winget:null,
      license:{ru:'Бесплатно',en:'Free'},
      desc:{
        ru:'Мониторинг GPU, OSD, fan curve, undervolt/overclock. Скачивание — только с MSI или Guru3D.',
        en:'GPU monitoring, OSD, fan curves, undervolting and overclocking. Download only from MSI or Guru3D.'
      },
      warning:{
        ru:'В официальном каталоге Winget пакет сейчас не найден — поэтому здесь только ссылка на MSI.',
        en:'No package was found in the official Winget catalog, so this card uses the MSI download page only.'
      }
    },
    {
      id:'minitool',
      name:'MiniTool Partition Wizard Free',
      icon:'hard-drive',
      group:'storage',
      url:'https://www.minitool.com/download-center/partition-manager-download.html',
      winget:'MiniTool.PartitionWizard.Free',
      license:{ru:'Free для дома',en:'Free for home use'},
      desc:{
        ru:'Управление разделами диска: создание, удаление, изменение размера и другие операции.',
        en:'Disk partition management for creating, deleting, resizing and other partition operations.'
      },
      warning:{
        ru:'Перед изменением разделов сделайте резервную копию важных данных.',
        en:'Back up important data before changing disk partitions.'
      }
    }
  ];

  const groupLabels = {
    ru:{everyday:'Повседневное',network:'Сеть',diagnostics:'Диагностика',storage:'Диски'},
    en:{everyday:'Everyday',network:'Network',diagnostics:'Diagnostics',storage:'Storage'}
  };

  const esc = value => escapeHtml(String(value ?? ''));

  async function copyTextV6(text, note) {
    let ok=false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok=true;
      }
    } catch {}
    if (!ok) {
      const area=document.createElement('textarea');
      area.value=text;
      area.style.cssText='position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(area);
      area.select();
      try { ok=document.execCommand?.('copy') || false; } catch {}
      area.remove();
    }
    if (note) note.textContent = ok
      ? (currentLang==='ru' ? 'Скопировано' : 'Copied')
      : (currentLang==='ru' ? 'Не удалось скопировать' : 'Copy failed');
  }

  function installLine(pkg) {
    return `winget install --id ${pkg} -e --accept-package-agreements --accept-source-agreements`;
  }

  function renderSoftwarePack() {
    const ru=currentLang==='ru';
    const lang=ru?'ru':'en';
    const g=groupLabels[lang];
    const x=ru ? {
      kicker:'Софт',
      title:'Набор программ для ПК',
      intro:'Подборка после установки Windows и для диагностики. Ссылки ведут на официальные сайты. Для пакетов из Winget можно собрать одну готовую команду.',
      official:'Официальный сайт',
      winget:'Winget',
      unavailable:'Только официальный сайт',
      select:'Добавить в установку',
      builder:'Winget-конструктор',
      builderDesc:'Отметьте нужные программы или используйте пресет. PC Toolkit соберёт команды установки.',
      everyday:'База',
      diagnostics:'Диагностика',
      all:'Все Winget',
      clear:'Сбросить',
      copy:'Скопировать команды',
      empty:'Выберите хотя бы одну программу с поддержкой Winget.',
      selected:'Выбрано',
      note:'Winget скачивает пакеты из своих источников. Перед установкой всё равно проверьте имя пакета и издателя в терминале.',
      commercial:'Лицензии отдельных программ могут ограничивать коммерческое использование.'
    } : {
      kicker:'Software',
      title:'Essential PC Software',
      intro:'A practical post-install and diagnostics collection. Links point to official vendor pages. Winget-supported apps can be combined into one install script.',
      official:'Official site',
      winget:'Winget',
      unavailable:'Official site only',
      select:'Add to install',
      builder:'Winget builder',
      builderDesc:'Select apps or use a preset. PC Toolkit will build the install commands.',
      everyday:'Essentials',
      diagnostics:'Diagnostics',
      all:'All Winget',
      clear:'Clear',
      copy:'Copy commands',
      empty:'Select at least one Winget-supported app.',
      selected:'Selected',
      note:'Winget downloads packages from its configured sources. Still verify the package name and publisher in Terminal before installing.',
      commercial:'Some programs have license restrictions for commercial use.'
    };

    const groups=['everyday','network','diagnostics','storage'];
    const cards=groups.map(group => {
      const rows=apps.filter(app=>app.group===group).map(app => {
        const canWinget=Boolean(app.winget);
        return `<article class="software-app" data-app="${app.id}">
          <div class="software-app-top">
            <div class="software-app-icon"><i data-lucide="${app.icon}" aria-hidden="true"></i></div>
            <div class="software-app-title"><strong>${esc(app.name)}</strong><span>${esc(app.license[lang])}</span></div>
            ${canWinget ? `<label class="software-pick"><input type="checkbox" data-software-pkg="${esc(app.winget)}" data-software-id="${app.id}"><span>${x.select}</span></label>` : ''}
          </div>
          <p>${esc(app.desc[lang])}</p>
          ${app.note ? `<div class="software-note"><i data-lucide="info" aria-hidden="true"></i><span>${esc(app.note[lang])}</span></div>` : ''}
          ${app.warning ? `<div class="software-note warning"><i data-lucide="alert-triangle" aria-hidden="true"></i><span>${esc(app.warning[lang])}</span></div>` : ''}
          <div class="software-actions">
            <a class="mini-btn" href="${esc(app.url)}" target="_blank" rel="noreferrer"><i data-lucide="external-link" aria-hidden="true"></i><span>${x.official}</span></a>
            ${canWinget ? `<button class="mini-btn software-copy-one" type="button" data-copy-pkg="${esc(app.winget)}"><i data-lucide="terminal" aria-hidden="true"></i><span>${x.winget}</span></button>` : `<span class="software-no-winget">${x.unavailable}</span>`}
          </div>
        </article>`;
      }).join('');
      return `<section class="software-group"><div class="software-group-head"><span>${g[group]}</span><small>${apps.filter(app=>app.group===group).length}</small></div><div class="software-grid">${rows}</div></section>`;
    }).join('');

    dialogContent.innerHTML = `${head(x.kicker,x.title,x.intro)}
      <div class="tool-body software-tool">
        <div class="software-trust"><i data-lucide="shield" aria-hidden="true"></i><div><strong>${ru?'Без репаков и файлообменников':'No repacks or file mirrors'}</strong><span>${ru?'Только официальные страницы разработчиков и проверенные идентификаторы Winget.':'Official vendor pages and verified Winget identifiers only.'}</span></div></div>
        ${cards}
        <section class="software-builder">
          <div class="software-builder-head"><div><span>${x.builder}</span><p>${x.builderDesc}</p></div><strong id="software-selected">0</strong></div>
          <div class="software-presets">
            <button class="mini-btn" type="button" data-software-preset="everyday">${x.everyday}</button>
            <button class="mini-btn" type="button" data-software-preset="diagnostics">${x.diagnostics}</button>
            <button class="mini-btn" type="button" data-software-preset="all">${x.all}</button>
            <button class="mini-btn" type="button" data-software-preset="clear">${x.clear}</button>
          </div>
          <textarea class="report-output software-output" id="software-output" readonly></textarea>
          <div class="tool-actions"><button class="mini-btn accent" id="software-copy" type="button"><i data-lucide="copy" aria-hidden="true"></i><span>${x.copy}</span></button></div>
          <div class="muted software-copy-note" id="software-copy-note"></div>
          <div class="software-footnote"><i data-lucide="info" aria-hidden="true"></i><span>${x.note} ${x.commercial}</span></div>
        </section>
      </div>`;

    refreshIcons();

    return () => {
      const output=$('#software-output');
      const note=$('#software-copy-note');
      const selected=$('#software-selected');
      const picks=()=>$$('[data-software-pkg]',dialogContent);

      const update=()=>{
        const chosen=picks().filter(input=>input.checked).map(input=>input.dataset.softwarePkg);
        output.value=chosen.length ? chosen.map(installLine).join('\n') : x.empty;
        selected.textContent=`${x.selected}: ${chosen.length}`;
      };

      $$('[data-software-pkg]',dialogContent).forEach(input=>input.addEventListener('change',update));

      $$('[data-software-preset]',dialogContent).forEach(button=>button.addEventListener('click',()=>{
        const preset=button.dataset.softwarePreset;
        picks().forEach(input=>{
          const app=apps.find(item=>item.id===input.dataset.softwareId);
          if(preset==='clear') input.checked=false;
          else if(preset==='all') input.checked=true;
          else if(preset==='everyday') input.checked=['word','winrar','proton','cdi','cpuz'].includes(app?.id);
          else if(preset==='diagnostics') input.checked=['cdi','occt','aida','cpuz','minitool'].includes(app?.id);
        });
        update();
      }));

      $$('.software-copy-one',dialogContent).forEach(button=>button.addEventListener('click',()=>{
        copyTextV6(installLine(button.dataset.copyPkg),note);
      }));

      $('#software-copy').addEventListener('click',()=>{
        const chosen=picks().filter(input=>input.checked);
        if(!chosen.length){
          note.textContent=x.empty;
          return;
        }
        copyTextV6(output.value,note);
      });

      update();
    };
  }

  const previousOpenDialog=openDialog;
  openDialog=function softwarePackOpenDialog(name){
    if(name!=='software-pack') return previousOpenDialog(name);
    stopActive();
    dialogContent.innerHTML='';
    const init=renderSoftwarePack();
    dialog.showModal();
    requestAnimationFrame(()=>{
      cleanup=typeof init==='function' ? (init() || null) : null;
      refreshIcons();
    });
  };

  renderFilters();
  renderToolCards();
  refreshIcons();
})();