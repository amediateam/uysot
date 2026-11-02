# Восстановление `app.dev.uysot.uz` — публичная часть (open shell)

## Итог

- **Что восстановлено:** публичная часть приложения (`apps/open.tsx`): вход (пароль / SMS / Telegram / QR), восстановление и смена пароля, QR-страницы договоров и оплаты, политика конфиденциальности, `/schedule-lottotron`, `/sap`, а также попавшая в публичный бандл общая инфраструктура: Redux store со всеми слайсами, API-эндпоинты, axios-клиенты и интерцепторы, permissions, маршруты, i18n (i18next + Tolgee), Sentry, analytics, Firebase FCM, desktop-agent.
- **Чего нет:** основное приложение после входа (`/main/*`, CRM, договоры и т.д.). Оно собрано отдельным входом (`/assets/app-*.js`), а Vercel-middleware отдаёт его только авторизованным пользователям. Все прочие пути `open.tsx` обрабатывает компонентом `ReloadToAppShell`: он делает полную перезагрузку страницы. Чтобы получить основное приложение, нужно скачать сборку с cookie (`scripts/fetch-build.mjs --cookie`).
- **Source maps:** на сайте не найдены (проверены `*.map` рядом с каждым чанком, `sourceMappingURL`, `.vite/manifest.json`). В сборке используется Sentry Vite-плагин — карты, скорее всего, загружены в Sentry (проект `4508646119702609`, org `o4508640350306304`, регион `de`). **Если они там есть, они дадут исходники дословно** — это лучший путь для основного приложения.
- **Стек (подтверждён по бандлу):** React 18.3.1 + Vite + TypeScript (SPA, **не Next.js**), React Router 6, Redux Toolkit 1.9 + redux-persist, react-query 3, antd 4, axios, i18next + Tolgee, dayjs, zustand, nuqs 2.10, tailwind (скомпилированный), Sentry 8, PostHog, Amplitude, Firebase 11, Formbricks, Vercel Speed Insights.
- **Проверка:** `npm install && npm run build` проходит; все 8 публичных маршрутов и lazy-формы SMS/Telegram открываются в браузере (Playwright) без ошибок JavaScript.

## Как запустить

```bash
cd demo/app
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ (source maps генерируются как hidden)
```

