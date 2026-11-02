import json,re,glob,os
CH={}  # chunk -> {'U':units,'D':data}
for f in glob.glob('U_*.json'):
    b=f[2:-5]; b='index-B0UwuSD7' if b=='main' else b
    D=json.load(open(f)); CH[b]=D
    D['by']={}
    for u in D['units']:
        for n in u['names']: D['by'][n]=u
MAIN='index-B0UwuSD7'
def rng(*rs):
    s=set()
    for a,b in rs: s|=set(range(a,b+1))
    return s
# lib stmt ranges (si) for main; lib unit-id ranges for lazy chunks
LIB={
 MAIN: dict(si=rng((6,7),(29,811),(853,876),(882,892),(894,900),(904,929),(933,933),(1110,1112),(1116,1148),(1205,1482),(1517,1517),(1523,1540),(1550,1567),(1569,1579),(1581,1582)),
            names={'JF','ir','Z_','nH','iH','eb','oH','zH','D3','Hl','MP','z3','Ane','__vite__mapDeps','NI','kI','Yv','Nt'}),
 'QrCode-CXeqeBv0': dict(uid=rng((0,35))),
 'telegram-login-CUVBmqvA': dict(uid=rng((2,36))),
 'ScheduleLottotron-BRWX7mEZ': dict(uid=rng((0,682))),
 'sms-login-C3nOBmnF': dict(uid=rng((0,153),(160,199))),
 'index-Ct6jfUeP': dict(all=True), 'index-Cvx5Xo9o': dict(all=True), 'index-DnhTvTv2': dict(all=True),
 'index-DJQj0frt': dict(all=True), 'firebase-DBDQKvII': dict(uid=rng((0,334))),
}
# в main стейтмент 37 смешанный: clsx/tailwind-merge + css-модуль Loading + cn()
def is_lib(ch,u):
    L=LIB.get(ch)
    if not L: return u['names'][:1]==['__vite__mapDeps']
    if L.get('all'): return True
    if 'names' in L and any(n in L['names'] for n in u['names']): return True
    if 'si' in L and u['si'] in L['si']:
        if u['si']==37 and u['names'] and u['names'][0] in ('wA','Wl','PA','IA','AA','TA','RA','OA','NA','xn'):
            return False
        return True
    if 'uid' in L and u['id'] in L['uid']: return True
    return False
for ch,D in CH.items():
    for u in D['units']: u['lib']=is_lib(ch,u)
