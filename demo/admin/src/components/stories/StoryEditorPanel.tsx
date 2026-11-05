import { Alert, Button, DatePicker, Input, InputNumber, Progress, Segmented, Skeleton, Slider, Tooltip, Upload } from "antd";
import dayjs from "dayjs";
import {
  cloneElement,
  isValidElement,
  useId,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isAccessDenied, isApiError } from "@/services/api-error";
import { readAsDataUrl } from "@/utils/read-as-data-url";
import { formatDateTime } from "@/utils/format-date-time";
import { useApiMessage } from "@/hooks/use-api-message";
import { useNavigationTargets, useSaveStory, useStory, useUploadStoryFile } from "@/hooks/stories";
import {
  DISPLAY_SECONDS,
  FIELD_LABELS,
  FIELD_LIMITS,
  HTTPS_URL_RE,
  IMAGE_TYPES,
  LANGUAGES,
  MAX_VIDEO_MS,
  MEDIA_ACCEPT,
  REQUIRED_LANGUAGES,
  VIDEO_TYPES,
} from "@/services/stories/constants";
import {
  formToRequest,
  formatDuration,
  formatFileSize,
  glyphLength,
  isEmptyContent,
  newFormValues,
  mediaImageFileId,
  periodDuration,
  resolveContent,
  storyToForm,
  toLocalInput,
  toOffsetIso,
} from "@/services/stories/format";
import { AppModal } from "@/components/ui/AppModal";
import { SidePanel } from "@/components/ui/SidePanel";
import { TableErrorState } from "@/components/ui/TableErrorState";
import { StoryStatusChip } from "@/components/stories/StoryStatusChip";
import { StoryPreview } from "@/components/stories/StoryPreview";
import { StoryMediaThumb } from "@/components/stories/StoryMediaThumb";
import type {
  Language,
  StoryFormMedia,
  StoryFormValues,
  StoryStatus,
} from "@/services/stories/types";

type Errors = Record<string, string>;
type FieldName = keyof typeof FIELD_LIMITS;
const FIELD_NAMES = Object.keys(FIELD_LIMITS) as FieldName[];

// --- messages ---------------------------------------------------------------
const BUTTON_REQUIRED = "Harakat tanlangan — tugma matni majburiy";
const UNKNOWN_TARGET = "Ekran tanlang";
const NOT_HTTPS_URL = "Havola faqat https:// bilan boshlanadi";
const NOT_AFTER_PUBLISH_AT = "Tugash vaqti boshlanishdan keyin bo‘lishi kerak";
const TYPE_UNSUPPORTED = "Fayl turi qo‘llab-quvvatlanmaydi";
const VIDEO_UNREADABLE = "Video faylini o‘qib bo‘lmadi — boshqa MP4 tanlang";

const requiredMessage = (lang: string, field: FieldName) => `${lang} ${FIELD_LABELS[field]} majburiy`;
const tooLongMessage = (max: number) => `${max} belgidan oshmasin`;
const isVideoFile = (file: { type: string }) => VIDEO_TYPES.includes(file.type);

// --- validation -------------------------------------------------------------
const validateContent = (values: StoryFormValues, errors: Errors) => {
  const hasAction = values.actionType !== "NONE";
  LANGUAGES.forEach((lang) => {
    const content = values.content[lang];
    if (!REQUIRED_LANGUAGES.includes(lang) && isEmptyContent(content)) return;
    FIELD_NAMES.forEach((field) => {
      if (field === "buttonText" && !hasAction) return;
      const value = content[field].trim();
      const limit = FIELD_LIMITS[field];
      const key = `content.${lang}.${field}`;
      if (glyphLength(value) > limit) errors[key] = tooLongMessage(limit);
      else if (field === "signature" && !value) errors[key] = requiredMessage(lang, field);
      else if (field === "buttonText" && !value) errors[key] = BUTTON_REQUIRED;
    });
  });
};

const validateAction = (values: StoryFormValues, errors: Errors) => {
  if (values.actionType === "INTERNAL" && !values.internalTarget) {
    errors["action.value"] = UNKNOWN_TARGET;
  }
  if (values.actionType === "EXTERNAL") {
    const url = values.externalUrl.trim();
    if (HTTPS_URL_RE.test(url)) {
      if (url.length > 512) errors["action.value"] = tooLongMessage(512);
    } else {
      errors["action.value"] = NOT_HTTPS_URL;
    }
  }
};

