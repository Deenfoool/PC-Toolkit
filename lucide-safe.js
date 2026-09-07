(() => {
  const lucideApi = window.lucide;
  if (!lucideApi?.createIcons || lucideApi.__pcToolkitSafeCreateIcons) return;

  const originalCreateIcons = lucideApi.createIcons.bind(lucideApi);

  lucideApi.createIcons = function safeCreateIcons(options) {
    try {
      return originalCreateIcons(options);
    } catch (error) {
      console.warn('PC Toolkit: Lucide icon rendering skipped after an icon error', error);
      return null;
    }
  };

  lucideApi.__pcToolkitSafeCreateIcons = true;
})();
