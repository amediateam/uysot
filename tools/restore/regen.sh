set -e
cd /home/claude/work
python3 finalize.py | tail -1
node css.mjs >/dev/null
node -e "
const postcss=require('postcss'),fs=require('fs');fs.mkdirSync('out/app/src/styles/chunks',{recursive:true});
for(const [f,o] of [['ScheduleLottotron-CX0GiYE2','schedule-lottotron'],['index-DJ6xIFJd','payment-qr-code']]){
 const r=postcss.parse(fs.readFileSync('src_assets/'+f+'.css','utf8'));const keep=[];r.walkRules(x=>{if(!/_[a-z0-9]{5}_\d+/.test(x.selector))keep.push(x.toString())});
 fs.writeFileSync('out/app/src/styles/chunks/'+o+'.css','/* глобальные правила из CSS-чанка '+f+' */\n'+keep.join('\n')+'\n');}"
sed -i '1i import "@/styles/chunks/schedule-lottotron.css";' out/app/src/pages/schedule-lottotron/ScheduleLottotron.tsx
sed -i '1i import "@/styles/chunks/payment-qr-code.css";' out/app/src/pages/payment-qr-code/index.tsx
sed -i 's/const tF={VITE_RECAPTCHA_SITE_KEY:"6LdTjhksAAAAAE4cXBV6_4TDIVX2nMMisuINNa7Y"};/const tF=import.meta.env;/' out/app/src/pages/login/Login.tsx