const validate = (values: StoryFormValues): Errors => {
  const errors: Errors = {};
  const { media } = values;
  if (media) {
    if (media.mediaType === "VIDEO" && media.posterFileId === null) {
      errors.posterFileId = "Poster yuklanmagan — videoni qayta tanlang";
    }
  } else {
    errors.mediaFileId = "Rasm yoki video yuklang";
  }
  if (media?.mediaType !== "VIDEO" && (values.displaySeconds < DISPLAY_SECONDS.min || values.displaySeconds > DISPLAY_SECONDS.max)) {
    errors.displaySeconds = `${DISPLAY_SECONDS.min}–${DISPLAY_SECONDS.max} soniya oralig‘ida`;
  }
  validateContent(values, errors);
  validateAction(values, errors);
  if (Date.parse(values.expireAt) <= Date.parse(values.publishAt)) {
    errors.expireAt = NOT_AFTER_PUBLISH_AT;
  }
  return errors;
};

const languagesWithErrors = (errors: Errors): Set<string> =>
  new Set(
    Object.keys(errors)
      .map((key) => /^content\.(uz|ru|tg)\./.exec(key)?.[1])
      .filter((lang): lang is string => !!lang),
  );

// --- form hook --------------------------------------------------------------
interface ServerIssue {
  fields: Errors;
  banner: string | null;
}

const useStoryForm = () => {
  const [values, setValues] = useState<StoryFormValues>(newFormValues);
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(values));
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [serverIssue, setServerIssue] = useState<ServerIssue | null>(null);

  const clientErrors = useMemo(() => validate(values), [values]);
  const errorLangs = useMemo(
    () => languagesWithErrors({ ...clientErrors, ...serverIssue?.fields }),
    [clientErrors, serverIssue],
  );

  const patch = (keys: string[], update: Partial<StoryFormValues> | ((prev: StoryFormValues) => Partial<StoryFormValues>)) => {
    setValues((prev) => ({ ...prev, ...(typeof update === "function" ? update(prev) : update) }));
    setTouched((prev) => new Set([...prev, ...keys]));
    setServerIssue((prev) => {
      if (!prev) return prev;
      const fields = { ...prev.fields };
      keys.forEach((key) => delete fields[key]);
      return { ...prev, fields };
    });
  };

  return {
    values,
    clientErrors,
    errorLangs,
    serverIssue,
    setServerIssue,
    isDirty: JSON.stringify(values) !== snapshot,
    canSave: Object.keys(clientErrors).length === 0,
    errorFor: (key: string) => serverIssue?.fields[key] ?? (touched.has(key) ? clientErrors[key] : undefined),
    reset: (next: StoryFormValues) => {
      setValues(next);
      setSnapshot(JSON.stringify(next));
      setTouched(new Set());
      setServerIssue(null);
    },
    setMedia: (media: StoryFormMedia | null) => patch(["mediaFileId", "posterFileId"], { media }),
    setDisplaySeconds: (displaySeconds: number) => patch(["displaySeconds"], { displaySeconds }),
    setContent: (lang: Language, field: FieldName, value: string) =>
      patch([`content.${lang}.${field}`], (prev) => ({
        content: { ...prev.content, [lang]: { ...prev.content[lang], [field]: value } },
      })),
    setActionType: (actionType: StoryFormValues["actionType"]) => patch([], { actionType }),
    setInternalTarget: (internalTarget: string | null) => patch(["action.value"], { internalTarget }),
    setExternalUrl: (externalUrl: string) => patch(["action.value"], { externalUrl }),
    setPriority: (priority: number) => patch(["priority"], { priority }),
    setPeriod: (period: Partial<StoryFormValues>) => patch(["expireAt"], period),
  };
};

type StoryForm = ReturnType<typeof useStoryForm>;

// --- media upload -----------------------------------------------------------
interface MediaIssue {
  title: string;
  detail?: string | null;
}

const withDetail = (file: { name: string }, detail: string | null) => [file.name, detail].filter(Boolean).join(" · ");

const validateFile = (file: File): MediaIssue | null => {
  const video = isVideoFile(file);
  if (!video && !IMAGE_TYPES.includes(file.type)) {
    return { title: TYPE_UNSUPPORTED, detail: withDetail(file, file.type || null) };
  }
  if (file.size > (video ? 31_457_280 : 5_242_880)) {
    return { title: video ? "Video 30 MB dan katta" : "Rasm 5 MB dan katta", detail: withDetail(file, formatFileSize(file.size)) };
  }
  return null;
};

const validateDuration = (file: File, durationMs: number): MediaIssue | null =>
  durationMs > MAX_VIDEO_MS ? { title: "Video 30 soniyadan uzun", detail: withDetail(file, formatDuration(durationMs)) } : null;

// Extracts duration + a JPEG poster frame from a video file in the browser.
const once = (el: HTMLElement, event: string) =>
  new Promise<void>((resolve, reject) => {
    el.addEventListener(event, () => resolve(), { once: true });
    el.addEventListener("error", () => reject(new Error("video")), { once: true });
  });

