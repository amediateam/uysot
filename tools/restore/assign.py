exec(open('cfg.py').read())
import collections
SKIPCH=lambda ch: ch.startswith('vendor-') or LIB.get(ch,{}).get('all')
# v1 в sms-login — список стран приложения (стоит до кода библиотеки)
for u in CH['sms-login-C3nOBmnF']['units']:
    if u['names']==['v1']: u['lib']=False
A={}  # (ch,uid)->path
def setp(ch,u,p):
    A[(ch,u['id'])]=p
# 1) теги Sentry
for ch,D in CH.items():
    if SKIPCH(ch): continue
    for u in D['units']:
        if u['lib']: continue
        m=re.search(r'"data-sentry-source-file":"([^"]+)"',u['code'])
        if m: setp(ch,u,'src/'+m.group(1))
# 2) ручная карта для main по стейтментам
MAIN_SI=[((8,11),'src/bootstrap/polyfills.ts'),((12,12),'src/constants/storage-keys.ts'),((13,28),'src/i18n/index.ts'),
 ((813,818),'src/services/sentry.ts'),((819,835),'src/bootstrap/chunk-recovery.ts'),
 ((838,845),'src/components/toaster/state.ts'),((847,848),'src/components/toaster/index.tsx'),
 ((850,851),'src/constants/index.ts'),((852,852),'src/constants/permissions.ts'),
 ((878,878),'src/constants/routes.ts'),((879,879),'src/utils/redirect-after-login.ts'),((880,881),'src/utils/recaptcha.ts'),
 ((931,931),'src/utils/random-string.ts'),((934,939),'src/utils/error-handler.ts'),((940,941),'src/utils/jwt.ts'),((942,942),'src/utils/logout.ts'),
 ((943,943),'src/services/sentry-scrub.ts'),((944,945),'src/store/store-registry.ts'),((946,1099),'src/services/api/endpoints.ts'),
 ((1100,1100),'src/store/reducers/desktopAgentReducer.ts'),((1101,1108),'src/modules/desktop-agent/errors.ts'),
 ((1172,1179),'src/services/verto/index.ts'),((1180,1180),'src/store/index.ts'),((1181,1199),'src/services/desktop-agent.ts'),
 ((1200,1204),'src/services/fcm-auth-cache.ts'),((1483,1503),'src/services/api/client.ts'),((1504,1506),'src/modules/active-session/api.ts'),
 ((1512,1512),'src/modules/auth/hooks/use-recaptcha.ts'),((1513,1513),'src/modules/auth/login-broadcast.ts'),((1514,1515),'src/modules/auth/hooks/use-sign-in.ts'),
 ((1516,1518),'src/modules/theme/theme-store.ts'),((1543,1543),'src/pages/login/constants.ts'),((1545,1546),'src/pages/login/hooks/use-desktop-agent-check.ts'),
 ((1547,1547),'src/pages/login/Login.tsx'),((1580,1580),'src/apps/open.tsx'),((1583,1589),'src/apps/open.tsx'),((1590,1596),'src/main.tsx')]
for u in CH[MAIN]['units']:
    if u['lib'] or (MAIN,u['id']) in A: continue
    for (a,b),p in MAIN_SI:
        if a<=u['si']<=b: setp(MAIN,u,p); break
# слайсы redux: Se({name:"X"}) -> store/reducers/X.ts
for u in CH[MAIN]['units']:
    if u['lib'] or (MAIN,u['id']) in A: continue
    m=re.search(r'^\w+=Se\(\{(?:[^{}]|\{[^{}]*\})*?name:"([^"]+)"',u['code'])
    if m: setp(MAIN,u,f'src/store/reducers/{m.group(1)}.ts')
MAN_NAMES={(MAIN,'ZL'):'src/store/hooks.ts',(MAIN,'eF'):'src/store/hooks.ts',(MAIN,'ce'):'src/utils/storage.ts',(MAIN,'Tt'):'src/utils/current-user.ts',(MAIN,'Wl'):'src/utils/cn.ts',(MAIN,'wA'):'src/utils/cn.ts',
 (MAIN,'vt'):'src/utils/helpers.ts',(MAIN,'Ot'):'src/constants/routes.ts',(MAIN,'jr'):'src/constants/routes.ts',
 ('sms-login-C3nOBmnF','v1'):'src/constants/countries.ts'}
for (ch,n),p in MAN_NAMES.items():
    u=CH[ch]['by'][n]; setp(ch,u,p)
