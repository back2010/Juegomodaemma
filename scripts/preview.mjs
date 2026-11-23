/**
 * Herramienta de revisión visual para agentes.
 * Uso: node scripts/preview.mjs looks.json salida.png
 *   looks.json: arreglo de DollLook (o {"allDolls":true} para ver todas las muñecas con su look por defecto)
 */
import { createServer } from 'vite';
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [, , input, outPng] = process.argv;
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const React = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { DollRenderer } = await server.ssrLoadModule('/src/art/DollRenderer.tsx');
  const { catalog } = await server.ssrLoadModule('/src/catalog/registry.ts');
  let looks = JSON.parse(fs.readFileSync(input, 'utf8'));
  if (looks.allDolls) looks = catalog.dolls.map((d) => ({ dollId: d.id, ...d.defaultLook }));
  const svgs = looks.map((l, i) => renderToStaticMarkup(React.createElement(DollRenderer, { look: l, idPrefix: 'x' + i })));
  const html = `<html><body style="margin:0;display:flex;flex-wrap:wrap;background:#fde">${svgs.map((s) => `<div style="width:360px;height:600px">${s}</div>`).join('')}</body></html>`;
  const tmp = path.resolve(outPng.replace(/\.png$/, '.html'));
  fs.writeFileSync(tmp, html);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: Math.min(4, svgs.length) * 360, height: Math.ceil(svgs.length / 4) * 600 } });
  await p.goto('file://' + tmp);
  await p.screenshot({ path: outPng });
  await b.close();
  console.log('ok', outPng);
} finally {
  await server.close();
}
