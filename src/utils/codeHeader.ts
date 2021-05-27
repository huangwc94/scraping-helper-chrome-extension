export function createCodeHeader(commentSymbol: string): string {
  const notes = chrome.i18n.getMessage('codeHeader').split('|');
  const header = notes.map((n) => commentSymbol + ' ' + n);

  return header.join('\n');
}