const extractVideoPoster = async (file: File): Promise<{ durationMs: number; poster: Blob }> => {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;
    await once(video, "loadeddata");
    const durationMs = Math.round(video.duration * 1000);
    video.currentTime = Math.min(0.1, video.duration || 0);
    await once(video, "seeked");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.drawImage(video, 0, 0);
    const poster = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("poster"))), "image/jpeg", 0.85),
    );
    return { durationMs, poster };
  } finally {
    URL.revokeObjectURL(url);
  }
};

const uploadErrorToIssue = (error: unknown, file: File): MediaIssue => {
  if (!isApiError(error)) return { title: "Faylni yuklab bo‘lmadi", detail: file.name };
  const { code, details } = error;
  const video = isVideoFile(file);
  switch (code) {
    case ApiErrorCode.STORY_FILE_TYPE_UNSUPPORTED: {
      const mime = details?.mimeType;
      return { title: TYPE_UNSUPPORTED, detail: withDetail(file, typeof mime === "string" ? mime : null) };
    }
    case ApiErrorCode.STORY_FILE_TOO_LARGE:
      return { title: video ? "Video 30 MB dan katta" : "Rasm 5 MB dan katta", detail: withDetail(file, formatFileSize(file.size)) };
    case ApiErrorCode.STORY_VIDEO_TOO_LONG: {
      const ms = details?.durationMs;
      return validateDuration(file, typeof ms === "number" ? ms : 30001) ?? { title: "Video 30 soniyadan uzun", detail: file.name };
    }
    case ApiErrorCode.STORY_VIDEO_UNREADABLE:
      return { title: VIDEO_UNREADABLE, detail: file.name };
    default:
      if (error.status === 413 || code === ApiErrorCode.PAYLOAD_TOO_LARGE) {
        return { title: "Fayl juda katta — server qabul qilmadi", detail: withDetail(file, null) };
      }
      return { title: error.message, detail: file.name };
  }
};

const posterName = (name: string) => `${name.replace(/\.[^.]+$/, "")}-poster.jpg`;
const fileFormat = (name: string) => /\.([^.]+)$/.exec(name)?.[1].toUpperCase() ?? null;

interface UploadProgress {
  name: string;
  sizeLabel: string;
  percent: number;
}

const useMediaUpload = (setMedia: (media: StoryFormMedia) => void) => {
  const { mutateAsync } = useUploadStoryFile();
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [issue, setIssue] = useState<MediaIssue | null>(null);

  const reportProgress = (file: File, percent: number) =>
    setProgress({
      name: file.name,
      sizeLabel: `${formatFileSize(Math.round((file.size * percent) / 100))} / ${formatFileSize(file.size)}`,
      percent,
    });

  return {
    progress,
    issue,
    isUploading: progress !== null,
    reset: () => setIssue(null),
    pick: async (file: File) => {
      const fileIssue = validateFile(file);
      if (fileIssue) return setIssue(fileIssue);
      setIssue(null);
      reportProgress(file, 0);
      try {
        const extracted = isVideoFile(file) ? await extractVideoPoster(file).catch(() => null) : null;
        if (isVideoFile(file)) {
          if (!extracted) return setIssue({ title: VIDEO_UNREADABLE, detail: file.name });
          const durationIssue = validateDuration(file, extracted.durationMs);
          if (durationIssue) return setIssue(durationIssue);
        }
        const media = await mutateAsync({ file, name: file.name, onProgress: (p) => reportProgress(file, p) });
        const poster = extracted ? await mutateAsync({ file: extracted.poster, name: posterName(file.name) }) : null;
        setMedia({
          mediaType: media.mediaType,
          mediaFileId: media.fileId,
          posterFileId: poster?.fileId ?? null,
          durationMs: media.durationMs ?? extracted?.durationMs ?? null,
          name: file.name,
          size: media.size,
          format: fileFormat(file.name),
        });
      } catch (error) {
        setIssue(uploadErrorToIssue(error, file));
      } finally {
        setProgress(null);
      }
    },
  };
};

type MediaUpload = ReturnType<typeof useMediaUpload>;

// --- server error mapping ---------------------------------------------------
const FIELD_KEY_RE = /^content\.(uz|ru|tg)\.(label|signature|body|buttonText)$/;
const FIELD_ERROR_MESSAGES: Record<string, Record<string, string>> = {
  mediaFileId: {
    NOT_FOUND: "Media topilmadi — faylni qayta yuklang",
    NO_DURATION: "Video davomiyligi aniqlanmadi — boshqa MP4 yuklang",
  },
  posterFileId: {
    REQUIRED: "Video uchun poster majburiy — videoni qayta yuklang",
    NOT_FOUND: "Poster topilmadi — videoni qayta yuklang",
    NOT_AN_IMAGE: "Poster rasm bo‘lishi kerak",
    NOT_ALLOWED: "Rasm story’ga poster yuborilmaydi",
  },
  "action.value": { UNKNOWN_TARGET, NOT_HTTPS_URL },
  expireAt: { NOT_AFTER_PUBLISH_AT },
  displaySeconds: { OUT_OF_RANGE: `${DISPLAY_SECONDS.min}–${DISPLAY_SECONDS.max} soniya oralig‘ida` },
};

