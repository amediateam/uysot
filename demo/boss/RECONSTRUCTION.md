# Восстановление `boss.app.uysot.uz`

## Итог

- **Восстановлено всё приложение из публичной сборки.** Это небольшой каркас: вход, страница Forbidden и заглушка дашборда. Кода приложения около 10 КБ из 900 КБ бандла, остальное — библиотеки.
- **Source maps не найдены.** Проверены `*.map` рядом с JS и CSS, `sourceMappingURL`, заголовок `SourceMap`, `.vite/manifest.json`, `asset-manifest.json`. Все такие пути отдают `index.html` (SPA-fallback), поэтому код 200 ничего не значит. Следов Sentry нет.
- **Стек:** React 18.3.1 + Vite + TypeScript (SPA, **не Next.js**). React Router 6, Redux Toolkit 2 + redux-persist, TanStack Query 5, antd 5.18.3, axios 1.7.2, react-hook-form + zod, i18next + Tolgee 5.28.2, Tailwind 3.4.
- **Lazy loading в этой сборке нет** (ни одного `import()`, один JS-чанк), хотя задание это предполагает. Поэтому маршруты подключены напрямую, как в оригинале.
- **Закрытой части нет.** В отличие от `demo/app`, сервер отдаёт один и тот же `index.html` на всех путях.

## Запуск

```bash
cd demo/boss
cp .env.example .env     # и заполнить VITE_TOLGEE_API_KEY
npm ci
npm run dev              # http://localhost:5173
npm run build            # tsc --noEmit + vite build
```

`.env` и `_build/` не попадают в git: в них есть ключ Tolgee. Сборку можно скачать заново:
`node ../../scripts/fetch-build.mjs https://boss.app.uysot.uz/auth/login _build`.

## Проверка

Оригинальная сборка и восстановленная запускались рядом в headless Chrome на одних и тех же сценариях. Вся сеть подменялась заглушками: настоящий бэкенд не вызывался, учётные данные не использовались.

| Проверка | Результат |
|---|---|
| 19 сценариев: 9 маршрутов, валидация, вход, выход, перезагрузка, 401, неверная схема ответа, обрыв сети, сохранённый токен, refresh, смена языка | совпали все 19: путь, текст, запросы и их тела, `localStorage`, ошибки JS |
| Скриншоты страницы входа и неудачного входа | совпадают побайтно (SHA-256). Неудачный вход сравнивался через 3 с после отправки, 4 запуска на сборку: у оригинала 4 из 4 с одним хешем, у восстановленной 3 из 4 с тем же хешем. Единичные отличия есть и у оригинала при снимке через 0,7 с: идёт анимация |
| CSS | все 122 правила совпадают; порядок отличается (см. ниже) |
| `npm ci`, `npm run build`, `tsc` в режиме `strict` | проходят |
| `npm run dev` | страница входа открывается, ошибок в консоли нет |
| Живой сайт, одна обычная загрузка страницы | тот же текст на странице |

**Не проверено:** работа с настоящим бэкендом. Формат ответов API взят из zod-схем бандла. Тестовые ответы написаны по этим схемам, поэтому реальный сервер они не подтверждают.

**Отличия сборки от оригинала, на поведение не влияют:**
- JS меньше: 879 КБ против 902 КБ. Убран `store2`, неиспользуемый объект `config.app` вырезается tree-shaking, а версии части пакетов подобраны примерно.
- Порядок CSS: `.wrapper` из Icon стоит после Loading, а блок переменных `--tw-*` — перед preflight. Селекторы не пересекаются.

## Дерево папок

