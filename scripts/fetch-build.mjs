#!/usr/bin/env node
// Скачивает production-сборку Vite-сайта (index.html + все чанки, включая lazy)
// и пытается найти source maps.
// Использование: node scripts/fetch-build.mjs <url> <outDir> [--cookie "<cookie>"] [--header "Name: value"]...
// Пример:       node scripts/fetch-build.mjs https://app.dev.uysot.uz/ demo/app/_build
// Закрытая часть (после логина):
//   COOKIE='<значение заголовка Cookie из DevTools>' \
//   node scripts/fetch-build.mjs https://app.dev.uysot.uz/main/home demo/app/_build_private --cookie "$COOKIE"
// Cookie также можно передать через переменную окружения FETCH_COOKIE.
// Требуется Node 18+ (встроенный fetch). Зависимостей нет.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const argv = process.argv.slice(2);
const positional = [];
const extraHeaders = {};
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--cookie') extraHeaders.Cookie = argv[++i];
  else if (argv[i] === '--header') { const h = argv[++i]; const k = h.indexOf(':'); extraHeaders[h.slice(0, k).trim()] = h.slice(k + 1).trim(); }
  else positional.push(argv[i]);
}
if (!extraHeaders.Cookie && process.env.FETCH_COOKIE) extraHeaders.Cookie = process.env.FETCH_COOKIE;
const [startUrl, outDir = '_build'] = positional;
if (!startUrl) { console.error('usage: node fetch-build.mjs <url> <outDir>'); process.exit(1); }

const root = new URL(startUrl);
const origin = root.origin;
const MAX_FILES = 3000;
const CONCURRENCY = 8;
const ASSET_EXT = /\.(?:m?js|css|map|json|webmanifest|svg|png|jpe?g|webp|gif|avif|ico|woff2?|ttf|otf|eot)$/i;
const TEXT_EXT = /\.(?:m?js|css|html?|json|webmanifest|map)$/i;

const seen = new Set();
const queue = [];
const saved = [];
const maps = [];
const failed = [];

function enqueue(u) {
  let url;
  try { url = new URL(u); } catch { return; }
  if (url.origin !== origin) return;
  url.hash = ''; url.search = '';
  const key = url.href;
  if (seen.has(key) || seen.size >= MAX_FILES) return;
  seen.add(key);
  queue.push(key);
}

function resolveRef(ref, fromUrl) {
  if (/^(data:|blob:|mailto:|javascript:)/.test(ref)) return null;
  if (/^https?:\/\//.test(ref)) return ref;
  if (ref.startsWith('//')) return root.protocol + ref;
  if (ref.startsWith('/')) return origin + ref;
  if (ref.startsWith('./') || ref.startsWith('../')) return new URL(ref, fromUrl).href;
  // "assets/x.js" — Vite __vitePreload пишет пути от base ("/")
  return [origin + '/' + ref, new URL(ref, fromUrl).href];
}

function extractRefs(text, fromUrl, isHtml) {
  const out = new Set();
  const add = (r) => {
    if (!r || r.length > 300 || /\s|[<>{}]/.test(r)) return;
    const res = resolveRef(r, fromUrl);
    if (!res) return;
    (Array.isArray(res) ? res : [res]).forEach((x) => out.add(x));
  };
  if (isHtml) {
    for (const m of text.matchAll(/\b(?:src|href)\s*=\s*["']([^"'#?]+)/gi)) add(m[1]);
  }
  // строковые литералы с расширениями ассетов
  for (const m of text.matchAll(/["'`]([\w@\-./]+?\.(?:m?js|css|svg|png|jpe?g|webp|gif|avif|ico|woff2?|ttf|otf|json|webmanifest))["'`]/g)) add(m[1]);
  // url(...) в CSS
  for (const m of text.matchAll(/url\(\s*["']?([^"')]+?)["']?\s*\)/g)) add(m[1].split(/[?#]/)[0]);
  // sourceMappingURL
  for (const m of text.matchAll(/[#@]\s*sourceMappingURL\s*=\s*(\S+)/g)) if (!m[1].startsWith('data:')) add(m[1]);
  return [...out].filter((u) => { try { const p = new URL(u).pathname; return ASSET_EXT.test(p) || p === '/'; } catch { return false; } });
}

function localPath(url) {
  if (url === root.href && new URL(url).pathname !== '/') return join(outDir, 'index.html');
  let p = new URL(url).pathname;
  if (p.endsWith('/')) p += 'index.html';
  return join(outDir, decodeURIComponent(p));
}

async function handle(url) {
  let res;
  try { res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36', ...extraHeaders } }); } catch (e) { failed.push([url, String(e.message || e)]); return; }
  if (!res.ok) { if (!url.endsWith('.map')) failed.push([url, res.status]); return; }
  const ct = res.headers.get('content-type') || '';
  const path = new URL(url).pathname;
  const isRootHtml = path === '/' || path.endsWith('.html') || (url === root.href && ct.includes('text/html'));
  // SPA-фолбэк: несуществующие файлы отдаются как index.html — отбрасываем
  if (!isRootHtml && ct.includes('text/html')) { if (!url.endsWith('.map')) failed.push([url, 'spa-fallback(html)']); return; }
  const buf = Buffer.from(await res.arrayBuffer());
  const file = localPath(url);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, buf);
  saved.push(url);
  if (url.endsWith('.map')) { maps.push(url); }
  if (isRootHtml || TEXT_EXT.test(path)) {
    const text = buf.toString('utf8');
    if (!url.endsWith('.map')) extractRefs(text, url, isRootHtml).forEach(enqueue);
    if (/\.(m?js|css)$/.test(path)) enqueue(url + '.map'); // пробуем карту рядом с файлом
  }
}

enqueue(root.href);
for (const p of ['/manifest.json', '/manifest.webmanifest', '/.vite/manifest.json', '/asset-manifest.json',
  '/robots.txt', '/sw.js', '/service-worker.js', '/firebase-messaging-sw.js', '/favicon.ico', '/config.js', '/env.js'])
  enqueue(origin + p);

let active = 0;
await new Promise((resolve) => {
  const pump = () => {
    if (!queue.length && !active) return resolve();
    while (active < CONCURRENCY && queue.length) {
      const u = queue.shift(); active++;
      handle(u).finally(() => { active--; if (saved.length && saved.length % 25 === 0) process.stdout.write(`\r  saved ${saved.length}, queued ${queue.length}   `); pump(); });
    }
  };
  pump();
});

await mkdir(outDir, { recursive: true });
const report = { source: root.href, withCookie: Boolean(extraHeaders.Cookie), fetchedAt: new Date().toISOString(), saved: saved.sort(), sourceMaps: maps.sort(), failed };
await writeFile(join(outDir, '_fetch-report.json'), JSON.stringify(report, null, 2));
console.log(`\nГотово: сохранено ${saved.length} файлов в ${outDir}`);
console.log(`Source maps найдено: ${maps.length}`);
maps.slice(0, 20).forEach((m) => console.log('  ' + m));
console.log(`Отчёт: ${join(outDir, '_fetch-report.json')}`);