const translateFieldError = (key: string, code: string): string => {
  const match = FIELD_KEY_RE.exec(key);
  if (match) {
    const [, lang, field] = match;
    if (code === "REQUIRED") return requiredMessage(lang, field as FieldName);
    if (code === "TOO_LONG") return tooLongMessage(FIELD_LIMITS[field as FieldName]);
  }
  return FIELD_ERROR_MESSAGES[key]?.[code] ?? code;
};

const FIELD_ERROR_CODES = [
  ApiErrorCode.STORY_CONTENT_INVALID,
  ApiErrorCode.STORY_ACTION_INVALID,
  ApiErrorCode.STORY_PERIOD_INVALID,
  ApiErrorCode.STORY_MEDIA_INVALID,
] as number[];

const serverIssueFromError = (error: unknown): ServerIssue | null => {
  if (isAccessDenied(error)) return null;
  if (isApiError(error)) {
    if (FIELD_ERROR_CODES.includes(error.code) && error.fields) {
      return {
        fields: Object.fromEntries(
          Object.entries(error.fields).map(([key, code]) => [key, translateFieldError(key, code)]),
        ),
        banner: null,
      };
    }
    return { fields: {}, banner: error.message };
  }
  return { fields: {}, banner: "Kutilmagan xatolik. Qayta urinib ko‘ring." };
};

const useStorySave = ({
  form,
  storyId,
  onSaved,
}: {
  form: StoryForm;
  storyId: number | null;
  onSaved: (story: { id: number }) => void;
}) => {
  const toast = useApiMessage();
  const { mutate, isPending } = useSaveStory();
  return {
    isSaving: isPending,
    save: () => {
      if (!form.canSave) return;
      mutate(
        { id: storyId, request: formToRequest(form.values) },
        {
          onSuccess: (story) => {
            toast.success(storyId === null ? `Story #${story.id} qoralama sifatida saqlandi` : "Saqlandi");
            form.reset(storyToForm(story));
            onSaved(story);
          },
          onError: (error) => {
            const issue = serverIssueFromError(error);
            if (issue) form.setServerIssue(issue);
            else toast.error(error);
          },
        },
      );
    },
  };
};

// --- small building blocks --------------------------------------------------
const Field = ({
  label,
  required,
  count,
  hint,
  error,
  children,
}: {
  label: ReactNode;
  required?: boolean;
  count?: { value: number; limit: number };
  hint?: string;
  error?: string;
  children: ReactNode;
}) => {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const child = isValidElement(children)
    ? cloneElement(children as ReactElement, { id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })
    : children;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <label htmlFor={id} className="font-medium text-content">
          {label}
          {required && <span aria-hidden className="ml-1 text-danger">*</span>}
        </label>
        {count && (
          <span className="text-content-muted tabular-nums">
            {count.value} / {count.limit}
          </span>
        )}
      </div>
      {child}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[11px] text-danger-strong">
          {error}
        </p>
      ) : (
        hint && <p id={`${id}-hint`} className="text-[11px] leading-relaxed text-content-muted">{hint}</p>
      )}
    </div>
  );
};

// Grapheme-aware antd input count config (emoji count as one character).
const countConfig = (max: number) => ({
  max,
  strategy: (value: string) => [...value].length,
  exceedFormatter: (value: string) => [...value].slice(0, max).join(""),
});

