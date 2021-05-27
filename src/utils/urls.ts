let _currentUrl = '';

getCurrentUrl();

export function currentUrl(): string {
  return _currentUrl;
}

export function getCurrentUrl(): Promise<string> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (!!tab && tab.id !== undefined) {
        _currentUrl = tab.url || '';
        resolve(tab.url || '');
      } else {
        resolve('');
      }
    });
  });
}
