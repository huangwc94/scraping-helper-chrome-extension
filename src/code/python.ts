import { createCodeHeader } from '../utils/codeHeader';

export function generatePythonCode(selector: string, url: string): string {
  return `${createCodeHeader('#')}

# Install:
# pip install pyquery

from pyquery import PyQuery as pq


def get_data(selector, url):
    d = pq(url=url)
    elements = d(selector)
    for element in elements:
        ele = pq(element)
        print('text:', ele.text())
        print('href:', ele.attr('href'))
        print('src:', ele.attr('src'))


if __name__ == "__main__":
    get_data('${selector}',
             '${url}')
`;
}