const CountedInput = ({
  value,
  limit,
  onChange,
  multiline = false,
  hasError = false,
  placeholder,
  disabled,
}: {
  value: string;
  limit: number;
  onChange: (value: string) => void;
  multiline?: boolean;
  hasError?: boolean;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const status = hasError ? ("error" as const) : undefined;
  if (multiline) {
    return (
      <Input.TextArea
        value={value}
        count={countConfig(limit)}
        autoSize={{ minRows: 3, maxRows: 6 }}
        status={status}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <Input
      value={value}
      count={countConfig(limit)}
      status={status}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

const ContentLangTabs = ({
  value,
  content,
  errorLangs,
  onChange,
}: {
  value: Language;
  content: Record<Language, { label: string; signature: string; body: string; buttonText: string }>;
  errorLangs: Set<string>;
  onChange: (lang: Language) => void;
}) => (
  <div role="group" aria-label="Kontent tili">
    <Segmented<Language>
      size="small"
      value={value}
      onChange={onChange}
      options={LANGUAGES.map((lang) => {
        const hasError = errorLangs.has(lang);
        const filled = !isEmptyContent(content[lang]);
        const optional = !REQUIRED_LANGUAGES.includes(lang);
        return {
          value: lang,
          label: (
            <span className="inline-flex items-center gap-1.5 px-1 font-mono text-xs">
              {lang}
              {hasError ? (
                <span aria-label="Xato bor" className="size-1.5 rounded-full bg-danger" />
              ) : optional && !filled ? (
                <span className="font-sans text-[11px] text-content-muted">ixtiyoriy</span>
              ) : (
                <span className="text-[11px] text-success-strong">✓</span>
              )}
            </span>
          ),
        };
      })}
    />
  </div>
);

const ContentEditor = ({ form, lang, onLangChange }: { form: StoryForm; lang: Language; onLangChange: (lang: Language) => void }) => {
  const { values, errorLangs, errorFor, setContent } = form;
  const content = values.content[lang];
  const hasAction = values.actionType !== "NONE";
  const fieldProps = (field: FieldName) => {
    const error = errorFor(`content.${lang}.${field}`);
    const limit = FIELD_LIMITS[field];
    return {
      box: { count: { value: glyphLength(content[field]), limit }, error },
      input: { value: content[field], limit, hasError: !!error, onChange: (next: string) => setContent(lang, field, next) },
    };
  };
  const label = fieldProps("label");
  const button = fieldProps("buttonText");
  const signature = fieldProps("signature");
  const body = fieldProps("body");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-content">Kontent</p>
        <ContentLangTabs value={lang} content={values.content} errorLangs={errorLangs} onChange={onLangChange} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Yorliq" {...label.box}>
          <CountedInput {...label.input} placeholder="ixtiyoriy" />
        </Field>
        {hasAction ? (
          <Field label="Tugma matni" required {...button.box}>
            <CountedInput {...button.input} />
          </Field>
        ) : (
          <Field label="Tugma matni">
            <CountedInput value="" limit={FIELD_LIMITS.buttonText} onChange={() => {}} disabled placeholder="harakat yo‘q" />
          </Field>
        )}
      </div>
      <Field label="Sarlavha" required={REQUIRED_LANGUAGES.includes(lang)} {...signature.box}>
        <CountedInput {...signature.input} />
      </Field>
      <Field label="Matn" {...body.box}>
        <CountedInput {...body.input} multiline />
      </Field>
    </div>
  );
};

const DisplaySeconds = ({
  media,
  seconds,
  onChange,
}: {
  media: StoryFormMedia | null;
  seconds: number;
  onChange: (value: number) => void;
}) => {
  if (media?.mediaType === "VIDEO") {
    return (
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13px] font-semibold text-content">Ko‘rsatish vaqti</p>
        <p className="text-[13px] text-content-muted">
          Video o‘z davomiyligida · <span className="font-semibold text-content tabular-nums">{formatDuration(media.durationMs)}</span>
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13px] font-semibold text-content">Ko‘rsatish vaqti</p>
        <p className="text-[13px] tabular-nums">
          <span className="font-semibold text-content">{seconds}</span> <span className="text-content-muted">s</span>
        </p>
      </div>
      <Slider
        min={DISPLAY_SECONDS.min}
        max={DISPLAY_SECONDS.max}
        step={1}
        value={seconds}
        onChange={onChange}
        tooltip={{ open: false }}
        aria-label="Ko‘rsatish vaqti, soniya"
        className="mx-0! my-1!"
      />
      <div className="flex justify-between gap-2 text-[11px] text-content-muted">
        <span>{DISPLAY_SECONDS.min} s</span>
        <span className="text-center">faqat rasm uchun — video o‘z davomiyligida</span>
        <span>{DISPLAY_SECONDS.max} s</span>
      </div>
    </div>
  );
};

const ACTION_OPTIONS = [
  { value: "NONE", label: "Yo‘q" },
  { value: "INTERNAL", label: "Ilova ekrani" },
  { value: "EXTERNAL", label: "Tashqi havola" },
];

const ActionEditor = ({ form }: { form: StoryForm }) => {
  const { values, errorFor } = form;
  const targets = useNavigationTargets();
  const error = errorFor("action.value");
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[13px] font-semibold text-content">Harakat</p>
      <div role="group" aria-label="Harakat turi">
        <Segmented block value={values.actionType} options={ACTION_OPTIONS} onChange={(v) => form.setActionType(v as StoryFormValues["actionType"])} />
      </div>
      {values.actionType === "NONE" && (
        <p className="text-xs text-content-muted">Story faqat ko‘rsatiladi — tugma va havola bo‘lmaydi.</p>
      )}
      {values.actionType === "INTERNAL" &&
        (targets.isPending ? (
          <Skeleton.Input active size="small" block />
        ) : targets.isError ? (
          <p className="flex items-center gap-2 text-xs text-danger-strong">
            Ekranlar ro‘yxati yuklanmadi.
            <Button size="small" onClick={() => void targets.refetch()}>
              Qayta urinish
            </Button>
          </p>
        ) : (
          <div role="radiogroup" aria-label="Ilova ekrani" className="flex flex-wrap gap-1.5">
            {targets.data.map((target) => {
              const selected = values.internalTarget === target.code;
              return (
                <button
                  key={target.code}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => form.setInternalTarget(target.code)}
                  className={`flex h-8.5 items-center gap-2 rounded-full border px-3 text-xs transition-colors ${
                    selected
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border bg-surface text-content-secondary hover:border-border-strong"
                  }`}
                >
                  {target.label}
                  <span className="font-mono text-[10px] opacity-65">{target.code}</span>
                </button>
              );
            })}
          </div>
        ))}
      {values.actionType === "EXTERNAL" && (
        <Input
          value={values.externalUrl}
          onChange={(e) => form.setExternalUrl(e.target.value)}
          placeholder="https://"
          aria-label="Havola"
          status={error ? "error" : undefined}
          className="font-mono"
        />
      )}
      {error && values.actionType !== "NONE" && <p role="alert" className="text-[11px] text-danger-strong">{error}</p>}
    </div>
  );
};

