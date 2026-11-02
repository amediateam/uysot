// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (162)
function ie(e, t) {
  for (const r in e) {
    e[r] = t + e[r];
  }
  return e;
}
const ae = {
  AUTH: "/v1/auth",
  HOUSE: "/v1/house",
  FLAT: "/v1/flat",
  FLAT2: "/v2/flat",
  ENTRANCE: "/v2/entrance",
  TABLE: "/v1/table",
  BOOKING: "/v1/booking",
  CLIENT: "/v1/client",
  ADDRESS: "/v1/address",
  CONTRACT: "/v1/contract",
  FILES: "/v1/files",
  DEBT: "/v1/debt",
  EMPLOYEE: "/v1/employee",
  BUILDER: "/v1/builder",
  BRANCH: "/v1/branch",
  SMS_TEMPLATE: "/v1/sms-template",
  SMS_CONFIG: "/v1/sms-config",
  COMPANY_CONFIG: "/v1/company-config",
  PLAY_MOBILE_CONF: "/v1/sms-system-conf",
  DISCOUNT: "/v1/discount",
  BUILDING: "/v1/building",
  BUILDING2: "/v2/building",
  COMPANY: "/v1/company",
  DEV: "/v1/dev",
  SHOWROOM: "/v1/shourum",
  TELEGRAM: "/v1/telegram",
  AMO_CRM: "/v1/amo-crm",
  COMPANY_AMO_CRM_CONFIG: "/v1/company-amoCrm-config",
  MERCHANT: "/v1/merchant",
  HOUSE_SALE_CRM: "/v1/home-sale-crm",
  WEBSITE: "/v1/website",
  STAFF: "/v1/staff",
  EMPLOYEE_KPI: "/v1/employee-kpi",
  ACCOUNT: "/v1/account",
  SUPPORT_ACCESS: "/v1/support-access",
  MOBILE: "/v1/mobile",
  MOBILE_VERSION_TWO: "/v2/mobile",
  MOBILE_VERSION_THREE: "/v3/mobile",
  TASK: "/v1/task",
  TABLE_COLOR: "/v1/table-color",
  AUTO_TASK_SETTING: "/v1/auto-task-setting",
  PIPE: "/v1/pipe",
  LEAD: "/v1/lead",
  CRM: "/v1/crm",
  PIPE_STATUS: "/v1/status",
  TAG: "/v1/tag",
  LEAD_TASK_TYPE: "/v1/lead-task-type",
  LEAD_TASK: "/v1/lead-task",
  LEAD_NOTE: "/v1/lead-note",
  TASK_NOTE: "/v1/task/note",
  CHAT_MESSAGE: "/v1/chat-message",
  TELEGRAM_AND_WEB: "/v1/telegram-and-web",
  MOI_ZVONKI_CONFIG: "/v1/moi-zvonki-config",
  MOI_ZVONKI_SEND_REQUEST: "/v1/moi-zvonki-send-request",
  MOI_SMS_TEMPLATE: "/v1/moi-sms-template",
  NOTIFICATION: "/v1/notification",
  REASONS_FOR_REFUSAL: "/v1/reasons-for-refusal",
  ONLINE_PBX: "/v1/online-pbx",
  BOOKING_LEAD_FLAT: "/v1/booking-lead-flat",
  MARKETPLACE: "/v1/marketplace",
  PAYMENT: "/v1/payment",
  STATISTICS: "/v1/statistics",
  CASH: "/v1/cash",
  CARD: "/v1/card",
  CLIENT_MESSAGE_TEMP: "/v1/client-message-temp",
  UYQUR: "/v1/uyqur",
  RESET_PASSWORD: "/v1/reset-password",
  CURRENCY: "/v1/currency",
  LEAD_NOT_TASK_CONF: "/v1/lead-not-task-conf",
  WIDGET: "/v1/widget",
  DOWNLOAD_PDF: "/v1/shourum/new-design",
  ACTIVE_SESSION: "/v1/active/session",
  REPORT_CONFIG: "/v1/report-config",
  MONETARY: "/v1/monetary",
  REALTOR_CONFIG: "/v1/realtor-config",
  CALL_HITORY: "/v1/call-history",
  MY_HOME_CONFIG: "/v1/my-home/config",
};
const Q$ = {
  INDEX: "/",
  SYSTEM_COLOR: "/system-color",
  COMPANY_LOGO: "/company-logo",
  CONTRACT_NUMBER_PATTERN: "/contract-number-pattern",
  PAYMENT_NUMBER_PATTERN: "/payment-number-pattern",
  CONTRACT_NUMBER_PATTERN_ANNOTATIONS: "/contract-number-pattern-annotations",
  PAYMENT_NUMBER_PATTERN_ANNOTATIONS: "/payment-number-pattern-annotations",
  DOCUMENT_TEMPLATE: "/document-template",
  DOCUMENT_TEMPLATE_COMPACT: "/document-template/compact",
  DOCUMENT_TEMPLATE_CONTRACT: "/document-template/contract",
  DOCUMENT_TEMPLATE_CUSTOM: "/document-template/custom",
  SALE_CRM_TAG: "/sale-crm-tag",
  EMPLOYEE_CHANGE_PASSWORD_DATE: "/employee-change-password-date",
  SALE_AND_PURCHASE_ANNOTATIONS: "/sale-and-purchase-number-pattern-annotations",
  REFERENCE_ANNOTATIONS: "/reference-number-pattern-annotations",
  REFERENCE_PATTERN: "/reference-number-pattern",
  SALE_AND_PURCHASE_PATTERN: "/sale-and-purchase-number-pattern",
};
ie(Q$, ae.COMPANY_CONFIG);
const Z$ = {
  INDEX: "/",
};
ie(Z$, ae.SMS_CONFIG);
const e6 = {
  INDEX: "/",
};
ie(e6, ae.SMS_TEMPLATE);
const t6 = {
  SIGN_IN: "/sign-in",
  SIGN_IN_DEV: "/sign-in/dev",
  OTP_SEND: "/otp/send",
  OTP_VERIFY: "/otp/verify",
  OTP_SELECT: "/otp/select",
  TELEGRAM_SESSION: "/telegram/session",
  TELEGRAM_REDEEM: "/telegram/redeem",
  TELEGRAM_VERIFY: "/telegram/verify",
  TELEGRAM_SELECT: "/telegram/select",
  REFRESH: "/refresh",
  LOGOUT: "/logout",
  ROLE: "/role",
  ROLE_COMPANY: "/role/company",
  PERMISSION: "/permission",
  SAP_HANDOFF: "/sap/handoff",
};
const Jt = ie(t6, ae.AUTH);
const r6 = {
  EXTRA: "/extra",
  COMPACT: "/compact",
  INDEX: "/",
  INFO: "/info",
  ON_SALE: "/on-sale",
  COMPLETENESS: "/completeness",
  FOR_SHOWROOM: "/for-showroom",
};
ie(r6, ae.HOUSE);
const n6 = {
  INDEX: "/",
  INIT: "/init",
  EDITOR: "/editor",
  FILTER: "/filter",
  FILTER_EXCEL: "/filter/excel",
  FILTER_PARAMS: "/filter/params",
  BY_BOOKING: "/by-booking",
  INFO: "/info",
  MORE: "/more",
  DISCOUNT: "/discount",
  FIELD: "/field",
  CHANGE_PRICE: "/change-price",
  FILTER_SUMMARY_EXCEL: "/filter/summary/excel",
  FILTER_SUMMARY_EXCEL_BETA: "/filter/summary/excel/beta",
  LAST_CHANGE_PRICE: "/last-flat-price-changes-date",
  UNDO_PRICE: "/undo-price",
};
ie(n6, ae.FLAT);
const i6 = {
  INDEX: "/",
  INIT: "/init",
  CHANGE_PRICE: "/change-price",
  ALL: "/all",
};
ie(i6, ae.FLAT2);
const a6 = {
  INDEX: "/",
  INIT: "/init",
  DUPLICATE: "/duplicate",
};
ie(a6, ae.ENTRANCE);
const o6 = {
  INDEX: "/",
  ALL: "/all",
};
ie(o6, ae.TABLE);
const s6 = {
  INDEX: "/",
  CANCEL_REASON: "/cancel/reason",
  FILTER: "/filter",
  FILTER_EXCEL: "/filter/excel",
  NATURAL: "/natural",
  JURIDICAL: "/juridical",
  CANCEL: "/cancel",
};
ie(s6, ae.BOOKING);
const l6 = {
  INDEX: "/",
  NATURAL: "/natural",
  JURIDICAL: "/juridical",
  BOOKING: "/booking",
  BALANCE: "/balance",
  VIEW: "/view",
  FILTER: "/filter",
  FILTER_EXCEL: "/filter/excel",
  SEND_MESSAGE: "/send-message",
  SEND_MESSAGE_FILTER_EXCEL: "/send-message/filter/excel",
  CLIENT_PAYMENT_TEMPLATE: "/client-payment/template",
  CHANGES: "/changes",
  CHANGES_JURIDICAL: "/changes/juridical",
  CHANGES_NATURAL: "/changes/natural",
  SEARCH: "/search",
};
ie(l6, ae.CLIENT);
const c6 = {
  INDEX: "/",
  TEMP: "/temp",
  DISTRICT_ID: "/districtId",
  CITY_ID: "/cityId",
  CITY: "/city",
  DISTRICT: "/district",
};
ie(c6, ae.ADDRESS);
const u6 = {
  INDEX: "/",
  FILTER: "/filter",
  FILTER_EXCEL: "/filter/excel",
  FILTER_EXCEL_SUMMARY: "/filter/excel/summary/v2",
  TRANSFER: "/transfer",
  MONTHLY_PAYMENT: "/monthly-payment",
  AMOUNT: "/amount",
  TEMPLATE: "/template",
  PAYMENT: "/payment",
  PAYMENT_FILTER: "/payment/filter",
  PAYMENT_FILTER_EXCEL: "/payment/filter/excel",
  PAYMENT_FILTER_SUM: "/payment/filter/sum",
  CANCEL: "/amount/cancel",
  FOR_PAYMENT: "/for-payment",
  CHANGES: "/changes",
  CHANGES_EMPLOYEE: "/changes/employee",
  CLIENT: "/client",
  CURRENT_NUMBER: "/current-number",
  staff: "/staff",
  PAYMENT_CURRENT_NUMBER: "/payment/current-number",
  FIELD: "/field",
  EMPLOYEE: "/employee",
};
ie(u6, ae.CONTRACT);
const d6 = {
  INDEX: "/",
  DEVELOPER: "/developer",
  UPLOAD_AUDIO: "/upload-audio",
};
ie(d6, ae.FILES);
const f6 = {
  INDEX: "/",
  EXCEL: "/excel",
  SEND_MESSAGE: "/send-message",
  IN_DATE_EXCEL: "/in-date/excel",
  IN_DATE_EXCEL_BETA: "/in-date/excel/beta",
};
ie(f6, ae.DEBT);
const h6 = {
  INDEX: "/",
  FILTER: "/filter",
};
ie(h6, ae.EMPLOYEE);
const p6 = {
  INDEX: "/",
  COMPACT: "/compact",
};
ie(p6, ae.BUILDER);
const v6 = {
  INDEX: "/",
  COMPACT: "/compact",
  DEV: "/dev/compact",
};
ie(v6, ae.BRANCH);
const g6 = {
  INDEX: "/",
  SEND_MESSAGES: "/send-messages",
};
ie(g6, ae.CLIENT);
const m6 = {
  INDEX: "/",
  ORIGINATOR: "/originator",
  HOUSE: "/house",
};
ie(m6, ae.PLAY_MOBILE_CONF);
const y6 = {
  INDEX: "/",
  NEW: "",
  MAX_DISCOUNT: "/config",
};
ie(y6, ae.DISCOUNT);
const _6 = {
  INDEX: "/",
  NEW: "",
  COMPACT: "/compact",
  ALL: "/all",
};
ie(_6, ae.BUILDING);
const b6 = {
  INDEX: "/",
  NEW: "",
  ORDER: "/order",
  ORDER_FLAT: "/order/flat",
  CHANGE_PRICE: "/change-price",
  BASEMENT: "/basement",
  FLOOR: "/floor",
  DUPLICATE: "/duplicate",
};
ie(b6, ae.BUILDING2);
const S6 = {
  INDEX: "/",
  COMPACT: "/compact",
};
ie(S6, ae.FLAT);
const E6 = {
  MAIN: "/",
  INDEX: "/filter",
  COMPACT: "/compact",
  SURCHARGE: "/surcharge",
  EXPIRE_DATE: "/expiry-date",
  EXTRA_DAY: "/extra-day",
};
ie(E6, ae.COMPANY);
const C6 = {
  INDEX: "/",
  EMPLOYEE: "/employee",
  EMPLOYEE_ROLE_COMPANY: "/employee/role/company",
};
ie(C6, ae.DEV);
const x6 = {
  INDEX: "/",
  PDF_PLAN_TABLE: "/pdf-plan-table",
  PDF_PLAN_IMAGE: "/pdf-plan-image",
  FLAT_DATA: "/flat-data",
};
ie(x6, ae.SHOWROOM);
const w6 = {
  INDEX: "/",
  BOT: "/bot",
  BOT_STOP: "/bot/stop",
  BOT_START: "/bot/start",
  BOT_BUTTON: "/bot/button",
  BOT_FAQ: "/bot/faq",
  BOT_SEND_MESSAGE_USERS: "/bot/send-message-users",
  BOT_FOR_MESSAGE: "/bot/for-message",
  BOT_CHAT: "/bot/chats",
};
ie(w6, ae.TELEGRAM);
const P6 = {
  AUTH_EDIT: "/auth/edit",
  AUTH_CREATE: "/auth/create",
  AUTH_GET_BY: "/auth/get-by",
  AUTH_CHANGE_STATUS: "/auth/change-status",
};
ie(P6, ae.AMO_CRM);
const I6 = {
  LEAD_URL: "/lead-url",
  LEAD_TEXT_AREA: "/lead-text-area",
};
ie(I6, ae.COMPANY_AMO_CRM_CONFIG);
const A6 = {
  APELSIN: "/apelsin",
};
ie(A6, ae.MERCHANT);
const T6 = {
  ALL_DATA_BY_FILTER: "/all-data-by-filter",
  FLAT_DATA_BY: "/flat-data-by",
  X_AUTH_TOKEN: "/x-auth-token",
  CHECK_PERMISSION_DELAY: "/check-permission-delay",
};
ie(T6, ae.HOUSE_SALE_CRM);
const R6 = {
  GET_ALL_HOUSE: "/get-all-house",
  BLOCK_GET_ALL_FLAT_BY_FILTER: "/block/get-all-flat-by-filter",
  BLOCK_FLAT_ALL_DATA: "/block/flat-all-data",
  BLOCK_STATISTIC: "/block-statistic",
  BLOCK_FLOOR_STATISTIC: "/block-floor-statistic",
  BLOCK_FLAT_DATA: "/block-flat-data",
  FLAT_SHOURM_PDF: "/flat-shourum-pdf",
};
ie(R6, ae.WEBSITE);
const O6 = {
  INDEX: "/",
  FILTER: "/filter",
};
ie(O6, ae.STAFF);
const N6 = {
  INDEX: "/",
  EDIT_CONSTANT_BONUS_AMOUNT: "/edit-constant-bonus-amount",
  EDIT_ARGUMENT: "/edit-argument",
  CREATE_KPI_PART: "/create-kpi-part",
  CHANGES_STATUS: "/change-status",
  ALL_SETTING: "/all-setting",
  DELETE: "/delete",
};
ie(N6, ae.EMPLOYEE_KPI);
const k6 = {
  INDEX: "/",
  INFO: "/info",
  PASSWORD: "/password",
};
const Oz = ie(k6, ae.ACCOUNT);
const M6 = {
  INDEX: "/",
  INDEBTEDNESS_MONTH: "/indebtedness/month",
  INDEBTEDNESS_ALL: "/indebtedness/all",
  CLIENT_BALANCE: "/client/balance",
  FLAT_SOLD: "/flat/sold",
  FLAT_BLANK: "/flat/blank",
  CLIENT_BOOKING: "/client/booking",
  PAYMENT: "/payment",
  PAYMENTS: "/payments",
  DEBT: "/debt",
  GRAPHIC: "/debt/stats",
  HOUSE: "/house",
  CONTRACT_DELAY: "/contract/delay",
  CONTRACT_CLIENT: "/contract/client",
  CONTRACT_PAYMENT_DELAY: "/contract/payment/delay",
  SALE_STATS: "/sale/stats",
  PAYMENT_TYPE: "/payment/type",
  GET_FLAT_AREA: "/flat-area",
};
ie(M6, ae.MOBILE);
const D6 = {
  INDEX: "/",
  HOUSE_TOTAL_CAPITAL: "/house/total-capital",
  HOUSE_CAPITAL: "/house/capital",
  HOUSE_CAPITAL_SPLIT: "/house/capital/split",
  PAYMENT_CLIENTS: "/payment/clients",
  CONTRACT_HOUSE: "/contract/house",
  CONTRACT_PREPAYMENT_HOUSES: "/contract/prepayment/house",
};
ie(D6, ae.MOBILE_VERSION_TWO);
const L6 = {
  INDEX: "/",
  CONTRACT_HOUSE: "/contract/house",
  PER_AREA_AVG_PRICE: "/house/per-area-avg-price",
};
ie(L6, ae.MOBILE_VERSION_THREE);
const F6 = {
  INDEX: "/",
  SIMPLE: "/simple",
  PAYMENT: "/payment",
  NOTE: "/note",
  CLOSE: "/close",
  EMPLOYEE: "/employee",
  CONTRACT_INFO: "/contract-info",
  CONTRACT: "/contract",
  CONTRACT_EVENT: "/contract-event",
  FILTER: "/notify/filter",
  FILTER_CRM: "/filter",
  COUNT: "/notify/count",
};
ie(F6, ae.TASK);
const $6 = {
  INDEX: "/",
};
ie($6, ae.TABLE_COLOR);
const j6 = {
  INDEX: "/",
};
ie(j6, ae.AUTO_TASK_SETTING);
const B6 = {
  INDEX: "/",
  CREATE: "/create",
  ALL: "/all-by-permission",
};
ie(B6, ae.PIPE);
const V6 = {
  INDEX: "",
  SAVE: "/save",
  FILTER: "/filter",
  CHANGE_STEP: "/change-step",
  EMPLOYEE: "/employee/all",
  NOT_TASK_EMPLOYEE: "/not-task/employee",
  DATA: "/data",
  TABLE_FILTERS: "/table-filter",
  TABLE_FILTERS_LEAD_IDS: "/table-filter/lead-ids",
  GROUP_ACTION: "/group-action",
  IMPORT: "/import",
  IMPORT_EXAMPLE: "/import-example",
  EXPORT: "/export",
  CHAT_BOX: "/chat-box",
  EXTRA: "/extra",
  LEAD_BY: "/by",
  GROUP: "/group-action",
  RECOVERING_DELETED: "/recovering-deleted",
  SEARCH: "/search",
  SEARCH_V2: "/search/v2",
};
ie(V6, ae.LEAD);
const U6 = {
  INDEX: "/",
  FIELD: "/field",
  FACEBOOK_ACCOUNT: "/facebook/account",
  FACEBOOK_REDIRECT_URL: "/facebook/redirect-url",
  FACEBOOK_PAGE_PIPE: "/facebook/page-pipe",
  FACEBOOK_PAGES: "/facebook/pages",
  FACEBOOK_LEAD_FORM: "/facebook/lead-form",
  FACEBOOK_LEAD_FORM_FIELD: "/facebook/lead-form/field",
  FACEBOOK_LEAD_FORM_PIPE_STATUS: "/facebook/lead-form/pipe-status",
  FACEBOOK_APP_PIPE: "/facebook/app-pipe",
  TRIGGERS_TASK_TRIGGER: "/triggers/task-trigger",
  TRIGGERS_PIPE_STATUS_TRIGGER: "/triggers/pipe-status-trigger",
  TRIGGERS_MANAGER_TRIGGER: "/triggers/manager-trigger",
  TRIGGERS_PIPE_STATUS_TRIGGERS: "/triggers/pipe-status-triggers",
  CALL_BROJECT_TRIGGER: "/triggers/call-trigger",
  ONLINE_PBX_CALLBACK_TRIGGER: "/triggers/pbx-callback-trigger",
  LEAD_FIELD_TRIGGER: "/triggers/field-setter-triggers",
  TRIGGERS: "/triggers",
  TRIGGERS_TAG: "/triggers/tag",
  TRIGGERS_FIELD: "/triggers/field",
  TRIGGERS_EMPLOYEE: "/triggers/employee",
  OFFLINE_MEET: "/offline-meet",
};
ie(U6, ae.CRM);
const H6 = {
  INDEX: "/",
  SAVE: "/save",
  ALL: "/all",
};
ie(H6, ae.PIPE_STATUS);
const z6 = {
  INDEX: "/",
  ALL: "/all",
};
ie(z6, ae.TAG);
const W6 = {
  INDEX: "/",
  ALL: "/all",
  SAVE: "/save",
};
ie(W6, ae.LEAD_TASK_TYPE);
const q6 = {
  INDEX: "/",
  SAVE: "/save",
  CLOSE: "/close",
  NOT_CLOSED: "/not-closed",
  FILTER: "/filter",
  FILTER_CALENDAR: "/filter-calendar",
  COUNT: "/count",
};
ie(q6, ae.LEAD_TASK);
const G6 = {
  INDEX: "/",
};
ie(G6, ae.LEAD_NOTE);
const Y6 = {
  INDEX: "/",
};
ie(Y6, ae.TASK_NOTE);
const K6 = {
  INDEX: "/",
  COUNT_NOT_READ: "/count/not-read",
};
ie(K6, ae.CHAT_MESSAGE);
const X6 = {
  INDEX: "/",
};
ie(X6, ae.TELEGRAM_AND_WEB);
const J6 = {
  INDEX: "/",
  RECONNECT: "/reconnect",
  EMPLOYEE: "/employee",
  SET_EMPLOYEE: "/set-employee",
  API_KEY: "/api-key",
};
ie(J6, ae.MOI_ZVONKI_CONFIG);
const Q6 = {
  INDEX: "/",
  SEND_SMS: "/send-sms",
  MAKE_CALL: "/make-call",
  EMPLOYEE: "/employee",
};
ie(Q6, ae.MOI_ZVONKI_SEND_REQUEST);
const Z6 = {
  INDEX: "/",
};
ie(Z6, ae.MOI_SMS_TEMPLATE);
const e5 = {
  INDEX: "/",
  FILTER: "/filter",
  ME: "/me",
  ME_COUNT: "/me/count",
  ME_READ_ALL: "/me/read-all",
};
ie(e5, ae.NOTIFICATION);
const t5 = {
  INDEX: "/",
};
ie(t5, ae.REASONS_FOR_REFUSAL);
const r5 = {
  INDEX: "/",
  SET_EMPLOYEE: "/set-employee",
  PIPE_SETTING: "/pipe-setting",
  AUTH: "/auth",
  EMPLOYEE: "/employee",
  CONTACT: "/contact",
  CALL_HISTORY: "/call-history",
  CAN_MAKE_CALL: "/can-make-call",
  REFRESH_KEY: "/refresh-key",
};
ie(r5, ae.ONLINE_PBX);
const n5 = {
  INDEX: "/",
};
ie(n5, ae.BOOKING_LEAD_FLAT);
const i5 = {
  INDEX: "/",
  HOUSES: "/houses",
};
ie(i5, ae.MARKETPLACE);
const a5 = {
  INDEX: "/",
  TYPE_CONFIG: "/type/config",
};
ie(a5, ae.PAYMENT);
const o5 = {
  INDEX: "/",
  PLAN_FACT_PIPE: "/plan-fact-pipe",
  PLAN_FACT_COST: "/plan-fact-cost",
  PLAN_FACT_PIPE_COMPANY_FIELD: "/plan-fact-pipe/company-field",
  PLAN_FACT_COST_COMPANY_LEAD_FIELD: "/plan-fact-cost/company-lead-field",
  PLAN_FACT_PIPE_ONE_LEAD_COST: "/plan-fact-pipe/one-lead-cost",
  PLAN_FACT_PIPE_PIPE: "/plan-fact-pipe/pipe",
  CUSTOMER_FLOW: "/customer-flow",
};
ie(o5, ae.STATISTICS);
const s5 = {
  INDEX: "",
};
ie(s5, ae.CASH);
const l5 = {
  INDEX: "",
  STYLE: "/style",
  STEP: "/step",
  PAYME_VERIFY: "/payme/verify",
  PAYME_ACTIVATE: "/payme/activate",
  MY_UZCARD_ACTIVATE: "/my-uzcard/activate",
  PAYME: "/payme",
  MY_UZCARD: "/my-uzcard",
  MY_UZCARD_VERIFY: "/my-uzcard/verify",
};
ie(l5, ae.CARD);
const c5 = {
  INDEX: "/",
  FIELDS: "/fields",
};
ie(c5, ae.CLIENT_MESSAGE_TEMP);
const u5 = {
  INDEX: "/",
  BUILDERS: "/builders",
};
ie(u5, ae.UYQUR);
const d5 = {
  INDEX: "/",
  VERIFY_CODE: "/verify-code",
  SEND_CODE: "/send-code",
  CHANGE_PASSWORD: "/change-password",
};
const Nz = ie(d5, ae.RESET_PASSWORD);
const f5 = {
  INDEX: "/",
  GLOBAL: "/global",
  BASIC: "/basic",
};
ie(f5, ae.CURRENCY);
const h5 = {
  INDEX: "/",
  REFRESH_REMIND_TIME: "/refresh-remind-time",
};
ie(h5, ae.LEAD_NOT_TASK_CONF);
const p5 = {
  INDEX: "",
};
ie(p5, ae.WIDGET);
const v5 = {
  INDEX: "",
  V2: "/v2",
};
ie(v5, ae.DOWNLOAD_PDF);
const g5 = {
  INDEX: "",
};
ie(g5, ae.ACTIVE_SESSION);
const m5 = {
  INDEX: "/",
};
ie(m5, ae.REPORT_CONFIG);
const y5 = {
  CONFIG: "/config",
};
ie(y5, ae.MONETARY);
const _5 = {
  PAYMENT: "/payment",
  PAYMENT_FILTER: "/payment/filter",
  PAYMENT_FILTER_COUNT: "/payment/filter/count",
  PAYMENT_CREATE: "/payment/create",
  PAYMENT_CONTRACT: "/payment/contract",
  PAYMENT_ACCEPT: "/payment/accept",
  PAYMENT_ROLLBACK: "/payment/rollback",
};
ie(_5, ae.MONETARY);
const b5 = {
  INDEX: "/",
  CHECH_PERMISSION: "/check-permission/",
};
ie(b5, ae.REALTOR_CONFIG);
const S5 = {
  INDEX: "/",
  GET_RECORD: "/get-record",
};
const E5 = {
  INDEX: "",
  HOME_CONFIG: "/my-home/config",
};
ie(E5, ae.MY_HOME_CONFIG);
ie(S5, ae.CALL_HITORY);
const C5 = {
  INDEX: "",
  SESSIONS: "/sessions",
};
ie(C5, ae.SUPPORT_ACCESS);
export { Jt, Nz, Oz };
