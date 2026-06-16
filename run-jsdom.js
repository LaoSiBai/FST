import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync(path.resolve('./dist/index.html'), 'utf8');

const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true
});

dom.window.addEventListener('error', event => {
  console.error('JSDOM Error:', event.error);
});

dom.window.addEventListener('unhandledrejection', event => {
  console.error('JSDOM Promise Rejection:', event.reason);
});

setTimeout(() => {
  console.log('App HTML after 2 seconds:', dom.window.document.body.innerHTML.substring(0, 500));
  process.exit(0);
}, 2000);
