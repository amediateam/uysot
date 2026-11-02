# (chunk-short, export-or-local) -> (module, imported)
VENDOR={
 ('vendor-react','r'):('react','*'),('vendor-react','Z'):('react','default'),('vendor-react','R'):('react','*'),
 ('vendor-react','j'):('react/jsx-runtime','*'),('vendor-react','d'):('react-dom','default'),('vendor-react','c'):('react-dom','*'),
 ('vendor-react','h'):('react-dom','*'),('vendor-react','l'):('react-dom/client','*'),('vendor-react','e'):('react-is','*'),
 ('vendor-react','g'):('@/utils/interop','getDefaultExportFromCjs'),
 ('vendor-redux','P'):('react-redux','Provider'),('vendor-redux','R'):('@reduxjs/toolkit','current'),('vendor-redux','b'):('react-redux','useDispatch'),
 ('vendor-redux','c'):('@reduxjs/toolkit','createSlice'),('vendor-redux','d'):('@reduxjs/toolkit','createSelector'),('vendor-redux','e'):('redux-persist','persistStore'),
 ('vendor-redux','f'):('@reduxjs/toolkit','configureStore'),('vendor-redux','g'):('@reduxjs/toolkit','combineReducers'),('vendor-redux','h'):('react-redux','useStore'),
 ('vendor-redux','i'):('redux-persist/integration/react','PersistGate'),('vendor-redux','p'):('redux-persist','persistReducer'),
 ('vendor-redux','s'):('redux-persist/lib/storage','default'),('vendor-redux','u'):('react-redux','useSelector'),
 ('vendor-i18n','B'):('@tolgee/web','BackendFetch'),('vendor-i18n','D'):('@tolgee/web','DevTools'),('vendor-i18n','I'):('@tolgee/i18next','I18nextPlugin'),
 ('vendor-i18n','T'):('@tolgee/web','Tolgee'),('vendor-i18n','w'):('@tolgee/i18next','withTolgee'),('vendor-i18n','b'):('react-i18next','initReactI18next'),
 ('vendor-i18n','c'):('i18next-browser-languagedetector','default'),('vendor-i18n','i'):('i18next','default'),('vendor-i18n','r'):('react-i18next','Trans'),
 ('vendor-i18n','t'):('@/i18n/t','t'),('vendor-i18n','u'):('react-i18next','useTranslation'),
 ('vendor-router','B'):('react-router-dom','BrowserRouter'),('vendor-router','L'):('react-router-dom','Link'),('vendor-router','R'):('react-router-dom','Routes'),
 ('vendor-router','a'):('react-router-dom','useNavigate'),('vendor-router','b'):('react-router-dom','useSearchParams'),('vendor-router','c'):('react-router-dom','Route'),
 ('vendor-router','d'):('react-router-dom','useParams'),('vendor-router','u'):('react-router-dom','useLocation'),
 ('vendor-data','Q'):('react-query','QueryClientProvider'),('vendor-data','a'):('axios','default'),('vendor-data','b'):('react-query','useQueryClient'),
 ('vendor-data','c'):('react-query','useMutation'),('vendor-data','d'):('react-query','QueryClient'),('vendor-data','u'):('react-query','useQuery'),
 ('index-Ct6jfUeP','a'):('nuqs','useQueryStates'),('index-Ct6jfUeP','b'):('nuqs','parseAsInteger'),('index-Ct6jfUeP','p'):('nuqs','parseAsString'),('index-Ct6jfUeP','u'):('nuqs','useQueryState'),
 ('index-DnhTvTv2','S'):('@sentry/react','*'),('index-DnhTvTv2','a'):('@sentry/react','getRootSpan'),('index-DnhTvTv2','b'):('@sentry/react','getActiveSpan'),
 ('index-DnhTvTv2','c'):('@sentry/react','browserTracingIntegration'),('index-DnhTvTv2','d'):('@sentry/react','setTags'),('index-DnhTvTv2','e'):('@sentry/react','setUser'),
 ('index-DnhTvTv2','f'):('@sentry/react','breadcrumbsIntegration'),('index-DnhTvTv2','g'):('@sentry/react','getClient'),('index-DnhTvTv2','h'):('@sentry/react','addBreadcrumb'),
 ('index-DnhTvTv2','i'):('@sentry/react','init'),('index-DnhTvTv2','j'):('@sentry/react','addIntegration'),('index-DnhTvTv2','m'):('@sentry/react','makeFetchTransport'),
 ('index-DnhTvTv2','r'):('@sentry/react','replayIntegration'),('index-DnhTvTv2','s'):('@sentry/react','spanToJSON'),
}
for n in ['identify','Identify','init','setGroup','setUserId','track']: VENDOR[('index-Cvx5Xo9o',n)]=('@amplitude/analytics-browser',n)
# lib-юниты внутри app-чанков: (chunk, local) -> (module, imported)
M='index-B0UwuSD7'
LIBMAP={
 (M,'be'):('dayjs','default'),(M,'nr'):('antd','Button'),(M,'Mn'):('crypto-js/aes','default'),(M,'IF'):('crypto-js/enc-utf8','default'),
 (M,'ms'):('antd','Dropdown'),(M,'Gr'):('antd','Modal'),(M,'Eo'):('uid','uid'),(M,'mr'):('antd','Form'),(M,'c$'):('react-draggable','default'),
 (M,'JF'):('dayjs/plugin/localizedFormat','default'),(M,'X_'):('posthog-js','default'),(M,'oH'):('zustand','create'),(M,'Ea'):('antd','message'),
 (M,'wa'):('antd','Menu'),(M,'Ia'):('antd','Input'),(M,'zH'):('react-google-recaptcha','default'),(M,'cC'):('antd','Spin'),(M,'zF'):('query-string','default'),
 (M,'ki'):('antd','ConfigProvider'),(M,'z3'):('nuqs/adapters/react-router/v6','NuqsAdapter'),(M,'I3'):('@vercel/speed-insights/react','SpeedInsights'),
 (M,'ne'):('classnames','default'),(M,'xA'):('tailwind-merge','extendTailwindMerge'),(M,'hz'):('tailwind-merge','twMerge'),(M,'Ane'):('nuqs/adapters/react-router/v6','useOptimisticSearchParams'),
 (M,'D3'):('dayjs/plugin/timezone','default'),(M,'O3'):('dayjs/plugin/utc','default'),
 ('QrCode-CXeqeBv0','C'):('antd','Skeleton'),('QrCode-CXeqeBv0','Ee'):('lucide-react','ChevronDown'),
 ('ScheduleLottotron-BRWX7mEZ','kt'):('antd','Table'),
 ('sms-login-C3nOBmnF','H1'):('react-international-phone','PhoneInput'),('sms-login-C3nOBmnF','g1'):('libphonenumber-js','isValidPhoneNumber'),
 ('telegram-login-CUVBmqvA','qe'):('react-qr-code','default'),
 ('firebase-DBDQKvII','Ma'):('firebase/messaging','deleteToken'),('firebase-DBDQKvII','Oa'):('firebase/messaging','getToken'),('firebase-DBDQKvII','Ur'):('firebase/analytics','isSupported'),
 ('firebase-DBDQKvII','Vt'):('firebase/messaging','isSupported'),('firebase-DBDQKvII','dt'):('firebase/app','initializeApp'),('firebase-DBDQKvII','jr'):('firebase/analytics','getAnalytics'),
 ('firebase-DBDQKvII','ka'):('firebase/messaging','getMessaging'),
}
# динамические импорты чанков-библиотек
DYN_LIB={'index-Cvx5Xo9o':'@amplitude/analytics-browser','index-DnhTvTv2':'@sentry/react','index-DJQj0frt':'@formbricks/js'}
