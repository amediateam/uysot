# Отчёт о восстановлении — `dashboard.ads.uysot.uz` → `demo/ads`

Исходники восстановлены из продакшн-сборки сайта **https://dashboard.ads.uysot.uz/**
(панель управления рекламными баннерами маркетплейса uysot).

## Как восстанавливалось

1. **Поиск source maps.** Как и у `demo/app` и `demo/boss`, рабочих `.map`-файлов нет:
   сервер отдаёт `index.html` с HTTP 200 на любой путь, включая `*.map`, поэтому ответ
   с кодом 200 ничего не значит. Восстановление шло по минифицированному бандлу.
2. **Деминификация.** Единственный JS-чанк прогнали через `wakaru` + `prettier`
   (`app.jsx` в скретчпаде), получили читаемый JSX. Весь спайк приложения
   (роутинг, провайдеры, страницы, формы, сервисы) находится в одном файле — сборка
   **без code-splitting** (один чанк), так что `React.lazy`/`import()` не вводились.
3. **Стек определён из бандла** (не Next.js, вопреки брифу): Vite + React 18 + TypeScript
   SPA, React Router 6.
4. **Факты → карта модулей → дерево → перенос кода.** Минифицированные имена
   сопоставлены с осмысленными; палитра, иконки, zod-схемы и эндпоинты извлечены точно.

## Стек (версии закреплены по бандлу)

React 18.3, antd 5.21, `@ant-design/icons` 5.6, React Router 6.26,
`@tanstack/react-query` 5.59, `react-hook-form` 7.53 + `@hookform/resolvers` 3.9 + `zod` 3.23,
`use-query-params` 2.2 + `query-string` 9.1, `axios` 1.7, `@nivo/line` 0.87, `dayjs` 1.11,
`classnames` 2.5, `tailwind-merge` 2.5, Tailwind 3.4, Vite 5.4, strict TS.
Алиас `@/` → `src/`, `build.sourcemap: "hidden"`.

## Дерево

```
demo/ads/
├─ index.html
├─ vite.config.ts · tsconfig.json · tailwind.config.js · postcss.config.js
├─ .env.example · .gitignore · package.json
├─ public/              (logo.png — favicon)
└─ src/
   ├─ main.tsx                        точка входа (createRoot + StrictMode)
   ├─ App.tsx                         дерево провайдеров + корневые роуты
   ├─ vite-env.d.ts
   ├─ assets/dashed-border.ts         base64-рамка карточки «создать» (точно из бандла)
   ├─ config/index.ts                 API_BASE_URL (env + дефолт)
   ├─ constants/query-keys.ts         ключи react-query
   ├─ styles/index.css                Inter, @tailwind, CSS-переменные палитры
   ├─ store/
   │  ├─ auth.tsx                     AuthProvider + useAuth + редирект по сессии
   │  └─ ads.tsx                      AdsProvider (URL-пагинация + состояние модалки)
   ├─ services/
   │  ├─ http.ts                      axios-клиент + интерсептор 401/403
   │  ├─ query-client.ts              QueryClient + showApiError
   │  ├─ auth/{api,hooks,schema,types}.ts
   │  └─ banners/{api,hooks,schema,types,constants}.ts
   ├─ layouts/
   │  ├─ AppLayout.tsx                оболочка /main/* (navbar+sidebar+роуты)
   │  ├─ Navbar.tsx · Sidebar.tsx · nav-config.tsx
   ├─ components/
   │  ├─ ui/
   │  │  ├─ Icon.tsx                  19 SVG-иконок + тип IconName
   │  │  ├─ Breadcrumb.tsx
   │  │  └─ form-fields.tsx           Field/TextField/PasswordField/SwitchField/
   │  │                               SelectField/ImageUploadField
   │  └─ advertising/
   │     ├─ CategoryCard.tsx          карточка набора + inline-переименование
   │     ├─ DetailHeader.tsx
   │     ├─ BannersTable.tsx          antd Table + меню действий
   │     ├─ BannerFormModal.tsx       мультиязычная форма создания/редактирования
   │     ├─ StatisticsModal.tsx       недельный график @nivo/line
   │     └─ AdsModalHost.tsx          хост модалок (create/update/stats)
   └─ pages/
      ├─ login/LoginPage.tsx
      ├─ dashboard/DashboardPage.tsx  (заглушка, как в оригинале)
      └─ advertising/
         ├─ AdvertisingLayout.tsx     AdsProvider + Outlet + AdsModalHost
         ├─ AdvertisingListPage.tsx   сетка наборов
         └─ AdvertisingDetailPage.tsx хедер + таблица баннеров
```

## Карта: модуль бандла → файл

