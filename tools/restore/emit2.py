exec(open('emit.py').read())
ORDER={ch:i for i,ch in enumerate([MAIN]+sorted(c for c in CH if c!=MAIN))}
def chunk_entry_file(ch):
    if ch in DYN_LIB: return DYN_LIB[ch]
    ex=CH[ch]['exports']
    l=ex.get('default') or next(iter(ex.values()))
    r=resolve_local(ch,l)
    return '@/'+r[1][4:].rsplit('.',1)[0] if r[0]=='app' else None
PRELOAD={}
for ch,D in CH.items():
    al={k for k,v in D['imports'].items() if v['from'].endswith('index-B0UwuSD7.js') and v['name']=='_'}
    if ch==MAIN: al.add('Nt')
    PRELOAD[ch]=al
def unwrap_preload(code,al):
    out=[];i=0
    while True:
        best=None
        for a in al:
            mm=[m for m in re.finditer(re.escape(a)+r'\((?:async)?\(\)=>',code[i:]) if not (i+m.start()>0 and (code[i+m.start()-1].isalnum() or code[i+m.start()-1] in '_$.'))]
            j=i+mm[0].start() if mm else -1
            if j!=-1 and (best is None or j<best[0]): best=(j,a)
        if not best: out.append(code[i:]); break
        j,a=best; out.append(code[i:j]); k=j+len(a)+1; depth=1; q=None; last_comma=None; p=k
        while p<len(code) and depth:
            c=code[p]
            if q:
                if c=='\\': p+=1
                elif c==q: q=None
            elif c in '"\'`': q=c
            elif c in '([{': depth+=1
            elif c in ')]}':
                depth-=1
            elif c==',' and depth==1: last_comma=p
            p+=1
        inner=code[k:(last_comma if last_comma else p-1)]
        if inner.startswith('async()=>'): out.append('('+inner+')()')
        else:
            assert inner.startswith('()=>'), inner[:40]
            out.append(inner[4:])
        i=p
    return ''.join(out)
def rewrite(ch,code):
    code=re.sub(r'import\("\./([^"]+?)\.js"\)',lambda m: f'import("{chunk_entry_file(m.group(1))}")',code)
    al=PRELOAD[ch]
    if al: code=unwrap_preload(code,al)
    code=re.sub(r'import\("@sentry/react"\)\.then\((\w)=>\1\.S\)','import("@sentry/react")',code)
    return code
REAL=lambda n: n=='default' or (len(n)>2 and re.fullmatch(r'[A-Za-z_]\w*',n) and not re.fullmatch(r'[a-z][A-Z]?\d?',n))
exports_needed=collections.defaultdict(set)  # file -> names
imports_by_file={}
problems=[]
for p,us in FILES.items():
    defined={(ch,n) for ch,uid in us for n in CH[ch]['units'][uid]['names']}
    imps=collections.OrderedDict()
    for ch,uid in us:
        u=CH[ch]['units'][uid]
        for r in u['refs']:
            if (ch,r) in defined: continue
            res=resolve_local(ch,r)
            if res[0]=='drop': continue
            if res[0]=='unmapped':
                if r=='__vite__mapDeps': continue
                problems.append((p,r,res)); continue
            if res[0]=='app':
                _,f,l,ch2=res
                if f==p and ch2==ch: continue
                exports_needed[f].add(l)
                imps.setdefault(('@/'+f[4:].rsplit('.',1)[0],'named'),[]).append((l,r))
            elif res[0]=='css':
                imps.setdefault(('@/'+res[1][4:],'default'),[]).append(('default',r))
            else:
                _,mod,imp=res
                kind='ns' if imp=='*' else 'default' if imp=='default' else 'named'
                imps.setdefault((mod,kind if kind!='named' else 'named'),[]).append((imp,r))
    for ch,uid in us:
        for e,l in CH[ch]['exports'].items():
            if l in CH[ch]['units'][uid]['names'] and REAL(e): exports_needed[p].add(('REAL',e,l))
    imports_by_file[p]=imps
print('problems',problems[:10])
shutil.rmtree(OUT+'/src',ignore_errors=True)
for p,us in FILES.items():
    us=sorted(us,key=lambda k:(ORDER[k[0]],k[1]))
    imps=imports_by_file[p]; lines=[]
    seen_local=set()
    for (mod,kind),pairs in imps.items():
        uniq=[]
        for imp,loc in pairs:
            if loc in seen_local: continue
            seen_local.add(loc); uniq.append((imp,loc))
        if not uniq: continue
        if kind=='ns':
            for imp,loc in uniq: lines.append(f'import * as {loc} from "{mod}";')
        elif kind=='default':
            for imp,loc in uniq: lines.append(f'import {loc} from "{mod}";')
        else:
            spec=', '.join(imp if imp==loc else f'{imp} as {loc}' for imp,loc in uniq)
            lines.append(f'import {{ {spec} }} from "{mod}";')
    body=[]
    for ch,uid in us:
        u=CH[ch]['units'][uid]; c=rewrite(ch,u['code'])
        if u['kind'] in ('const','let','var'): body.append(f"{u['kind']} {c};")
        else: body.append(c if c.endswith(('}',';')) else c+';')
    names_here={n for ch,uid in us for n in CH[ch]['units'][uid]['names']}
    exp=[]; reals=[]
    for x in exports_needed.get(p,()):
        if isinstance(x,tuple): reals.append(x)
        elif x in names_here: exp.append(x)
    tail=[]
    if exp: tail.append('export { '+', '.join(sorted(set(exp)))+' };')
    for _,e,l in sorted(reals):
        tail.append(f'export default {l};' if e=='default' else f'export {{ {l} as {e} }};')
    fp=os.path.join(OUT,p); os.makedirs(os.path.dirname(fp),exist_ok=True)
    open(fp,'w').write('\n'.join(lines)+'\n\n'+'\n'.join(body)+'\n\n'+'\n'.join(tail)+'\n')
print('written',len(FILES))
# коллизии имён
for p,us in FILES.items():
    names=[n for ch,uid in us for n in CH[ch]['units'][uid]['names']]
    if len(names)!=len(set(names)): print('COLLISION',p,[n for n in set(names) if names.count(n)>1])
