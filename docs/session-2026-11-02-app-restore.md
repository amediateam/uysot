# Сессия 2026-11-02: восстановление `app.dev.uysot.uz` (demo/app)

Журнал работы с Claude: что сделано, что выяснилось, как воспроизвести и что осталось.
Подробный технический отчёт по коду — [`demo/app/RECONSTRUCTION.md`](../demo/app/RECONSTRUCTION.md).

## 1. Разбор репозитория

- В репозитории были только `CLAUDE.md` и пять заданий `demo/<name>/task.md` (admin, ads, app, boss, showroom): восстановить исходники фронтенда из production-сборки в React + Vite.
- Команда `claude --permission-mode bypassPermissions` запускает Claude Code без запросов разрешений (аналог `--dangerously-skip-permissions`): агент сам выполняет любые команды и правки. Удобно для длинных задач, но запускать лучше в изолированной среде или в чистом git-репозитории. Более безопасная альтернатива — `--permission-mode acceptEdits`.

## 2. Скачивание сборки

- Из облачной сессии Claude домен `*.uysot.uz` был недоступен, поэтому написан скрипт **`scripts/fetch-build.mjs`** (Node 18+, без зависимостей): скачивает `index.html`, все чанки (включая lazy), CSS, ассеты и проверяет наличие `.map` рядом с каждым файлом. Поддерживает `--cookie` / `FETCH_COOKIE` для закрытой части.
- Запуск: `node scripts/fetch-build.mjs https://app.dev.uysot.uz/ demo/app/_build` → 102 файла, **source maps не найдены**.

## 3. Главные находки

- **Стек:** React 18.3.1 + Vite + TypeScript (SPA, **не Next.js**), React Router 6, Redux Toolkit 1.9 + redux-persist, react-query 3, antd 4, axios, i18next + Tolgee, Sentry 8, PostHog, Amplitude, Firebase 11, Vercel.
- **Скачанная сборка — только публичная часть** (`apps/open.tsx`): вход, восстановление пароля, QR и т.п. Основное приложение (`/main/*`, CRM) собрано отдельным входом (`/assets/app-*.js`) и отдаётся Vercel-middleware только авторизованным пользователям; публичная часть на остальных путях делает `ReloadToAppShell` (полная перезагрузка).
- В бандле остались атрибуты Sentry **`data-sentry-source-file`** → настоящие пути исходных файлов (71 файл восстановлен с точным путём).
- Сборка использует Sentry Vite-плагин → **source maps, вероятно, загружены в Sentry** (DSN-проект `4508646119702609`). Это лучший путь получить исходники основного приложения дословно.

## 4. Восстановление публичной части → `demo/app`

Конвейер (`tools/restore/`):
1. Бандл разобран на отдельные декларации с графом ссылок (`units.mjs`).
2. Код приложения отделён от встроенных библиотек; обращения к ним заменены npm-импортами (`maps.py`): antd, dayjs, crypto-js, posthog, nuqs, zustand, react-draggable, recaptcha, libphonenumber-js, react-international-phone, react-qr-code, firebase и т.д.
3. Раскладка по файлам: пути из Sentry → ручная карта модулей → граф использования (`assign.py`).
4. Генерация файлов с импортами/экспортами, восстановление `import()` lazy-страниц (`emit*.py`, `finalize.py`).
5. JSX и читаемый синтаксис — декомпилятор `wakaru` + `prettier` (`beautify.sh`).
6. CSS-модули восстановлены из CSS-бандла по хэшу (`css.mjs`): `._login_moqpz_1` → `.login` в `Login.module.css`.
7. Возвращён `import.meta.env.VITE_RECAPTCHA_SITE_KEY` вместо инлайн-значения.

Результат: ~200 файлов в `src/`, версии зависимостей совпадают со сборкой, `npm run build` проходит, все 8 публичных маршрутов и lazy-формы SMS/Telegram открываются без JS-ошибок (проверено в Chromium через Playwright).
Ограничения: TypeScript-типы и большинство локальных имён не восстанавливаются; глобальный CSS (tailwind + antd) оставлен скомпилированным (`src/styles/global.compiled.css`); файлы с выведенным путём помечены `// TODO: inferred from build`.

## 5. Mock API — вход без бэкенда

```bash
cd demo/app
npm install
npm run dev:mock   # http://localhost:5173
```

- Пароль: **`admin` / `admin123`**; SMS: любой номер, код **`123456`**, затем выбор компании; Telegram в mock недоступен.
- `src/mocks/` подменяет axios-адаптер (обслуживает все API-клиенты), пропускает reCAPTCHA и вместо закрытой части показывает заглушку `MockAppShell` с данными пользователя и кнопкой выхода.
- Включается только через `.env.mock` (`VITE_MOCK_API=true`); в обычной сборке mock-код вырезается (проверено).

**Баг, найденный при проверке входа:** `Mn` в бандле — это `crypto-js/aes`, а не весь `crypto-js`; из-за этого `setUser` падал на `Mn.encrypt`. Исправлено.

## 6. Git

- Ветка **`restore/app-open-shell`** (от `main`), коммиты:
  - `c6dd94d` — восстановленный `demo/app`, `scripts/fetch-build.mjs`, `tools/restore/`, `.gitignore`;
  - этот файл журнала.
- В `.gitignore`: `.tmp/`, `node_modules/`, `demo/app/_build/` (скачанная сборка, воспроизводится скриптом).
- Отправить: `git push -u origin restore/app-open-shell`.
- Служебное: в `.tmp/_to_delete/` лежат lock-файлы git, которые среда Claude не могла удалить, — папку `.tmp/` можно удалить; лишние `tmp_obj_*` в `.git/objects` убирает `git gc`.

## 7. Что дальше

1. **Основное приложение (CRM):** проверить Sentry → Settings → Source Maps; если пусто — войти в браузере, скопировать заголовок `Cookie` из DevTools и выполнить
   `node scripts/fetch-build.mjs https://app.dev.uysot.uz/main/home demo/app/_build_private --cookie "$COOKIE"`, затем прогнать тот же конвейер.
2. Переименовать минифицированные экспортируемые имена (`ce` → `storage`, `Wa` → `apiClient`, …).
3. Добавить типы и включить `strict` в `tsconfig`.
4. Заменить `global.compiled.css` на исходные Tailwind/antd-стили.
5. Остальные цели: `demo/admin`, `demo/ads`, `demo/boss`, `demo/showroom` — тем же скриптом и конвейером.
