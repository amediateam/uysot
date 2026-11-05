# Восстановление `admin.meninguyim.uysot.uz`

## Итог

- **Восстановлено всё приложение** — админ-панель Uyim целиком: вход, смена пароля, дашборд, компании (+ бириктирилмаган), бренды (+ детальная, панель, логотипы), операторы (+ детальная, сессии, сброс пароля), партнёры (категории с drag-and-drop, редактор контент-блоков из 13 типов, баннер с кадрированием, галерея, PDF), story (список, детальная, редактор с загрузкой медиа и предпросмотром), AI-дизайн (заказы, заказ, стили, цена, платежи), Eskiz (SMS-аккаунты, баланс, тест SMS), аудит-журнал. Роли `VIEWER / ADMIN / SUPER_ADMIN`, тема light/dark/system.
- **Source maps не найдены.** Проверены `*.map` рядом с каждым JS/CSS, `sourceMappingURL`, `.vite/manifest.json`, альтернативные пути (`/.git`, `/src/*`, `/_src`, `.vercel` и т.п.). Сервер (Vercel) на любой путь отдаёт SPA-заглушку (HTTP 200 с тем же `index.html`), а `*.js.map` — `403`. Sentry нет.
- **Стек (подтверждён по бандлу): rolldown-vite + React 18.3.1 + TypeScript SPA, не Next.js.** antd 5, `@tanstack/react-query` v5, Redux Toolkit 2 + react-redux (store с динамической регистрацией редьюсеров), react-router-dom 6, axios, dayjs, Tailwind v4 (CSS-конфиг через `@theme`). Вкомпилированные библиотеки заменены npm-пакетами: `ua-parser-js` (парсинг User-Agent в сессиях), `react-international-phone` (телефон у партнёров), `react-easy-crop` (кадрирование баннера).
- **Проверка:** `npm run build` (tsc в режиме `strict` + vite build) проходит; `npm run dev` открывает экран входа, переключение light/dark работает (applyTheme пишет `--app-*` токены), ошибок в консоли нет (проверено в Chrome).

## Особенность rolldown-сборки

В отличие от rollup (demo/app с его `vendor-*` чанками), **rolldown вплетает библиотеки в чанки приложения**, а не выносит их в отдельные vendor-файлы. Поэтому «хребет» приложения (объект маршрутов, enum кодов ошибок API, http-клиент, store, тема, дизайн-система) лежал вперемешку с antd/react-query/RTK/axios внутри мегачанков `button-*` (478 КБ), `chunk-62JRHF6Z-*`, `index-*` (entry), `data-table-*`. Эти части вырезаны и восстановлены как отдельные модули, библиотеки заменены импортами из npm.

## Запуск

```bash
cd demo/admin
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit (strict) + vite build → dist/
npm run preview
```

API-адрес (`https://serv.meninguyim.uysot.uz/api/v1/admin`) — публичный dev-эндпоинт, вшит как значение по умолчанию; переопределяется через `VITE_API_BASE_URL` (см. `.env.example`). Секретов в репозитории нет.

## Как делалось

1. `scripts/fetch-build.mjs` скачал `index.html` и все 95 чанков (включая lazy) в `demo/admin/_build/` (gitignored).
2. Чанки — чистый ESM с именованными import/export между собой и lazy-загрузкой через `__vite__mapDeps`. Построен граф модулей; имена чанков (`login-page`, `companies-page`, `use-login-mutation` …) — главный источник структуры.
3. Каждый чанк развёрнут из минифицированного вида в читаемый JSX декомпилятором **wakaru** + `prettier`.
4. Разделение «код приложения / библиотека» по графу импортов; символы библиотек заменены на npm-импорты, символы приложения — на реальные имена и пути.
5. Код разложен по стандартному дереву React + Vite; поведение, API-пути, enum кодов ошибок, ключи `localStorage` и форматы данных сохранены как в бандле.

## Точность