const DATE_FORMAT = "YYYY-MM-DDTHH:mm";
const dayjsToOffsetIso = (value: dayjs.Dayjs) => toOffsetIso(value.format(DATE_FORMAT));

const StoryDateField = ({
  value,
  onChange,
  hasError = false,
}: {
  value: string;
  onChange: (iso: string) => void;
  hasError?: boolean;
}) => (
  <DatePicker
    className="w-full"
    showTime={{ format: "HH:mm" }}
    format={(d) => formatDateTime(dayjsToOffsetIso(d))}
    value={dayjs(toLocalInput(value))}
    allowClear={false}
    inputReadOnly
    status={hasError ? "error" : undefined}
    onChange={(d) => {
      if (d && !Array.isArray(d)) onChange(dayjsToOffsetIso(d));
    }}
  />
);

const PeriodEditor = ({ form }: { form: StoryForm }) => {
  const { values, errorFor } = form;
  const error = errorFor("expireAt");
  const duration = periodDuration(values.publishAt, values.expireAt);
  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-3 sm:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)]">
        <Field label="Ustuvorlik">
          <InputNumber
            className="w-full"
            precision={0}
            value={values.priority}
            onChange={(v) => form.setPriority(typeof v === "number" ? v : 0)}
            placeholder="0"
          />
        </Field>
        <Field label="Boshlanish" required>
          <StoryDateField value={values.publishAt} hasError={!!error} onChange={(publishAt) => form.setPeriod({ publishAt })} />
        </Field>
        <Field label="Tugash" required error={error}>
          <StoryDateField value={values.expireAt} hasError={!!error} onChange={(expireAt) => form.setPeriod({ expireAt })} />
        </Field>
      </div>
      <p className="text-[11px] text-content-muted">
        Kattaroq ustuvorlik — ilovada oldinroq. Vaqt Toshkent (UTC+5) bo‘yicha{duration && ` · davomiyligi ${duration}`}.
      </p>
    </div>
  );
};

const MediaRow = ({
  thumb,
  title,
  chip,
  action,
  dashed = false,
  danger = false,
  children,
}: {
  thumb?: ReactNode;
  title: ReactNode;
  chip?: ReactNode;
  action?: ReactNode;
  dashed?: boolean;
  danger?: boolean;
  children?: ReactNode;
}) => (
  <div
    className={`flex min-h-20.5 items-center gap-3.5 rounded-[14px] border px-3 py-2.5 text-left ${dashed ? "border-dashed" : ""} ${
      danger ? "border-danger bg-danger-soft" : "border-border bg-surface-muted"
    }`}
  >
    {thumb}
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <p className={`truncate text-[13px] font-medium ${danger ? "text-danger-strong" : "text-content"}`}>{title}</p>
      {children}
    </div>
    {chip}
    {action}
  </div>
);

const MEDIA_HINT = "Rasm: JPG/PNG/WEBP ≤ 5 MB · Video: MP4 ≤ 30 MB, ≤ 30 s · 9:16 tavsiya etiladi";