`public/` содержит ассеты из production (шрифты, картинки, service worker'ы, manifest). Переменные окружения — в `.env`.

## Как делалось

1. `scripts/fetch-build.mjs` скачал `index.html` и все чанки (включая lazy) — `_build/`.
2. Бандл разобран на отдельные декларации (`tools/restore/units.mjs`) с графом ссылок между ними.
3. Код приложения отделён от встроенных в бандл библиотек (antd, posthog, lodash, crypto-js, nuqs, dayjs, tailwind-merge, react-draggable, recaptcha, libphonenumber-js, react-international-phone, react-qr-code, firebase SDK…); каждое обращение к библиотеке заменено на импорт из npm-пакета (`tools/restore/maps.py`).
4. Декларации разложены по файлам: в первую очередь по атрибутам `data-sentry-source-file` (оставлены плагином Sentry — это **точные исходные пути**), затем по карте модулей и графу использования.
5. Межфайловые импорты/экспорты сгенерированы автоматически; `import()` lazy-чанков восстановлены на исходные модули.
6. JSX и читаемый синтаксис восстановлены декомпилятором `wakaru`, затем `prettier`.
7. CSS-модули восстановлены из CSS-бандла по хэшу (`._login_moqpz_1` → `.login` в `Login.module.css`).
8. `import.meta.env.VITE_RECAPTCHA_SITE_KEY` возвращён на место инлайн-значения.


## Точность

- **71 из 183 файлов** имеют точный исходный путь (из `data-sentry-source-file`). В начале каждого файла стоит комментарий `// [restore] Путь файла восстановлен точно`.
- **112 файлов** — путь/имя выведены по структуре бандла; помечены `// [restore] TODO: inferred from build`.
- **Поведение** сохранено 1:1: код взят из production-бандла без переписывания логики; API-пути, имена роутов, ключи localStorage, формат данных и env-переменные не менялись.
- **Не восстанавливается из сборки:** TypeScript-типы (файлы `.ts/.tsx`, но без типов; `tsconfig` нестрогий), большинство локальных имён переменных (минификатор их стёр; часть вернул декомпилятор), исходный Tailwind/antd-конфиг.
- `src/styles/global.compiled.css` — скомпилированный глобальный CSS (tailwind + antd + глобальные стили) как есть: **TODO** заменить на `tailwind.config` + `antd/dist/antd.css`.
- Дублирующийся ключ `referralCode` в `store/reducers/createContractV2.ts` — есть в оригинале, оставлен.


## Дерево папок

```
src/
  apps/
  assets/
    icons/
      contract/
  bootstrap/
  components/
    error-boundary/
    icon/
    loading/
    passwordValidationPopover/
    privacyColicies/
    restorePassword/
      restorePassword/
      sendCode/
      sendLogin/
    toaster/
  constants/
  global/
    button/
    dropdown/
    modal/
    table/
  i18n/
  modules/
    active-session/
      components/
    auth/
      components/
        sms-login/
        telegram-login/
      hooks/
      utils/
    desktop-agent/
    theme/
  pages/
    change-password/
    login/
      components/
      hooks/
    payment-qr-code/
    privacy-policy/
    qr-code/
      components/
    restorePassword/
    sap/
    schedule-lottotron/
  services/
    api/
    verto/
  store/
    reducers/
  styles/
    chunks/
  utils/
```

## Разделы

### Точка входа и bootstrap (5)

- `src/apps/open.tsx` — точно
- `src/bootstrap/chunk-recovery.ts` — предположительно
- `src/bootstrap/polyfills.ts` — предположительно
- `src/bootstrap/shell-init.ts` — предположительно
- `src/main.tsx` — предположительно

### Страницы (18)

- `src/pages/change-password/ChangePassword.tsx` — точно
- `src/pages/login/Login.tsx` — точно
- `src/pages/login/components/desktop-agent-login-gate.tsx` — точно
- `src/pages/login/components/local-network-permission-guide.tsx` — точно
- `src/pages/login/components/login-form.tsx` — точно
- `src/pages/login/components/login-language-switcher.tsx` — точно
- `src/pages/login/constants.ts` — предположительно
- `src/pages/login/hooks/use-desktop-agent-check.ts` — предположительно
- `src/pages/payment-qr-code/index.tsx` — точно
- `src/pages/privacy-policy/index.tsx` — точно
- `src/pages/qr-code/QrCode.tsx` — точно
- `src/pages/qr-code/components/language-switcher.tsx` — точно
- `src/pages/qr-code/components/store-icons.tsx` — точно
- `src/pages/qr-code/components/uyim-app-banner.tsx` — точно
- `src/pages/qr-code/constants.tsx` — предположительно
- `src/pages/restorePassword/RestorePassword.tsx` — точно
- `src/pages/sap/index.tsx` — точно
- `src/pages/schedule-lottotron/ScheduleLottotron.tsx` — точно

### Общие компоненты (17)

- `src/components/error-boundary/ChunkRecoveryFallback.tsx` — точно
- `src/components/icon/icon-lite.tsx` — точно
- `src/components/loading/Loading.tsx` — точно
- `src/components/passwordValidationPopover/PasswordValidationPopover.tsx` — точно
- `src/components/privacyColicies/PrivacyColicies.tsx` — точно
- `src/components/restorePassword/api.ts` — предположительно
- `src/components/restorePassword/restorePassword/RestorePassword.tsx` — точно
- `src/components/restorePassword/sendCode/SendCode.tsx` — точно
- `src/components/restorePassword/sendLogin/SendLogin.tsx` — точно
- `src/components/toaster/asserts.tsx` — точно
- `src/components/toaster/index.tsx` — точно
- `src/components/toaster/state.ts` — предположительно
- `src/global/button/Button.tsx` — точно
- `src/global/dropdown/Dropdown.tsx` — точно
- `src/global/modal/DraggableModal.tsx` — точно
- `src/global/table/Table.tsx` — предположительно
- `src/with-error-boundary.tsx` — точно

### Модули (auth, active-session, theme, desktop-agent) (24)

- `src/modules/active-session/api.ts` — предположительно
- `src/modules/active-session/components/session-item.tsx` — точно
- `src/modules/active-session/components/session-limit-modal.tsx` — точно
- `src/modules/active-session/components/session-warning.tsx` — точно
- `src/modules/auth/components/auth-step.tsx` — точно
- `src/modules/auth/components/company-select-step.tsx` — точно
- `src/modules/auth/components/icons.tsx` — точно
- `src/modules/auth/components/invisible-recaptcha.tsx` — точно
- `src/modules/auth/components/login-methods.tsx` — точно
- `src/modules/auth/components/otp-input.tsx` — точно
- `src/modules/auth/components/session-invalid.tsx` — точно
- `src/modules/auth/components/sms-login/api.ts` — предположительно
- `src/modules/auth/components/sms-login/sms-code-step.tsx` — точно
- `src/modules/auth/components/sms-login/sms-login.tsx` — точно
- `src/modules/auth/components/sms-login/sms-phone-step.tsx` — точно
- `src/modules/auth/components/telegram-login/telegram-expired.tsx` — точно
- `src/modules/auth/components/telegram-login/telegram-login.tsx` — точно
- `src/modules/auth/components/telegram-login/telegram-redeem.tsx` — точно
- `src/modules/auth/components/telegram-login/telegram-waiting-step.tsx` — точно
- `src/modules/auth/login-broadcast.ts` — предположительно
- `src/modules/auth/utils/auth-errors.ts` — предположительно
- `src/modules/desktop-agent/errors.ts` — предположительно
- `src/modules/theme/ThemeToggle.tsx` — точно
- `src/modules/theme/theme-store.ts` — предположительно

### Хуки (3)

- `src/modules/auth/hooks/use-recaptcha.ts` — предположительно
- `src/modules/auth/hooks/use-sign-in.ts` — предположительно
- `src/store/hooks.ts` — предположительно

### Сервисы (10)

- `src/services/analytics.ts` — предположительно
- `src/services/api/client.ts` — предположительно
- `src/services/api/endpoints.ts` — предположительно
- `src/services/desktop-agent.ts` — предположительно
- `src/services/fcm-auth-cache.ts` — предположительно
- `src/services/firebase.ts` — предположительно
- `src/services/sentry-scrub.ts` — предположительно
- `src/services/sentry.ts` — предположительно
- `src/services/verto/index.ts` — предположительно
- `src/services/web-push-session.ts` — предположительно

### Store (Redux Toolkit) (59)

- `src/store/index.ts` — предположительно
- `src/store/reducers/CompanySlice.ts` — предположительно
- `src/store/reducers/CrmOneLidSlice.ts` — предположительно
- `src/store/reducers/ai-agents-slice.ts` — предположительно
- `src/store/reducers/ai-assistant.ts` — предположительно
- `src/store/reducers/allHouseFilter.ts` — предположительно
- `src/store/reducers/block-employee-slice.ts` — предположительно
- `src/store/reducers/bossCurrency.ts` — предположительно
- `src/store/reducers/changes.ts` — предположительно
- `src/store/reducers/client.ts` — предположительно
- `src/store/reducers/common-slice.ts` — предположительно
- `src/store/reducers/companies.ts` — предположительно
- `src/store/reducers/company-realtor-slice.ts` — предположительно
- `src/store/reducers/companyEmployees.ts` — предположительно
- `src/store/reducers/contact-slice.ts` — предположительно
- `src/store/reducers/contract.ts` — предположительно
- `src/store/reducers/createContract.ts` — предположительно
- `src/store/reducers/createContractV2.ts` — предположительно
- `src/store/reducers/crm-page-lead-market-store.ts` — предположительно
- `src/store/reducers/crmField.ts` — предположительно
- `src/store/reducers/crmFieldState.ts` — предположительно
- `src/store/reducers/crmV2Slice.ts` — предположительно
- `src/store/reducers/currencySlice.ts` — предположительно
- `src/store/reducers/dashboard-v2-slice.ts` — предположительно
- `src/store/reducers/debt.ts` — предположительно
- `src/store/reducers/desktopAgentReducer.ts` — предположительно
- `src/store/reducers/feedback-slice.ts` — предположительно
- `src/store/reducers/flat.ts` — предположительно
- `src/store/reducers/house-history.ts` — предположительно
- `src/store/reducers/house.ts` — предположительно
- `src/store/reducers/houseConfig.ts` — предположительно
- `src/store/reducers/importedFiles.ts` — предположительно
- `src/store/reducers/ioService.ts` — предположительно
- `src/store/reducers/leadComposer.ts` — предположительно
- `src/store/reducers/monthlyPayments.ts` — предположительно
- `src/store/reducers/notTaskLeadNotification.ts` — предположительно
- `src/store/reducers/notification.ts` — предположительно
- `src/store/reducers/offer-slice.ts` — предположительно
- `src/store/reducers/qrCodeModeSlice.ts` — предположительно
- `src/store/reducers/realtor-booking-slice.ts` — предположительно
- `src/store/reducers/realtor-flat-slice.ts` — предположительно
- `src/store/reducers/realtor-offer-slice.ts` — предположительно
- `src/store/reducers/realtor-search-slice.ts` — предположительно
- `src/store/reducers/remoteSessionActive.ts` — предположительно
- `src/store/reducers/roboto-call-slice.ts` — предположительно
- `src/store/reducers/sendMessageCrm.ts` — предположительно
- `src/store/reducers/settings-slice.ts` — предположительно
- `src/store/reducers/shaxmatka.ts` — предположительно
- `src/store/reducers/shaxmatkaV3.ts` — предположительно
- `src/store/reducers/showroom-slice.ts` — предположительно
- `src/store/reducers/showroomModal.ts` — предположительно
- `src/store/reducers/task-slice.ts` — предположительно
- `src/store/reducers/taskCalendarView.ts` — предположительно
- `src/store/reducers/taskChangeText.ts` — предположительно
- `src/store/reducers/text-editor.ts` — предположительно
- `src/store/reducers/trigger.ts` — предположительно
- `src/store/reducers/user.ts` — предположительно
- `src/store/reducers/wazzup.ts` — предположительно
- `src/store/store-registry.ts` — предположительно

### Утилиты (15)

- `src/utils/cn.ts` — предположительно
- `src/utils/contract-calc.ts` — предположительно
- `src/utils/current-user.ts` — предположительно
- `src/utils/dayjs.ts` — предположительно
- `src/utils/error-handler.tsx` — предположительно
- `src/utils/helpers.ts` — предположительно
- `src/utils/jwt.ts` — предположительно
- `src/utils/logout.ts` — предположительно
- `src/utils/password-policy.ts` — предположительно
- `src/utils/payment-schedule.ts` — предположительно
- `src/utils/random-string.ts` — предположительно
- `src/utils/recaptcha.ts` — предположительно
- `src/utils/redirect-after-login.ts` — предположительно
- `src/utils/round.ts` — предположительно
- `src/utils/storage.ts` — предположительно

### Константы и конфиги (32)

- `src/assets/icons/AntErrorIcon.tsx` — точно
- `src/assets/icons/AntInfoIcon.tsx` — точно
- `src/assets/icons/AntSuccessIcon.tsx` — точно
- `src/assets/icons/AntWarningIcon.tsx` — точно
- `src/assets/icons/ArrowDawnIcon.tsx` — точно
- `src/assets/icons/ArrowDownBottom.tsx` — точно
- `src/assets/icons/ChevronDownIcon.tsx` — точно
- `src/assets/icons/ErrorIcon.tsx` — точно
- `src/assets/icons/SearchIcon.tsx` — точно
- `src/assets/icons/TickCircleIcon.tsx` — точно
- `src/assets/icons/close-icon.tsx` — точно
- `src/assets/icons/contract/ArrowLeftIcon.tsx` — точно
- `src/assets/icons/contract/ArrowRightIcon.tsx` — точно
- `src/assets/icons/empty-icon.tsx` — точно
- `src/assets/icons/info-icon.tsx` — точно
- `src/assets/icons/laptop-icon.tsx` — точно
- `src/assets/icons/link-external-icon.tsx` — точно
- `src/assets/icons/macos-icon.tsx` — точно
- `src/assets/icons/message-question-icon.tsx` — точно
- `src/assets/icons/moon-icon.tsx` — точно
- `src/assets/icons/sun-icon.tsx` — точно
- `src/assets/icons/system-theme-icon.tsx` — точно
- `src/assets/icons/windows-icon.tsx` — точно
- `src/assets/index.ts` — предположительно
- `src/constants/client-type.ts` — предположительно
- `src/constants/countries.ts` — предположительно
- `src/constants/dynamic-translate-keys.ts` — предположительно
- `src/constants/index.ts` — предположительно
- `src/constants/permissions.ts` — предположительно
- `src/constants/routes.ts` — предположительно
- `src/constants/storage-keys.ts` — предположительно
- `src/i18n/index.ts` — предположительно

## Модули бандла → файлы

**`assets/ChangePassword-DIbI7hkK.js`** → `pages/change-password/ChangePassword.tsx`

**`assets/QrCode-CXeqeBv0.js`** → `assets/index.ts`, `pages/qr-code/QrCode.tsx`, `pages/qr-code/components/language-switcher.tsx`, `pages/qr-code/components/store-icons.tsx`, `pages/qr-code/components/uyim-app-banner.tsx`

**`assets/RestorePassword-D4Gkow_N.js`** → `components/restorePassword/api.ts`, `components/restorePassword/restorePassword/RestorePassword.tsx`, `components/restorePassword/sendCode/SendCode.tsx`, `components/restorePassword/sendLogin/SendLogin.tsx`, `pages/restorePassword/RestorePassword.tsx`

**`assets/ScheduleLottotron-BRWX7mEZ.js`** → `assets/icons/contract/ArrowRightIcon.tsx`, `global/table/Table.tsx`, `pages/schedule-lottotron/ScheduleLottotron.tsx`

**`assets/bg_new-yiMPkYGx.js`** → `assets/icons/TickCircleIcon.tsx`, `assets/index.ts`, `components/passwordValidationPopover/PasswordValidationPopover.tsx`, `utils/password-policy.ts`

**`assets/company-select-step-Cjab7zDr.js`** → `modules/auth/components/auth-step.tsx`, `modules/auth/components/company-select-step.tsx`, `modules/auth/components/session-invalid.tsx`, `modules/auth/utils/auth-errors.ts`

**`assets/constants-ChKi1eDp.js`** → `pages/qr-code/constants.tsx`

**`assets/dynamic-translate-keys-DjuepjZu.js`** → `constants/dynamic-translate-keys.ts`

**`assets/firebase-DBDQKvII.js`** → `services/firebase.ts`

**`assets/index-B0UwuSD7.js`** → `apps/open.tsx`, `assets/icons/AntErrorIcon.tsx`, `assets/icons/AntInfoIcon.tsx`, `assets/icons/AntSuccessIcon.tsx`, `assets/icons/AntWarningIcon.tsx`, `assets/icons/ArrowDawnIcon.tsx`, `assets/icons/ChevronDownIcon.tsx`, `assets/icons/ErrorIcon.tsx`, `assets/icons/SearchIcon.tsx`, `assets/icons/close-icon.tsx`, `assets/icons/contract/ArrowLeftIcon.tsx`, `assets/icons/empty-icon.tsx`, `assets/icons/info-icon.tsx`, `assets/icons/laptop-icon.tsx`, `assets/icons/link-external-icon.tsx`, `assets/icons/macos-icon.tsx`, `assets/icons/message-question-icon.tsx`, `assets/icons/moon-icon.tsx`, `assets/icons/sun-icon.tsx`, `assets/icons/system-theme-icon.tsx`, `assets/icons/windows-icon.tsx`, `assets/index.ts`, `bootstrap/chunk-recovery.ts`, `bootstrap/polyfills.ts`, `components/error-boundary/ChunkRecoveryFallback.tsx`, `components/icon/icon-lite.tsx`, `components/loading/Loading.tsx`, `components/toaster/asserts.tsx`, `components/toaster/index.tsx`, `components/toaster/state.ts`, `constants/client-type.ts`, `constants/index.ts`, `constants/permissions.ts`, `constants/routes.ts`, `constants/storage-keys.ts`, `global/button/Button.tsx`, `global/dropdown/Dropdown.tsx`, `global/modal/DraggableModal.tsx`, `i18n/index.ts`, `main.tsx`, `modules/active-session/api.ts`, `modules/active-session/components/session-item.tsx`, `modules/active-session/components/session-limit-modal.tsx`, `modules/active-session/components/session-warning.tsx`, `modules/auth/components/icons.tsx`, `modules/auth/components/login-methods.tsx`, `modules/auth/hooks/use-recaptcha.ts`, `modules/auth/hooks/use-sign-in.ts`, `modules/auth/login-broadcast.ts`, `modules/desktop-agent/errors.ts`, `modules/theme/ThemeToggle.tsx`, `modules/theme/theme-store.ts`, `pages/login/Login.tsx`, `pages/login/components/desktop-agent-login-gate.tsx`, `pages/login/components/local-network-permission-guide.tsx`, `pages/login/components/login-form.tsx`, `pages/login/components/login-language-switcher.tsx`, `pages/login/constants.ts`, `pages/login/hooks/use-desktop-agent-check.ts`, `services/analytics.ts`…

**`assets/index-C9x7MnxX.js`** → `components/privacyColicies/PrivacyColicies.tsx`, `pages/privacy-policy/index.tsx`

**`assets/index-CHe0gF2k.js`** → `pages/sap/index.tsx`

**`assets/index-CoeJIAaJ.js`** → `assets/icons/ArrowDownBottom.tsx`, `pages/payment-qr-code/index.tsx`

**`assets/otp-input-BD3EMwUi.js`** → `modules/auth/components/otp-input.tsx`

**`assets/shell-init-BgJqmgkc.js`** → `bootstrap/shell-init.ts`

**`assets/sms-login-C3nOBmnF.js`** → `constants/countries.ts`, `modules/auth/components/invisible-recaptcha.tsx`, `modules/auth/components/sms-login/api.ts`, `modules/auth/components/sms-login/sms-code-step.tsx`, `modules/auth/components/sms-login/sms-login.tsx`, `modules/auth/components/sms-login/sms-phone-step.tsx`

**`assets/telegram-login-CUVBmqvA.js`** → `modules/auth/components/telegram-login/telegram-expired.tsx`, `modules/auth/components/telegram-login/telegram-login.tsx`, `modules/auth/components/telegram-login/telegram-waiting-step.tsx`

**`assets/telegram-redeem-BCWpxEWP.js`** → `modules/auth/components/telegram-login/telegram-redeem.tsx`

**`assets/webPushSession-CGnGvNL1.js`** → `services/web-push-session.ts`


Чанки, целиком состоящие из библиотек, заменены npm-пакетами: `vendor-react` → react/react-dom, `vendor-redux` → @reduxjs/toolkit/react-redux/redux-persist, `vendor-i18n` → i18next/react-i18next/@tolgee, `vendor-router` → react-router-dom, `vendor-data` → axios/react-query, `index-DnhTvTv2` → @sentry/react, `index-Cvx5Xo9o` → @amplitude/analytics-browser, `index-DJQj0frt` → @formbricks/js, `index-Ct6jfUeP` → nuqs.

## Следующие шаги

1. **Основное приложение:** проверить Sentry → Source Maps; если пусто — скачать закрытую сборку с cookie и прогнать тот же конвейер.
2. **Именование:** переименовать минифицированные экспортируемые имена (`ce` → `storage`, `Ar` → `TOKEN_KEY`, `Wa` → `apiClient` и т.д.) — механически, с проверкой сборкой.
3. **Типы:** постепенно добавить типы и включить `strict`.
4. **Стили:** заменить `global.compiled.css` на исходные Tailwind/antd-стили.

## Mock API (вход без бэкенда)

```bash
npm install
npm run dev:mock    # http://localhost:5173
```

| Способ входа | Данные |
|---|---|
| Логин/пароль | `admin` / `admin123` (другой пароль → ошибка `loginFailed`, messageCode 3121) |
| SMS | любой номер, код `123456`, затем выбор компании (2 демо-компании) |
| Telegram | в mock-режиме недоступен (возвращает ошибку) |

- `src/mocks/adapter.ts` подменяет axios-адаптер, поэтому обслуживает **все** axios-клиенты (`services/api/client.ts`). Неизвестные запросы получают `{accept:true, data:null}` и пишутся в консоль: `[mock api] нет обработчика: …` — по этим строкам удобно добавлять новые обработчики.
- Формат ответов взят из кода: `sign-in` → пользователь с `accessToken` (JWT-формат) и `role.permissions` (все из `constants/permissions.ts`, кроме кабинета риелтора); `otp/send` → `{maskedPhone, resendAfterSec, codeTtlSec}`; `otp/verify` → `{selectionToken, expiresInSec, companies[]}`; `otp/select` → пользователь.
- В mock-режиме reCAPTCHA пропускается (на localhost она не работает), а вместо закрытой части приложения (`/main/*`) показывается `src/mocks/MockAppShell.tsx` с данными вошедшего пользователя и кнопкой выхода.
- Всё включается только при `VITE_MOCK_API=true` (`.env.mock`); в обычной сборке mock-код вырезается (проверено по `dist/`).

### Исправлено при проверке входа
`Mn` в бандле — это модуль `crypto-js/aes`, а не весь `crypto-js` (в первой версии было `import Mn from "crypto-js"`, из-за чего `Mn.encrypt` падал и вход не работал бы и с настоящим бэкендом). Исправлено в `services/api/client.ts`, `store/reducers/user.ts`, `utils/current-user.ts`.