- **Восстановлено точно (из бандла):** вся бизнес-логика — маршруты (узбекские пути), enum кодов ошибок API (100–110 + доменные 11001…19012), http-клиент (Bearer, разворачивание `data.data`, single-flight refresh на 401 → редирект на `/login`), QueryClient, права (`ROLE_RANK`, `hasRole`), тема (палитры light/dark `me`/`he`, antd-конфиг, applyTheme), layout/guard-ы, все страницы, формы, валидация, трансформации данных, тексты UI.
- **Выведено по структуре (помечено `TODO: inferred from build`):** базовый URL API (в бандле — литерал, вынесен в `import.meta.env.VITE_API_BASE_URL`); точные имена нескольких предикатов прав (`permissions/index.ts`); дополнительные поля типа `Admin`; маска телефон-инпута (библиотека та же — `react-international-phone`).
- **Не восстанавливается из сборки:** TypeScript-типы (восстановлены по использованию; проект собирается в `strict`), локальные имена переменных внутри тел функций (минификатор их стёр), точный исходный Tailwind/antd-конфиг.

## Дерево папок

```
demo/admin/
  index.html  package.json  tsconfig.json  vite.config.ts  .env.example
  public/                    uyim-logo.jpg
  src/
    main.tsx  App.tsx  vite-env.d.ts
    config/                  index.ts (API base URL, timeout, refresh-путь)
    constants/               routes.ts · api-error-codes.ts · storage.ts
    services/
      http.ts  api-error.ts  token-storage.ts  query-client.ts
      auth/  companies/  brands/  operators/  audit/  dashboard/  eskiz/  design/  stories/  partners/
                               (у каждого домена keys.ts / types.ts / api.ts, где нужно format/validation/server-errors)
    store/                   index.ts (configureStore + injectReducer + typed hooks)
    permissions/             index.ts
    theme/                   palette.ts · apply-theme.ts · antd-theme.ts · ThemeProvider.tsx · ThemeSwitcher.tsx · theme-icons.tsx
    router/                  index.tsx · guards.tsx · RouteError.tsx
    layouts/                 AuthLayout.tsx · AppLayout.tsx · SidebarContent.tsx · nav-config.ts
    hooks/                   use-auth, use-media-up, use-debounced-value, use-fill-viewport-height,
                             use-api-message, use-config, companies, brands, operators, audit,
                             dashboard, eskiz, design, stories, partners, use-partner-form, use-partner-upload, use-in-view …
    components/
      ui/                    Button-слой на antd: AppInput, AppSelect, AppModal, ConfirmModal, SidePanel,
                             PageHeader, DataTable, SearchInput, FilterSegmented, StatusChip, OrderStatusChip,
                             DesignCard, AppLogo, RowActions, TableEmptyState, TableErrorState, SumInput, Loading
      companies/ brands/ operators/ stories/ partners/   (компоненты и панели доменов)
    pages/
      login/ change-password/ dashboard/ companies/ brands/ partners/ stories/
      design/ eskiz/ operators/ audit/ forbidden/ not-found/
    styles/                  index.css (Tailwind v4 @theme + токены --app-*)
    assets/                  uyim-logo.jpg
```

## Карта модулей (чанк → файлы)