```
demo/boss/
  index.html  package.json  tsconfig.json  vite.config.ts
  tailwind.config.js  postcss.config.js  .env.example
  public/                  bg_new.jpg, vite.svg
  src/
    main.tsx               точка входа, дерево провайдеров
    bootstrap.ts           запуск i18n и http-клиента
    vite-env.d.ts
    components/
      auth/                AuthProvider.tsx, LoginForm.tsx
      form/                TextField.tsx, PasswordField.tsx
      icon/                Icon.tsx, Icon.module.css, icons/
      loading/             Loading.tsx, Loading.module.css
    constants/config.ts
    hooks/                 useAuth.ts, useQueryWithCallbacks.ts
    i18n/index.ts
    pages/
      app/dashboard/DashboardPage.tsx
      auth/forbidden/ForbiddenPage.tsx
      auth/login/          LoginPage.tsx, Login.module.css,
                           components/LoginFields.tsx, LanguageSwitcher.tsx
    router/                index.tsx, GuardedOutlet.tsx
    services/
      http.ts  queryClient.ts  errorSchema.ts
      auth/                schemas.ts, queryKeys.ts
    store/                 index.ts, auth/slice.ts
    styles/index.css
    utils/cn.ts
```

Папки `layouts` и `assets` не созданы: в сборке для них нет кода. Проп `layout` у guard-компонента есть, но нигде не передаётся. Фон подключён абсолютным путём `/bg_new.jpg`, поэтому лежит в `public/`.

## Карта модулей

Символы — минифицированные имена из `index-D22FsSKH.js`.

| Символ | Что это | Файл |
|---|---|---|
| `pN`, `ax` | env и конфиг | `constants/config.ts` |
| `hS`, `uh` | обёртка над axios | `services/http.ts` |
| `MD` | инициализация Tolgee и i18next | `i18n/index.ts` |
| `L4`, `AR`, `F4`, `D4`, `z4` | auth-слайс, persist, transform | `store/auth/slice.ts` |
| `V4`, `H4`, `U4`, `$S`, `W4`, `PS`, `Id` | store, persistor, хуки | `store/index.ts` |
| вызовы `MD(...)`, `uh.init(...)` | запуск | `bootstrap.ts` |
| `gG` | ключи запросов | `services/auth/queryKeys.ts` |
| `mG`, `vG`, `F1`, `Gre` | zod-схемы | `services/auth/schemas.ts` |
| `Xre` | схема ошибки API | `services/errorSchema.ts` |
| `Rne` | QueryClient | `services/queryClient.ts` |
| `Bte` / `Vte` | поля формы | `components/form/TextField.tsx` / `PasswordField.tsx` |
| `Hte`, `Ute`, `Ere` | иконки | `components/icon/` |
| `xre` | `twMerge(classNames())` | `utils/cn.ts` |
| `Lre` | лоадер | `components/loading/Loading.tsx` |
| `YP` | `useQuery` с onSuccess/onError | `hooks/useQueryWithCallbacks.ts` |
| `Kre` | форма входа | `components/auth/LoginForm.tsx` |
| `Xw` | хук авторизации | `hooks/useAuth.ts` |
| `Qre` | загрузка сессии | `components/auth/AuthProvider.tsx` |
| `e$` | guard маршрутов | `router/GuardedOutlet.tsx` |
| `Zre` | дашборд | `pages/app/dashboard/DashboardPage.tsx` |
| `Yre` | Forbidden | `pages/auth/forbidden/ForbiddenPage.tsx` |
| `Pne` | страница входа (разбита на 3 файла) | `pages/auth/login/` |
| `$ne` | маршруты | `router/index.tsx` |
| последний `createRoot(...)` | дерево провайдеров | `main.tsx` |

Остальное в бандле — библиотеки, они заменены зависимостями из npm. Сборочная обвязка удалена.

## Перечень

**Страницы:** `LoginPage`, `ForbiddenPage`, `DashboardPage`.

**Маршруты:** `/auth/login`, `/auth/forbidden`, `/app/dashboard`. Остальные пути перенаправляются.

**Общие компоненты:** `AuthProvider`, `LoginForm`, `TextField`, `PasswordField`, `Icon`, `Loading`, `GuardedOutlet`.

**Хуки:** `useAuth`, `useQueryWithCallbacks`, `useAppDispatch`, `useAppSelector`.

**Утилиты:** `cn`.

**Сервисы:** `http`, `queryClient`, `authQueryKeys`, zod-схемы.

**API:** `POST /v1/auth/sign-in/dev`, `GET /v1/auth/me`, `GET /v1/auth/refresh`.

**Конфиги:** `constants/config.ts`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `.env.example`.

