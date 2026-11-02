exec(open('assign.py').read()); exec(open('maps.py').read())
import os,posixpath,shutil
OUT='out/app'; 
CSSMOD={}  # (ch,uid) -> css path
CSSSTR=set()
pat_cls=re.compile(r'"(_[A-Za-z][\w-]*?_([a-z0-9]{5})_\d+)"')
for ch,D in CH.items():
    if SKIPCH(ch): continue
    for u in D['units']:
        if u['lib']: continue
        if re.fullmatch(r'[\w$]+="_[A-Za-z][\w-]*?_[a-z0-9]{5}_\d+"',u['code']): CSSSTR.add((ch,u['id'])); continue
for ch,D in CH.items():
    if SKIPCH(ch): continue
    for u in D['units']:
        if u['lib'] or not u['names']: continue
        m=re.fullmatch(r'[\w$]+=\{([^{}]*)\}',u['code'])
        if not m or not u['refs']: continue
        if all((ch,D['by'][r]['id']) in CSSSTR for r in u['refs'] if r in D['by']) and all(r in D['by'] for r in u['refs']):
            f=A.get((ch,u['id'])) or 'src/pages/login/Login.tsx'
            base=posixpath.splitext(f)[0]
            CSSMOD[(ch,u['id'])]=base+'.module.css'
            u['css_hash']=re.search(r'_([a-z0-9]{5})_\d+"$',CH[ch]['by'][u['refs'][0]]['code']).group(1)
# Login css shared
for (ch,uid),p in list(CSSMOD.items()):
    if CH[ch]['units'][uid]['names']==['Ft']: CSSMOD[(ch,uid)]='src/pages/login/Login.module.css'
# прочие хвосты
A[(MAIN,CH[MAIN]['by']['WH']['id']-0)]=A.get((MAIN,CH[MAIN]['by']['WH']['id']),'')
for u in CH[MAIN]['units']:
    if u['code'].startswith('be.extend(JF)'): A[(MAIN,u['id'])]='src/utils/dayjs.ts'
# файлы -> юниты
FILES=collections.defaultdict(list)
for (ch,uid),p in A.items():
    if not p or (ch,uid) in CSSSTR or (ch,uid) in CSSMOD: continue
    FILES[p].append((ch,uid))
# где определено имя (ch,name) -> file
def file_of(ch,name):
    u=CH[ch]['by'].get(name)
    if not u: return None
    k=(ch,u['id'])
    if k in CSSMOD: return ('css',CSSMOD[k])
    return ('js',A.get(k))
def short(ch): return re.sub(r'-[A-Za-z0-9_]{8}$','',ch)
def resolve_import(ch,local):
    """-> ('app',file,name) | ('lib',module,imported) | ('css',path) | ('drop',)"""
    im=CH[ch]['imports'].get(local)
    if im:
        src=im['from'].split('/')[-1][:-3]; name=im['name']
        if src.startswith('vendor-') or src in ('index-Ct6jfUeP','index-DnhTvTv2','index-Cvx5Xo9o'):
            key=(short(src) if src.startswith('vendor-') else src,name)
            if key in VENDOR: return ('lib',)+VENDOR[key]
            return ('unmapped',src,name)
        T=CH[src]; l=T['exports'].get(name,name)
        return resolve_local(src,l)
    return resolve_local(ch,local)
def resolve_local(ch,l):
    D=CH[ch]
    if l in D['imports']: return resolve_import(ch,l)
    u=D['by'].get(l)
    if u is None: return ('unmapped',ch,l)
    if u['lib']:
        if (ch,l) in LIBMAP: return ('lib',)+LIBMAP[(ch,l)]
        if ch==MAIN and l in ('Nt','__vite__mapDeps'): return ('drop',)
        return ('unmapped',ch,l)
    k=(ch,u['id'])
    if k in CSSMOD: return ('css',CSSMOD[k])
    if not A.get(k): return ('unmapped',ch,l)
    return ('app',A[k],l,ch)