# 3) распространение: единственный файл-потребитель
def users_map():
    us=collections.defaultdict(set)
    for ch,D in CH.items():
        if SKIPCH(ch): continue
        for u in D['units']:
            if u['lib']: continue
            for r in u['refs']:
                t=D['by'].get(r)
                if t and not t['lib']: us[(ch,t['id'])].add((ch,u['id']))
    return us
US=users_map()
changed=True
while changed:
    changed=False
    for ch,D in CH.items():
        if SKIPCH(ch): continue
        for u in D['units']:
            k=(ch,u['id'])
            if u['lib'] or k in A: continue
            fs={A.get(x) for x in US[k]}
            if len(fs)==1 and None not in fs: A[k]=fs.pop(); changed=True
# ---- доп. правила ----
# фикс: слайсы с $ в имени
for u in CH[MAIN]['units']:
    if u['lib'] or (MAIN,u['id']) in A: continue
    m=re.search(r'^[\w$]+=Se\(\{(?:[^{}]|\{[^{}]*\})*?name:"([^"]+)"',u['code'])
    if m: setp(MAIN,u,f'src/store/reducers/{m.group(1)}.ts')
MAN2={
 MAIN:{'a0':'src/utils/round.ts','W':'src/utils/round.ts','Hn':'src/constants/client-type.ts','Oe':'src/utils/contract-calc.ts','c1':'src/utils/contract-calc.ts','oe':'src/utils/contract-calc.ts',
       'ha':'src/utils/payment-schedule.ts','Yc':'src/utils/payment-schedule.ts','Hr':'src/utils/payment-schedule.ts','b8':'src/store/reducers/crmField.ts','S8':'src/store/reducers/crmField.ts',
       'Gc':'src/services/analytics.ts','hq':'src/services/analytics.ts','i0':'src/services/analytics.ts'},
 'RestorePassword-D4Gkow_N':{'re':'src/components/restorePassword/api.ts'},
 'sms-login-C3nOBmnF':{'sd':'src/modules/auth/components/sms-login/api.ts'},
 'company-select-step-Cjab7zDr':{'b':'src/modules/auth/utils/auth-errors.ts','ee':'src/modules/auth/utils/auth-errors.ts','te':'src/modules/auth/utils/auth-errors.ts'},
 'ScheduleLottotron-BRWX7mEZ':{'Xp':'src/global/table/Table.tsx','Xs':'src/global/table/Table.tsx'},
 'webPushSession-CGnGvNL1':{'p':'src/services/web-push-session.ts'},
 'dynamic-translate-keys-DjuepjZu':{'a':'src/constants/dynamic-translate-keys.ts'},
}
for ch,m in MAN2.items():
    for n,p in m.items(): setp(ch,CH[ch]['by'][n],p)
WHOLE={'firebase-DBDQKvII':'src/services/firebase.ts','shell-init-BgJqmgkc':'src/bootstrap/shell-init.ts','constants-ChKi1eDp':'src/pages/qr-code/constants.tsx'}
for ch,p in WHOLE.items():
    for u in CH[ch]['units']:
        if not u['lib'] and (ch,u['id']) not in A: setp(ch,u,p)
for u in CH['bg_new-yiMPkYGx']['units']:
    if not u['lib'] and (('bg_new-yiMPkYGx',u['id']) not in A) and 1<=u['id']<=38: setp('bg_new-yiMPkYGx',u,'src/utils/password-policy.ts')
# ассеты "/assets/x.png" -> src/assets/index.ts
for ch,D in CH.items():
    if SKIPCH(ch): continue
    for u in D['units']:
        if not u['lib'] and re.fullmatch(r'[\w$]+="/assets/[^"]+"',u['code']): setp(ch,u,'src/assets/index.ts')
def follow():
    ch_=True
    while ch_:
        ch_=False
        for ch,D in CH.items():
            if SKIPCH(ch): continue
            for u in D['units']:
                k=(ch,u['id'])
                if u['lib'] or k in A: continue
                fs={A.get(x) for x in US[k]}
                if len(fs)==1 and None not in fs: A[k]=fs.pop(); ch_=True; continue
                c=u['code']
                m=re.fullmatch(r'[\w$]+=[\w$]+\(([\w$]+)\)',c) or re.match(r'\{.*\}=([\w$]+)\.actions$',c) or re.match(r'^([\w$]+)\.[\w$]+=',c)
                tgt=None
                if m: tgt=D['by'].get(m.group(1))
                elif not US[k]:
                    for r in u['refs']:
                        t=D['by'].get(r)
                        if t and not t['lib'] and (ch,t['id']) in A: tgt=t; break
                if tgt is not None and (ch,tgt['id']) in A: A[k]=A[(ch,tgt['id'])]; ch_=True
follow()
