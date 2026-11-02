cd /home/claude/work/out/app
fail=0
for f in $(find src -name '*.ts' -o -name '*.tsx'); do
  case $f in src/utils/interop.ts|src/i18n/t.ts) continue;; esac
  if npx wakaru "$f" --level standard -o "$f.tmp" --force >/dev/null 2>/tmp/wk.err; then mv "$f.tmp" "$f"; else echo "WAKARU FAIL $f"; rm -f "$f.tmp"; fail=$((fail+1)); fi
done
echo "wakaru fails: $fail"
# .ts с JSX -> .tsx
for f in $(find src -name '*.ts'); do if grep -qE '<[A-Za-z][A-Za-z0-9.]*[ />]|</[A-Za-z]' "$f" && grep -qE 'return \(|=> \(\s*$|<>|<\/' "$f"; then git mv 2>/dev/null; mv "$f" "${f%.ts}.tsx"; echo "renamed $f"; fi; done
npx prettier --log-level warn --write "src/**/*.{ts,tsx}" "src/**/*.module.css" "src/styles/chunks/*.css" --print-width 100 2>&1 | tail -5
