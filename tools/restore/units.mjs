// Разбивает ESM-бандл на "юниты" (отдельные декларации/выражения) и строит граф ссылок.
import * as acorn from 'acorn'; import * as walk from 'acorn-walk'; import fs from 'fs';
const [,,f,out]=process.argv; const src=fs.readFileSync(f,'utf8');
const ast=acorn.parse(src,{ecmaVersion:'latest',sourceType:'module'});
const units=[]; const def=new Map(); const imports={}; const exportsMap={};
function patNames(p,a=[]){ if(!p)return a; if(p.type==='Identifier')a.push(p.name); else if(p.type==='ObjectPattern')p.properties.forEach(q=>patNames(q.value||q.argument,a)); else if(p.type==='ArrayPattern')p.elements.forEach(e=>patNames(e,a)); else if(p.type==='AssignmentPattern')patNames(p.left,a); else if(p.type==='RestElement')patNames(p.argument,a); return a;}
ast.body.forEach((n,si)=>{
  if(n.type==='ImportDeclaration'){ for(const s of n.specifiers){imports[s.local.name]={from:n.source.value,name:s.type==='ImportDefaultSpecifier'?'default':s.type==='ImportNamespaceSpecifier'?'*':s.imported.name}; def.set(s.local.name,-1);} return; }
  if(n.type==='ExportNamedDeclaration'){ for(const s of n.specifiers) exportsMap[s.exported.name]=s.local.name; return; }
  if(n.type==='VariableDeclaration'){ for(const d of n.declarations){ const u={id:units.length,si,kind:n.kind,node:d,start:d.start,end:d.end,names:patNames(d.id)}; units.push(u); u.names.forEach(x=>def.set(x,u.id)); } return; }
  const u={id:units.length,si,kind:n.type,node:n,start:n.start,end:n.end,names:(n.id&&n.id.name)?[n.id.name]:[]}; units.push(u); u.names.forEach(x=>def.set(x,u.id));
});
for(const u of units){
  const refs=new Set(), assigns=new Set();
  walk.fullAncestor(u.node,(x,st,anc)=>{
    if(x.type!=='Identifier'||!def.has(x.name))return;
    const p=anc[anc.length-2];
    if(p&&((p.type==='MemberExpression'&&p.property===x&&!p.computed)||(p.type==='Property'&&p.key===x&&!p.computed&&!p.shorthand)||((p.type==='MethodDefinition'||p.type==='PropertyDefinition')&&p.key===x&&!p.computed)))return;
    if(u.names.includes(x.name))return;
    refs.add(x.name);
    if(p&&p.type==='AssignmentExpression'&&p.left===x) assigns.add(x.name);
    if(p&&p.type==='UpdateExpression') assigns.add(x.name);
  });
  u.refs=[...refs]; u.assigns=[...assigns];
  u.code=src.slice(u.start,u.end);
  delete u.node;
}
fs.writeFileSync(out,JSON.stringify({imports,exports:exportsMap,def:Object.fromEntries(def),units}));
console.log(f,'units',units.length);
