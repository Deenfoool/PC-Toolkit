(() => {
  translations.en['cat.windows'] = 'Windows';
  translations.ru['cat.windows'] = 'Windows';

  Object.assign(toolText.en, {
    windows: {
      title: 'Windows Reinstall Checklist',
      desc: 'A guided post-install checklist with drivers, activation checks, account commands and a Winget app builder.',
      tag: 'Windows'
    }
  });

  Object.assign(toolText.ru, {
    windows: {
      title: 'Памятка после переустановки Windows',
      desc: 'Пошаговый чеклист после установки: драйверы, настройка Windows, команды для локальной учётки и сборщик Winget.',
      tag: 'Windows'
    }
  });

  if (!categories.includes('windows')) categories.push('windows');
  if (!tools.some(tool => tool.id === 'windows-reinstall')) {
    tools.push({
      id: 'windows-reinstall',
      key: 'windows',
      category: 'windows',
      icon: '<i data-lucide="laptop" aria-hidden="true"></i>',
      featured: true
    });
  }

  renderFilters();
  renderToolCards();
  window.lucide?.createIcons?.({attrs: {'stroke-width': 1.8}});
})();