| Чанк бандла | Куда перенесено |
|---|---|
| `index-*` (entry) | `main.tsx`, `App.tsx`, `router/*`, store-хелперы, data-layer audit/brands/dashboard/eskiz/operators |
| `button-*` (мегачанк) | `constants/routes.ts`, `constants/api-error-codes.ts`, `services/http.ts`, `services/api-error.ts`, `theme/*`, Button; остальное — react/antd/react-query/axios/i18n → npm |
| `auth-*` | `theme/*` (палитры + applyTheme + ThemeProvider), `hooks/use-auth.ts`, `components/ui/Loading.tsx` |
| `companies-*` | `layouts/*`, `router/guards.tsx` |
| `chunk-62JRHF6Z-*`, `useQuery-*`, `auth-keys-*` | react-query / react-router (→ npm) + `services/auth/keys.ts` |
| `data-table-*` | `components/ui/DataTable.tsx` (+ antd Table → npm) |
| `use-api-message-*` | `hooks/use-api-message.ts` (+ antd App/message → npm) |
| `side-panel-*`, `app-modal-*`, `app-input-*`, `app-select-*` | `components/ui/{SidePanel,AppModal,AppInput,AppSelect}.tsx` (+ antd → npm) |
| `*-page-*`, `*-panel-*` | соответствующие `pages/**` и `components/**` |
| `use-*-mutation/-query`, `*-keys` | `hooks/**` и `services/**/keys.ts` |
| `format-*`, `to-tashkent-day-bounds`, `read-as-data-url` | `utils/**` |
| `permissions-*` | `permissions/index.ts` |
| `*Outlined-*`, `KeyCode-*`, `Addon-*`, `style-*`, `config-provider-*`, `checkbox/slider/...` | библиотеки antd/rc/@ant-design/icons → npm |

## Перечень

**Страницы (19):** LoginPage, ChangePasswordPage, DashboardPage, CompaniesPage, UnlinkedCompaniesPage, BrandsPage, BrandDetailPage, PartnersPage, StoriesPage, StoryDetailPage, DesignOrdersPage, DesignOrderPage, ServicePaymentsPage, DesignStylesPage, DesignPricingPage, EskizPage, OperatorsPage, OperatorDetailPage, AuditPage (+ Forbidden, NotFound, RouteError).

**Маршруты:** `/login`, `/parolni-almashtirish`, `/bosh-sahifa`, `/kompaniyalar`(+`/biriktirilmagan`), `/brendlar`(+`/:brandId`), `/hamkorlar`, `/story`(+`/:storyId`), `/ai-dizayn/{buyurtmalar,tolovlar,uslublar,narx}`(+`/buyurtmalar/:orderId`), `/eskiz`, `/operatorlar`(+`/:operatorId`), `/audit`. Корень → редирект на дашборд; лэйаут с sidebar (меню фильтруется по правам), guard-ы (не авторизован → `/login`; требуется смена пароля → `/parolni-almashtirish`; permission-guard показывает Forbidden).

**Общие компоненты:** DataTable, SidePanel, AppModal, ConfirmModal, PageHeader, SearchInput, FilterSegmented, StatusChip, OrderStatusChip, RowActions, TableEmptyState, TableErrorState, SumInput, DesignCard, AppLogo, AppInput (TextInput/PasswordInput/TextArea), AppSelect, Loading, ThemeSwitcher, а также доменные панели/карточки (CompanyFormPanel, BrandFormPanel, OperatorFormPanel, ResetPasswordPanel, StoryEditorPanel, PartnerFormPanel, CategoryManager, блоки партнёров …).

**Хуки:** useAuth/useMe/useLogout, useLoginMutation, useChangePasswordMutation, useConfig, useMediaUp, useDebouncedValue, useFillViewportHeight, useApiMessage, useInView, + доменные query/mutation-хуки (companies, brands, operators, audit, dashboard, eskiz, design, stories, partners), usePartnerForm, usePartnerUpload.

**Утилиты:** format-number, format-date-time, to-tashkent-day-bounds, read-as-data-url, format-user-agent.

**Сервисы/конфиги:** http-клиент + перехватчики, api-error (модель ошибок), query-client, token-storage, по каждому домену keys/types/api (и format/validation/server-errors для stories и partners), store, permissions, тема, router.

## Проверка

- `npm run build` (`tsc --noEmit` в `strict` + `vite build`) — проходит. 19 страниц разбиты на отдельные lazy-чанки, как в оригинале.
- `npm run dev` + Chrome: экран входа рендерится 1:1 с оригиналом (логотип, тексты, поля, кнопка «Kirish», переключатель темы). Переключение light↔dark корректно меняет токены темы. Ошибок в консоли нет.
- **Не проверено:** работа с реальным бэкендом. Формы запросов и формы ответов взяты из кода бандла; реальный сервер они не подтверждают.
