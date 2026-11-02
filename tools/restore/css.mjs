import postcss from 'postcss'; import fs from 'fs'; import path from 'path';
const mods=JSON.parse(fs.readFileSync('cssmods.json'));
const cssFiles=fs.readdirSync('src_assets').filter(f=>f.endsWith('.css')).map(f=>'src_assets/'+f);
const roots=cssFiles.map(f=>({f,root:postcss.parse(fs.readFileSync(f,'utf8'))}));
const byHash={}; for(const m of mods){ (byHash[m.hash] ||= new Set()).add(m.path); }
const anyHash=new RegExp(`_([A-Za-z][\\w-]*?)_(${Object.keys(byHash).join('|')})_\\d+`,'g');
const out={}; 
for(const {f,root} of roots){
  root.walkRules(rule=>{
    if(rule.parent.type==='atrule' && /keyframes/.test(rule.parent.name)) return;
    const hs=[...rule.selector.matchAll(anyHash)].map(m=>m[2]);
    if(!hs.length) return;
    const h=hs[0];
    // клонируем с обёртками @media
    let node=rule.clone(); let p=rule.parent;
    while(p && p.type==='atrule'){ const w=p.clone({nodes:[]}); w.append(node); node=w; p=p.parent; }
    (out[h] ||= []).push(node.toString());
    rule.remove();
  });
  root.walkAtRules(/keyframes/,at=>{ const m=at.params.match(anyHash); if(m){ const h=at.params.match(new RegExp(`_(${Object.keys(byHash).join('|')})_`))[1]; (out[h] ||= []).push(at.toString()); at.remove(); }});
}
const fix=s=>s.replace(anyHash,'$1');
let n=0;
for(const [h,paths] of Object.entries(byHash)) for(const p of paths){
  const fp='out/app/'+p; fs.mkdirSync(path.dirname(fp),{recursive:true});
  const css=(out[h]||[]).map(fix).join('\n\n');
  fs.writeFileSync(fp, css? '/* восстановлено из production CSS (хэш '+h+') */\n'+css+'\n' : '/* TODO: inferred from build — правила не найдены */\n'); n++;
}
// остаток глобального CSS
fs.mkdirSync('out/app/src/styles',{recursive:true});
for(const {f,root} of roots){
  const b=path.basename(f);
  if(b.startsWith('index-BC9kvrQ3')) fs.writeFileSync('out/app/src/styles/global.compiled.css','/* TODO: inferred from build — скомпилированный глобальный CSS (tailwind + antd + глобальные стили). */\n'+root.toString());
  else { const rest=root.toString().trim(); if(rest) console.log('rest in',b,rest.length); }
}
console.log('css modules',n);
