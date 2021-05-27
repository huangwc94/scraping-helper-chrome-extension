import { createCodeHeader } from '../utils/codeHeader';

export function generateNodejsCode(selector: string, url: string): string {
  return `${createCodeHeader('//')}

// Install:
// npm install axios
// npm install node-html-parser

const axios = require('axios');
const { parse } = require('node-html-parser');

async function getData(selector, url) {
  const response = await axios.get(url);
  const root = parse(response.data);
  const elements = root.querySelectorAll(selector);
  elements.forEach((element) => {
    console.log('text', element.text);
    console.log('src', element.getAttribute('src'));
    console.log('href', element.getAttribute('href'));
  });
}

getData('${selector}', '${url}');

`;
}
