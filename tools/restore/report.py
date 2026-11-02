exec(open('emit.py').read())
import os,glob
R='out/app/'
def real(p):
    for cand in (p, p.rsplit('.',1)[0]+'.tsx', p.rsplit('.',1)[0]+'.ts'):
        if os.path.exists(R+cand): return cand
    return None
tagged=set()
for (ch,uid),p in A.items():
    if p and re.search(r'"data-sentry-source-file":"([^"]+)"',CH[ch]['units'][uid]['code']): tagged.add(p)
info={}
for p,us in FILES.items():
    rp=real(p); 
    if not rp: continue
    chunks=collections.Counter(ch for ch,_ in us)
    info[rp]=dict(exact=p in tagged, chunks=dict(chunks), units=len(us), size=sum(len(CH[ch]['units'][uid]['code']) for ch,uid in us))
# маркеры
for rp,i in info.items():
    f=R+rp; s=open(f).read()
    if s.startswith('// [restore]'): continue
    hdr=('// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.\n' if i['exact']
         else '// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).\n')
    hdr+='// [restore] Источник: '+', '.join(f'{c} ({n})' for c,n in i['chunks'].items())+'\n'
    open(f,'w').write(hdr+s)
for css in glob.glob(R+'src/**/*.module.css',recursive=True):
    pass
import json; json.dump(info,open('fileinfo.json','w'),indent=1,ensure_ascii=False)
print(len(info),'files;',sum(i['exact'] for i in info.values()),'exact paths')