| Бандл | Файл | Назначение |
|---|---|---|
| `JKe` | `App.tsx` | дерево провайдеров |
| `XKe`/`YKe` | `App.tsx` (`AppRoutes`) | корневые роуты `/` и `/main/*` |
| `GKe`/`qKe` | `layouts/AppLayout.tsx` | оболочка аутентифицированной части |
| `NRe`/`MRe` | `layouts/Navbar.tsx` | шапка + меню пользователя |
| `PRe`/`ORe` | `layouts/Sidebar.tsx`, `layouts/nav-config.tsx` | боковое меню |
| `ERe`/`SRe` | `pages/login/LoginPage.tsx` | вход |
| `KKe` | `pages/dashboard/DashboardPage.tsx` | дашборд (заглушка) |
| `zKe` | `pages/advertising/AdvertisingLayout.tsx` | провайдер+outlet+модалки |
| `UKe`/`MDComponent` | `AdvertisingListPage.tsx`, `CategoryCard.tsx` | список и карточки наборов |
| `VKe`/`BKe`/`HKe` | `AdvertisingDetailPage.tsx`, `DetailHeader.tsx`, `BannersTable.tsx` | деталь набора |
| `ZkComponent`/`NIe`/`IIe` | `BannerFormModal.tsx`, `CategoryCard.tsx` | формы баннера/набора |
| `DKe` | `StatisticsModal.tsx` | график статистики |
| `FKe`/`LKe` | `AdsModalHost.tsx` | реестр модалок |
| `CIe`/`useWu` | `store/ads.tsx` | контекст рекламы (TqContext) |
| `_Re`/`wRe`/`$Re` | `store/auth.tsx` | контекст авторизации (DSContext) |
| `da` + интерсептор | `services/http.ts` | axios-клиент |
| `ZKe`/`RD` | `services/query-client.ts` | QueryClient + обработчик ошибок |
| `pMe`/`yRe` | `services/auth/*` | login + схема |
| `qRe`/`wIe`/`kRe`/`jRe`/`ARe`/`SIe`/`$Ie`/`EIe`/`TIe` | `services/banners/*` | запросы/мутации баннеров, категорий, статистики, файлов, языков |
| `CComponent`/`BOe`/`QkComponent`/`Zm1Component`/`K3Component`/`Mg` | `components/ui/form-fields.tsx` | поля формы |
| `FnComponent` | `components/ui/Icon.tsx` | иконки |
| `L3Component` | `components/ui/Breadcrumb.tsx` | хлебные крошки |
| `T$`/`N$` | `services/banners/constants.ts` | типы страниц / позиции |
| `R1`/`OIe`/`PIe` | `services/banners/schema.ts` | zod-схемы |
| `WKe` | `assets/dashed-border.ts` | base64-рамка |

## Страницы / компоненты / хуки / сервисы

- **Страницы:** Login, Dashboard (заглушка), Advertising (список наборов), Advertising detail
  (баннеры набора). Роуты: `/` (вход), `/main/advetising`, `/main/advetising/:id/:name`,
  `/main/dashboard`. Написание `advetising` сохранено как в бэкенде/бандле.
- **Общие компоненты:** `Icon`, `Breadcrumb`, поля формы (`Field`, `TextField`,
  `PasswordField`, `SwitchField`, `SelectField`, `ImageUploadField`), `CategoryCard`,
  `DetailHeader`, `BannersTable`, `BannerFormModal`, `StatisticsModal`, `AdsModalHost`.
- **Хуки/сервисы:** `useLogin`; `useBannerCategories`, `useSaveBannerCategory`,
  `useDeleteBannerCategory`, `useBanners`, `useBanner`, `useSaveBanner`, `useUploadImage`,
  `useLanguages`, `useStatistics`; `useAuth`, `useAds`.
- **Эндпоинты (точно из бандла):** `POST /api/auth/login`;
  `GET|POST|PUT|DELETE /api/dev/banner-category/{view,create,update,delete}`;
  `GET /api/dev/banner/view` (список и `?id=`), `POST /api/dev/banner/{create,update}`
  (multipart); `POST /api/dev/image/upload`; `GET /api/dev/language/select`;
  `GET /api/dev/statistic/view`.
- **Контракты сохранены:** ключ `localStorage` `user` (профиль), очистка `TOKEN`/`USER_NAME`
  в интерсепторе 401/403 (сохранено как в оригинале, хотя провайдер пишет `user`),
  `withCredentials`, пагинация в URL (`page`, `size`), дефолтный размер страницы 10.

## Точно восстановлено vs. выведено

**Точно (exact):** все эндпоинты и формы запросов; zod-схемы (`loginSchema`, `categorySchema`,
`bannerFormSchema`); логика сборки `FormData` в `BannerFormModal` (сбор web/mobile изображений
по языкам, logo, фильтрация пустых полей); колонки таблицы и тексты; константы `PAGE_TYPES`/
`POSITIONS`; конфиг `QueryClient`; интерсептор axios; дерево провайдеров и роуты; палитра
(CSS-переменные `--primary-*`, `--gray-*`); 19 SVG-иконок; base64-рамка карточки; все
узбекские подписи интерфейса.

**Выведено (`TODO: inferred from build`):**
- `config/index.ts` — базовый URL в бандле был заинлайнен строкой; возвращён через
  `import.meta.env.VITE_API_BASE_URL` с тем же дефолтом (по правилу репозитория).
- TypeScript-типы доменных сущностей (`User`, `BannerCategory`, `BannerRow`, `BannerDetail`,
  `UploadedFile`, `Language`, `StatPoint`) — выведены из использования и zod-схем.
- `useLanguages` — побочный эффект выбора первого языка оставлен в `select` как в оригинале.
- `gray-50`/`gray-900` — точные hex не читались из переменных, подобраны (помечено в CSS).

## Проверка

- `npm run build` — успешно: один чанк `dist/assets/index-*.js` (~1.53 MB, gzip ~492 KB),
  CSS ~11.5 KB; sourcemap скрытый (`map` в `dist/`, не публикуется). Отсутствие
  code-splitting соответствует оригиналу (один JS-чанк).
- `npm run typecheck` (`tsc --noEmit`) — без ошибок (strict).
- Браузерный smoke-тест экрана входа выполнить не удалось: выбранный Chrome (Browser 1)
  работает на другом хосте, чем эта рабочая среда, и не достаёт до локального preview-сервера.
  Рендер подтверждён успешной сборкой; структуру можно проверить локально через
  `npm run preview` на той же машине.

## Команды

```bash
cd demo/ads
npm install
npm run dev        # нужен реальный бэкенд (services.marketplace.uysot.uz)
npm run build      # tsc --noEmit && vite build
npm run preview
npm run typecheck
```
