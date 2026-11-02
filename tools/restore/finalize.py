exec(open('emit2.py').read())
import glob,shutil,subprocess
R='out/app/'
# 1) кто кого импортирует
imported=set()
for p in FILES:
    src=open(R+p).read()
    for m in re.finditer(r'(?:from |import\()"(@/[^"]+)"',src): imported.add(m.group(1))
def mod(p): return '@/'+p[4:].rsplit('.',1)[0]
first_si={}
for p,us in FILES.items():
    sis=[CH[ch]['units'][uid].get('si',10**6)+ (0 if ch==MAIN else 10**5) for ch,uid in us]
    first_si[p]=min(sis)
side=[p for p in FILES if mod(p) not in imported and p!='src/main.tsx']
side.sort(key=lambda p:first_si[p])
print('side-effect modules:',side)
mainp=R+'src/main.tsx'; s=open(mainp).read()
hdr='\n'.join(f'import "{mod(p)}";' for p in side)
s='import "@/styles/global.compiled.css";\n'+hdr+'\n'+s
open(mainp,'w').write(s)
# 2) dayjs плагины (были в lib-части бандла)
d=open(R+'src/utils/dayjs.ts').read()
d=d.replace('be.extend(JF);','be.extend(JF);\n// порядок из бандла\nbe.extend(timezone);\nbe.extend(utc);')
d='import timezone from "dayjs/plugin/timezone";\nimport utc from "dayjs/plugin/utc";\n'+d
open(R+'src/utils/dayjs.ts','w').write(d)
# 3) CSS чанков
os.makedirs(R+'src/styles/chunks',exist_ok=True)
def add_import(p,line):
    f=R+p; s=open(f).read(); open(f,'w').write(line+'\n'+s)
add_import('src/modules/auth/components/sms-login/sms-phone-step.tsx','import "react-international-phone/style.css";')
# 4) хелперы
open(R+'src/utils/interop.ts','w').write('// Аналог rollup-хелпера getDefaultExportFromCjs\nexport const getDefaultExportFromCjs = (x: any) =>\n  x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x;\n')
os.makedirs(R+'src/i18n',exist_ok=True)
open(R+'src/i18n/t.ts','w').write('import i18next from "i18next";\n\n// В бандле: `const t = i18next.t` (экспорт vendor-i18n)\nexport const t = i18next.t;\n')