**Переменные окружения:** `VITE_BASE_URL`, `VITE_TOLGEE_API_URL`, `VITE_TOLGEE_API_KEY`, `VITE_TOLGEE_PROJECT_ID`, `VITE_TOLGEE_BACKEND_FETCH` (в сборке не задана).

## Точно и предположительно

**Точно (взято из бандла):** логика всех компонентов, маршруты, API-пути и тела запросов, zod-схемы, ключи `localStorage`, настройки persist и i18n, тема antd, классы и правила CSS, версии react, antd, axios, Tolgee.

**Предположительно:**
- Все пути и имена файлов, компонентов и локальных переменных. Исходные имена в сборке не сохранились.
- TypeScript-типы написаны заново, по zod-схемам и использованию.
- Версии в `package.json`, кроме перечисленных выше. Подобраны по набору возможностей и дате остальных пакетов (около июня 2024). `zod` 3.23 определена по возможностям. Tailwind: версии 3.4.10–3.4.13 дают те же правила, выбрана 3.4.13.
- `tailwind.config.js`: два цвета `gray` выведены из preflight, `safelist` — из классов, которых нет в JS.
- Имена CSS-файлов, а также запись `:global()`: в сборке эти классы просто не хешированы.
- Разбиение страницы входа на `LoginFields` и `LanguageSwitcher` сделано при восстановлении.

Места в коде помечены `// TODO: inferred from build`.

**Убрано:** `store2` 2.14.3. Он есть в бандле, но его никто не использует.

## Особенности оригинала

Всё это сохранено намеренно, потому что поведение важнее красоты. Каждый пункт проверен на оригинальной сборке, кроме отмеченных.

1. **Токен не отправляется.** `configFn` кладёт `Authorization` в корень конфига axios, а не в `headers`. В запросах заголовка нет, поэтому авторизация работает только если сервер сам ставит cookie (`withCredentials: true`).
2. **Вечный лоадер.** Если токен сохранён, а `/v1/auth/me` вернул ошибку, `isFetched` остаётся `false`. Пользователь навсегда видит анимацию `Uysot`. Это прямое следствие пункта 1, если сервер ждёт Bearer-токен.
3. **Падение при обрыве сети.** Без ответа сервера промис отклоняется с `undefined`, затем `mutation.error.message` бросает `TypeError`. Error boundary нет, страница становится пустой.
4. **Ошибка входа без текста.** `handleError` отклоняет промис объектом `response`, у которого нет `message`, поэтому блок ошибки пуст. По этой же причине ветка `AxiosError` в `queryClient` не срабатывает, и `message.error` никогда не показывается.
5. **Нет переводов.** В production не подключён `BackendFetch`, поэтому на сайте видны ключи вроде `login.Login` (подтверждено на живом сайте: запросов к Tolgee нет).
6. **Нет страницы сброса пароля.** Ссылка ведёт на `/auth/reset-password`, такого маршрута нет, происходит возврат на вход.
7. **CSS-переменные не определены.** `--white`, `--manhattan`, `--error-background` и другие нигде не заданы, поэтому карточка входа прозрачная.
8. **Отладочный вывод.** `console.log("mutation = ", ...)` пишется в консоль при каждом рендере формы. Объект содержит введённые логин и пароль в поле `variables` (вывод из кода, отдельно не проверялось).
9. **`isStaging`** равен всему объекту `import.meta.env`, то есть всегда truthy. Нигде не используется.

## Безопасность

- **Ключ Tolgee опубликован.** `tgpak_…` лежит в открытом бандле. В production он не используется, потому что запросов к Tolgee нет. Ключ стоит отозвать и убрать из production-сборки. Сюда он попал только в локальный `.env`, который игнорируется git.
- **Вход идёт через `/v1/auth/sign-in/dev`**, причём production-сайт обращается к бэкенду `serv.app.uysotdev.aws.softex.uz`. Похоже, что это dev-эндпоинт и dev-сервер. Стоит проверить, так ли задумано.

## Что дальше

1. Решить, какие особенности из списка выше исправлять. Лучше начать с пунктов 1–3.
2. Проверить вход на настоящем бэкенде.
3. Если нужны переводы, включить `VITE_TOLGEE_BACKEND_FETCH` и подключить статические файлы.