const MediaUploader = ({
  media,
  control,
  error,
}: {
  media: StoryFormValues["media"];
  control: MediaUpload;
  error?: string;
}) => {
  const { progress, issue } = control;
  const uploadProps = {
    accept: MEDIA_ACCEPT,
    showUploadList: false,
    customRequest: ({ file }: { file: unknown }) => void control.pick(file as File),
  };
  let body: ReactNode;
  if (progress) {
    body = (
      <MediaRow thumb={<StoryMediaThumb fileId={null} mediaType="IMAGE" />} title={progress.name}>
        <span className="font-mono text-[11px] text-content-muted">{progress.sizeLabel}</span>
        <Progress percent={progress.percent} showInfo={false} size="small" className="m-0!" />
      </MediaRow>
    );
  } else if (media && !issue) {
    body = (
      <MediaRow
        thumb={<StoryMediaThumb fileId={mediaImageFileId(media.mediaType, media.mediaFileId, media.posterFileId)} mediaType={media.mediaType} />}
        title={media.name}
        chip={<span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success-strong">Yuklandi</span>}
        action={
          <Upload {...uploadProps}>
            <Button size="small">Almashtirish</Button>
          </Upload>
        }
      >
        <span className="truncate font-mono text-[11px] text-content-muted">
          {[media.mediaType, media.format, formatFileSize(media.size)].filter(Boolean).join(" · ")}
        </span>
      </MediaRow>
    );
  } else {
    body = (
      <Upload.Dragger {...uploadProps} className="block [&_.ant-upload-btn]:p-0! [&_.ant-upload-drag]:border-0! [&_.ant-upload-drag]:bg-transparent!">
        <MediaRow dashed danger={!!issue} title={issue?.title ?? "Rasm yoki videoni sudrang"}>
          <span className={`font-mono text-[11px] ${issue ? "text-danger-strong" : "text-content-muted"}`}>
            {issue ? (issue.detail ?? "") : "JPG · PNG · WEBP · MP4 — yoki bosib tanlang"}
          </span>
        </MediaRow>
      </Upload.Dragger>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-semibold text-content">
        Media <span className="text-danger">*</span>
      </p>
      {body}
      {error && !issue ? (
        <p role="alert" className="text-[11px] text-danger-strong">{error}</p>
      ) : (
        <p className="text-[11px] text-content-muted">{MEDIA_HINT}</p>
      )}
    </div>
  );
};

const EditorBody = ({ form, media, lang, onLangChange }: { form: StoryForm; media: MediaUpload; lang: Language; onLangChange: (lang: Language) => void }) => (
  <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:overflow-y-auto">
    <MediaUploader media={form.values.media} control={media} error={form.errorFor("mediaFileId") ?? form.errorFor("posterFileId")} />
    <DisplaySeconds media={form.values.media} seconds={form.values.displaySeconds} onChange={form.setDisplaySeconds} />
    <ContentEditor form={form} lang={lang} onLangChange={onLangChange} />
    <ActionEditor form={form} />
    <PeriodEditor form={form} />
  </div>
);

const LivePreview = ({ values, lang }: { values: StoryFormValues; lang: Language }) => {
  const targets = useNavigationTargets();
  const { media, actionType } = values;
  const { content, fallbackNote } = resolveContent(values.content, lang);
  const isVideo = media?.mediaType === "VIDEO";
  const target = targets.data?.find((t) => t.code === values.internalTarget);
  const buttonSummary =
    actionType === "NONE"
      ? "Tugma yo‘q"
      : actionType === "INTERNAL"
        ? `Tugma → ${target ? `${target.label} (${target.code})` : "ekran tanlanmagan"}`
        : `Tugma → ${values.externalUrl.trim() || "havola kiritilmagan"}`;
  return (
    <div className="flex flex-col items-center gap-3 border-t border-border bg-surface-muted px-4 py-5 lg:overflow-y-auto lg:border-t-0 lg:border-l lg:px-7.5">
      <div className="flex w-full justify-between text-xs text-content-muted">
        <span>
          Preview · <span className="font-mono text-content">{lang}</span>
        </span>
        <span className="tabular-nums">{isVideo ? formatDuration(media.durationMs) : `${values.displaySeconds} s`}</span>
      </div>
      <StoryPreview
        content={content}
        showButton={actionType !== "NONE"}
        media={media ? { type: media.mediaType, imageFileId: mediaImageFileId(media.mediaType, media.mediaFileId, media.posterFileId) } : undefined}
      />
      {fallbackNote && (
        <p className="w-full rounded-[10px] bg-warning-soft px-2.5 py-2 text-center text-[11px] leading-normal text-warning-strong">
          {fallbackNote}
        </p>
      )}
      <p className="text-center text-[11px] leading-normal break-all text-content-muted">{buttonSummary}</p>
    </div>
  );
};

const MAX_FOOTER_ERRORS = 6;

const EditorFooter = ({
  status,
  errors,
  isDirty,
  isUploading,
  isSaving,
  onCancel,
  onSave,
}: {
  status: StoryStatus | null;
  errors: string[];
  isDirty: boolean;
  isUploading: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;
}) => {
  const hasErrors = errors.length > 0;
  const unique = [...new Set(errors)];
  const tooltip = isUploading ? (
    "Fayl yuklanmoqda — tugashini kuting"
  ) : hasErrors ? (
    <div className="flex flex-col gap-0.5">
      {unique.slice(0, MAX_FOOTER_ERRORS).map((error) => (
        <span key={error}>{error}</span>
      ))}
      {unique.length > MAX_FOOTER_ERRORS && <span>…</span>}
    </div>
  ) : null;
  const [note, noteClass] = hasErrors
    ? ["Xatolarni tuzating — saqlash o‘chirilgan", isDirty ? "text-danger-strong" : "text-content-muted"]
    : status === "ACTIVE"
      ? ["Faol story — saqlangach ilovada darhol yangilanadi", "text-warning-strong"]
      : status === null
        ? ["Saqlangach qoralama bo‘ladi · audit jurnaliga yoziladi", "text-content-muted"]
        : ["Saqlash audit jurnaliga yoziladi", "text-content-muted"];
  const blocked = isUploading || hasErrors;
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <p className={`text-xs sm:mr-auto ${noteClass}`}>{note}</p>
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <Button onClick={onCancel} disabled={isSaving}>
          Bekor qilish
        </Button>
        <Tooltip title={isSaving ? undefined : tooltip}>
          <Button type="primary" loading={isSaving} disabled={!isSaving && blocked} onClick={onSave}>
            {status === null ? "Qoralama sifatida saqlash" : "Saqlash"}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

const UnsavedModal = ({ open, onStay, onLeave }: { open: boolean; onStay: () => void; onLeave: () => void }) => (
  <AppModal
    open={open}
    width={420}
    title="Saqlanmagan o‘zgarishlar bor"
    onCancel={onStay}
    footer={
      <>
        <Button type="primary" autoFocus onClick={onStay}>
          Qolish
        </Button>
        <Button danger onClick={onLeave}>
          Chiqish
        </Button>
      </>
    }
  >
    <p className="text-[13px] leading-relaxed text-content-secondary">Chiqsangiz ular yo‘qoladi.</p>
  </AppModal>
);

// Create / edit story side panel (recovered from the build).
export const StoryEditorPanel = ({
  open,
  storyId,
  onClose,
  onSaved,
}: {
  open: boolean;
  storyId: number | null;
  onClose: () => void;
  onSaved?: (story: { id: number }) => void;
}) => {
  const query = useStory(open ? storyId : null, { fresh: true });
  const form = useStoryForm();
  const media = useMediaUpload(form.setMedia);
  const [lang, setLang] = useState<Language>("uz");
  const [unsavedOpen, setUnsavedOpen] = useState(false);
  const { save, isSaving } = useStorySave({
    form,
    storyId,
    onSaved: (story) => {
      onClose();
      onSaved?.(story);
    },
  });

  // Re-seed the form whenever the panel opens on a different target.
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const ready = query.data !== undefined && (loadedKey !== null || !query.isFetching);
  const currentKey = open ? (storyId === null ? "new" : ready ? `s${storyId}` : null) : null;
  if (currentKey !== loadedKey) {
    if (loadedKey === null) {
      setLang("uz");
      media.reset();
    }
    setLoadedKey(currentKey);
    if (currentKey === "new") form.reset(newFormValues());
    else if (currentKey && query.data) form.reset(storyToForm(query.data));
  }

  const requestClose = () => {
    if (isSaving) return;
    if (form.isDirty || media.isUploading) setUnsavedOpen(true);
    else onClose();
  };

  const status: StoryStatus | null = storyId === null ? null : (query.data?.status ?? null);
  const showSkeleton = open && currentKey === null && !query.isError;

  return (
    <>
      <SidePanel
        open={open}
        wide
        onClose={requestClose}
        title={
          <span className="flex items-center gap-2.5">
            {storyId === null ? "Yangi story" : `Story #${storyId} ni tahrirlash`}
            <StoryStatusChip status={status ?? "DRAFT"} />
          </span>
        }
        footer={
          <EditorFooter
            status={status}
            errors={Object.values(form.clientErrors)}
            isDirty={form.isDirty}
            isUploading={media.isUploading}
            isSaving={isSaving}
            onCancel={requestClose}
            onSave={save}
          />
        }
      >
        {query.isError ? (
          <div className="p-6">
            <TableErrorState onRetry={() => void query.refetch()} />
          </div>
        ) : showSkeleton ? (
          <div className="p-6">
            <Skeleton active paragraph={{ rows: 12 }} />
          </div>
        ) : (
          <div className="flex flex-col lg:h-full">
            {form.serverIssue?.banner && (
              <Alert type="error" showIcon className="mx-4! mt-4! sm:mx-6!" message={form.serverIssue.banner} />
            )}
            <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_360px]">
              <EditorBody form={form} media={media} lang={lang} onLangChange={setLang} />
              <LivePreview values={form.values} lang={lang} />
            </div>
          </div>
        )}
      </SidePanel>
      <UnsavedModal
        open={unsavedOpen}
        onStay={() => setUnsavedOpen(false)}
        onLeave={() => {
          setUnsavedOpen(false);
          onClose();
        }}
      />
    </>
  );
};
