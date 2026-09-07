(() => {
  const delegatedOpenDialog = openDialog;
  let recoveryInFlight = false;

  const hasWindowsContent = () => Boolean(dialogContent?.querySelector?.('.windows-tool'));

  const renderRecoveryError = () => {
    const ru = currentLang === 'ru';
    dialogContent.innerHTML = `${head(
      'Windows',
      ru ? 'Не удалось загрузить памятку' : 'Checklist failed to load',
      ru
        ? 'Основной модуль Windows не загрузился. Обновите страницу — остальные инструменты PC Toolkit продолжают работать.'
        : 'The Windows module did not load. Refresh the page — the rest of PC Toolkit remains available.'
    )}<div class="tool-body"><div class="result-box"><span class="muted">${ru ? 'Попробуйте обновить страницу без кэша.' : 'Try reloading the page without cache.'}</span></div><div class="tool-actions"><button class="mini-btn accent" id="windows-hard-reload"><i data-lucide="refresh-cw" aria-hidden="true"></i><span>${ru ? 'Обновить' : 'Reload'}</span></button></div></div>`;
    dialog.showModal?.();
    $('#windows-hard-reload')?.addEventListener('click', () => {
      const url = new URL(location.href);
      url.searchParams.set('refresh', Date.now().toString());
      location.replace(url.toString());
    });
    window.lucide?.createIcons?.({attrs:{'stroke-width':1.8}});
  };

  const recoverWindowsModule = () => {
    if (recoveryInFlight) return;
    recoveryInFlight = true;

    const script = document.createElement('script');
    script.src = `windows-checklist.js?v=20260907-3-${Date.now()}`;
    script.dataset.windowsRecovery = 'true';

    script.onload = () => {
      recoveryInFlight = false;
      try {
        openDialog('windows-reinstall');
        requestAnimationFrame(() => {
          if (!hasWindowsContent()) renderRecoveryError();
        });
      } catch (error) {
        console.error('PC Toolkit: Windows checklist recovery failed', error);
        renderRecoveryError();
      }
    };

    script.onerror = () => {
      recoveryInFlight = false;
      renderRecoveryError();
    };

    document.body.appendChild(script);
  };

  openDialog = function guardedOpenDialog(name) {
    if (name !== 'windows-reinstall') return delegatedOpenDialog(name);

    try {
      delegatedOpenDialog(name);
    } catch (error) {
      console.error('PC Toolkit: Windows checklist open failed', error);
      recoverWindowsModule();
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!hasWindowsContent()) recoverWindowsModule();
      });
    });
  };
})();
