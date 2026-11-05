import { DeleteOutlined, FileImageOutlined, FilePdfOutlined, HolderOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Image, Input, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import {
  BLOCK_CATALOG,
  BLOCK_LIMITS,
  BLOCK_ORDER,
  BLOCK_RANGES,
  LIMITS,
  SOCIAL_NETWORKS,
} from "@/services/partners/constants";
import { emptyMl, upper } from "@/services/partners/format";
import { findIssue } from "@/services/partners/validation";
import { usePartnerUpload } from "@/hooks/use-partner-upload";
import { useReorder } from "@/components/partners/useReorder";
import { usePartnerEditor } from "@/components/partners/editor-context";
import { DraftField, LabeledField, PartnerFileImage, UploadStatus } from "@/components/partners/fields";
import { PhoneInput } from "@/components/partners/PhoneInput";
import { BannerCropModal } from "@/components/partners/BannerCropModal";
import { RowActions } from "@/components/ui/RowActions";
import type { BlockType, FormBlock, Issue } from "@/services/partners/types";

const ALL_LANGS_NOTE = "· barcha tillar uchun";
const HEADING_LABEL: Record<"HEADING_1" | "HEADING_2" | "PARAGRAPH", string> = {
  HEADING_1: "Sarlavha",
  HEADING_2: "Sarlavha",
  PARAGRAPH: "Matn",
};

type BlockOf<T extends BlockType> = Extract<FormBlock, { type: T }>;
interface EditorProps<T extends BlockType> {
  block: BlockOf<T>;
  issues?: Issue[];
  onChange: (block: BlockOf<T>) => void;
  onUpdate: (updater: (block: BlockOf<T>) => BlockOf<T>) => void;
}

const issueFor = (issues: Issue[] | undefined, field: string, lang: Parameters<typeof findIssue>[2]) =>
  findIssue(issues, field, lang, { includeQuiet: true });

const TextBlockEditor = ({ block, issues, onChange }: EditorProps<"HEADING_1" | "HEADING_2" | "PARAGRAPH">) => {
  const { lang } = usePartnerEditor();
  return (
    <DraftField
      label={HEADING_LABEL[block.type]}
      draft={block.text}
      limit={BLOCK_LIMITS[block.type]}
      multiline={block.type === "PARAGRAPH"}
      onChange={(value) => onChange({ ...block, text: { ...block.text, [lang]: value } })}
      error={issueFor(issues, "text", lang)}
    />
  );
};

const BulletListEditor = ({ block, issues, onChange }: EditorProps<"BULLET_LIST">) => {
  const { lang, readOnly } = usePartnerEditor();
  const listError = issueFor(issues, "items", lang);
  const setItem = (index: number, value: string) =>
    onChange({ ...block, items: block.items.map((item, i) => (i === index ? { ...item, [lang]: value } : item)) });
  return (
    <div className="flex flex-col gap-2">
      {block.items.map((draft, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <DraftField
              label={`${index + 1}-band`}
              draft={draft}
              limit={BLOCK_LIMITS.listItem}
              onChange={(value) => setItem(index, value)}
              error={issueFor(issues, `items[${index}]`, lang)}
            />
          </div>
          {!readOnly && block.items.length > BLOCK_RANGES.listMin && (
            <Button
              type="text"
              size="small"
              className="mt-6"
              icon={<DeleteOutlined />}
              aria-label={`${index + 1}-bandni olib tashlash`}
              onClick={() => onChange({ ...block, items: block.items.filter((_, i) => i !== index) })}
            />
          )}
        </div>
      ))}
      {listError && <p className="text-xs text-danger-strong">{listError}</p>}
      {!readOnly && block.items.length < BLOCK_RANGES.listMax && (
        <Button
          type="dashed"
          size="small"
          icon={<PlusOutlined />}
          className="self-start"
          onClick={() => onChange({ ...block, items: [...block.items, emptyMl()] })}
        >
          Band qo‘shish
        </Button>
      )}
    </div>
  );
};

const LinkEditor = ({ block, issues, onChange }: EditorProps<"LINK">) => {
  const { lang, readOnly } = usePartnerEditor();
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <DraftField
        label="Tugma matni"
        draft={block.label}
        limit={BLOCK_LIMITS.linkLabel}
        onChange={(value) => onChange({ ...block, label: { ...block.label, [lang]: value } })}
        error={issueFor(issues, "label", lang)}
      />
      <LabeledField label="Havola" note={ALL_LANGS_NOTE} error={issueFor(issues, "url", lang)}>
        <Input
          className="font-mono"
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="https://"
          readOnly={readOnly}
          inputMode="url"
        />
      </LabeledField>
    </div>
  );
};

const SocialLinksEditor = ({ block, issues, onChange }: EditorProps<"SOCIAL_LINKS">) => {
  const { lang, readOnly } = usePartnerEditor();
  const summary = issueFor(issues, "links", lang);
  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-2.5 sm:grid-cols-2">
        {SOCIAL_NETWORKS.map(({ key, label }) => (
          <LabeledField key={key} label={label} error={issueFor(issues, `links.${key}`, lang)}>
            <Input
              className="font-mono"
              value={block.links[key] ?? ""}
              onChange={(e) => onChange({ ...block, links: { ...block.links, [key]: e.target.value } })}
              placeholder="https://"
              readOnly={readOnly}
              inputMode="url"
            />
          </LabeledField>
        ))}
      </div>
      <p className={`text-xs ${summary ? "text-danger-strong" : "text-content-muted"}`}>
        {summary ?? "Kamida bitta tarmoq · barcha tillar uchun"}
      </p>
    </div>
  );
};

const BannerEditor = ({ block, issues, onChange, onUpdate }: EditorProps<"BANNER">) => {
  const { lang, readOnly } = usePartnerEditor();
  const upload = usePartnerUpload("IMAGE");
  const [pending, setPending] = useState<{ src: string; name: string } | null>(null);
  const imageError = issueFor(issues, "imageFileId", lang);

  useEffect(() => {
    if (pending) return () => URL.revokeObjectURL(pending.src);
  }, [pending]);

  const applyCropped = async (file: File) => {
    setPending(null);
    const uploaded = await upload.upload(file);
    if (uploaded) onUpdate((b) => ({ ...b, image: { id: uploaded.id, file: uploaded } }));
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3">
        <div className="flex h-20 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-muted text-content-muted">
          <PartnerFileImage file={block.image?.file} className="size-full" fallback={<PictureOutlined />} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {!readOnly && (
            <Button
              size="small"
              disabled={upload.isUploading}
              onClick={() => fileDialog("image/*", (file) => setPending({ src: URL.createObjectURL(file), name: file.name }))}
            >
              {block.image ? "Almashtirish" : "Rasm tanlash"}
            </Button>
          )}
          <UploadStatus {...upload} error={upload.error ?? imageError} />
          {!upload.error && !imageError && (
            <p className="text-[11px] text-content-muted">Kadr eni 1000 px · panelda kesiladi · barcha tillar uchun</p>
          )}
        </div>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <LabeledField
          label="Belgi"
          note="· ixtiyoriy · barcha tillar uchun"
          count={{ value: block.badge.trim().length, limit: BLOCK_LIMITS.bannerBadge }}
          error={issueFor(issues, "badge", lang)}
        >
          <Input
            value={block.badge}
            maxLength={BLOCK_LIMITS.bannerBadge}
            placeholder="Yangi kolleksiya"
            readOnly={readOnly}
            onChange={(e) => onChange({ ...block, badge: e.target.value })}
          />
        </LabeledField>
        <DraftField
          label="Izoh"
          draft={block.caption}
          limit={BLOCK_LIMITS.bannerCaption}
          onChange={(value) => onChange({ ...block, caption: { ...block.caption, [lang]: value } })}
          error={issueFor(issues, "caption", lang)}
        />
      </div>
      <BannerCropModal
        key={pending?.src}
        src={pending?.src ?? null}
        fileName={pending?.name ?? "banner"}
        onCancel={() => setPending(null)}
        onApply={(file) => void applyCropped(file)}
      />
    </div>
  );
};

const GalleryEditor = ({ block, issues, onUpdate }: EditorProps<"GALLERY">) => {
  const { lang, readOnly } = usePartnerEditor();
  const upload = usePartnerUpload("IMAGE");
  const error = issueFor(issues, "imageFileIds", lang);
  const full = block.images.length >= BLOCK_RANGES.galleryMax;

  const addImage = async (file: File) => {
    const uploaded = await upload.upload(file);
    if (uploaded) {
      onUpdate((b) =>
        b.images.length >= BLOCK_RANGES.galleryMax ? b : { ...b, images: [...b.images, { id: uploaded.id, file: uploaded }] },
      );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Image.PreviewGroup>
        <div className="flex flex-wrap gap-2">
          {block.images.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className="relative flex size-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-muted text-content-muted"
            >
              <PartnerFileImage
                file={image.file}
                className="size-full"
                fallback={image.file ? <PictureOutlined /> : <FileImageOutlined aria-label="Fayl topilmadi" className="text-danger" />}
              />
              {!readOnly && (
                <Button
                  size="small"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  aria-label={`${index + 1}-suratni olib tashlash`}
                  className="!absolute top-1 right-1 z-10"
                  onClick={() => onUpdate((b) => ({ ...b, images: b.images.filter((_, i) => i !== index) }))}
                />
              )}
            </div>
          ))}
          {!readOnly && (
            <button
              type="button"
              disabled={full}
              aria-label="Surat qo‘shish"
              className="flex size-20 items-center justify-center rounded-lg border border-dashed border-border-strong text-content-muted hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => fileDialog("image/*", (file) => void addImage(file), true)}
            >
              <PlusOutlined />
            </button>
          )}
        </div>
      </Image.PreviewGroup>
      <UploadStatus {...upload} error={upload.error ?? error} />
      <p className="text-[11px] text-content-muted">
        {block.images.length}/{BLOCK_RANGES.galleryMax} · Kamida {BLOCK_RANGES.galleryMin} ta surat ·{" "}
        {BLOCK_RANGES.galleryMax} tada yuklash zonasi o‘chadi
      </p>
    </div>
  );
};

const AddressEditor = ({ block, issues, onChange }: EditorProps<"ADDRESS">) => {
  const { lang, readOnly } = usePartnerEditor();
  return (
    <div className="flex flex-col gap-2.5">
      <DraftField
        label="Manzil"
        draft={block.text}
        limit={BLOCK_LIMITS.address}
        placeholder="Toshkent, Chilonzor tumani, Bunyodkor ko‘chasi, 12"
        onChange={(value) => onChange({ ...block, text: { ...block.text, [lang]: value } })}
        error={issueFor(issues, "text", lang)}
      />
      <div className="grid gap-2.5 sm:grid-cols-2">
        <LabeledField label="Kenglik (latitude)" note={ALL_LANGS_NOTE} error={issueFor(issues, "latitude", lang)}>
          <Input
            className="font-mono"
            inputMode="decimal"
            value={block.latitude}
            placeholder="41.2995"
            readOnly={readOnly}
            onChange={(e) => onChange({ ...block, latitude: e.target.value.trim() })}
          />
        </LabeledField>
        <LabeledField label="Uzunlik (longitude)" note={ALL_LANGS_NOTE} error={issueFor(issues, "longitude", lang)}>
          <Input
            className="font-mono"
            inputMode="decimal"
            value={block.longitude}
            placeholder="69.2401"
            readOnly={readOnly}
            onChange={(e) => onChange({ ...block, longitude: e.target.value.trim() })}
          />
        </LabeledField>
      </div>
      <p className="text-[11px] text-content-muted">Manzil bir nechta bo‘lsa — blokni yana qo‘shing.</p>
    </div>
  );
};

const ContactsEditor = ({ block, issues, onChange }: EditorProps<"CONTACTS">) => {
  const { lang, readOnly } = usePartnerEditor();
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <LabeledField label="Telefon" note={ALL_LANGS_NOTE} error={issueFor(issues, "phone", lang)}>
        <PhoneInput value={block.phone} placeholder="90 123 45 67" readOnly={readOnly} onChange={(phone) => onChange({ ...block, phone })} />
      </LabeledField>
      <LabeledField label="Sayt" note={ALL_LANGS_NOTE} error={issueFor(issues, "website", lang)}>
        <Input
          className="font-mono"
          inputMode="url"
          value={block.website}
          placeholder="https://"
          readOnly={readOnly}
          onChange={(e) => onChange({ ...block, website: e.target.value })}
        />
      </LabeledField>
    </div>
  );
};

const WorkingHoursEditor = ({ block, issues, onChange }: EditorProps<"WORKING_HOURS">) => {
  const { lang } = usePartnerEditor();
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      <DraftField
        label="Soatlar"
        draft={block.hours}
        limit={BLOCK_LIMITS.hours}
        placeholder="Du–Sh 10:00–20:00"
        onChange={(value) => onChange({ ...block, hours: { ...block.hours, [lang]: value } })}
        error={issueFor(issues, "hours", lang)}
      />
      <DraftField
        label="Izoh"
        optional
        draft={block.note}
        limit={BLOCK_LIMITS.hoursNote}
        onChange={(value) => onChange({ ...block, note: { ...block.note, [lang]: value } })}
        error={issueFor(issues, "note", lang)}
      />
    </div>
  );
};

const CalloutEditor = ({ block, issues, onChange }: EditorProps<"CALLOUT">) => {
  const { lang } = usePartnerEditor();
  return (
    <div className="flex flex-col gap-2.5">
      <DraftField
        label="Sarlavha"
        draft={block.title}
        limit={BLOCK_LIMITS.calloutTitle}
        onChange={(value) => onChange({ ...block, title: { ...block.title, [lang]: value } })}
        error={issueFor(issues, "title", lang)}
      />
      <DraftField
        label="Matn"
        multiline
        draft={block.text}
        limit={BLOCK_LIMITS.calloutText}
        onChange={(value) => onChange({ ...block, text: { ...block.text, [lang]: value } })}
        error={issueFor(issues, "text", lang)}
      />
    </div>
  );
};

const formatBytes = (size: number) =>
  size >= 1_048_576 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(size / 1024)} KB`;

const DocumentEditor = ({ block, issues, onUpdate }: EditorProps<"DOCUMENT">) => {
  const { lang, readOnly } = usePartnerEditor();
  const upload = usePartnerUpload("PDF");
  const error = issueFor(issues, "fileId", lang);
  const file = block.document?.file;
  const pick = async (picked: File) => {
    const uploaded = await upload.upload(picked);
    if (uploaded) onUpdate((b) => ({ ...b, document: { id: uploaded.id, file: uploaded } }));
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 rounded-xl bg-surface-muted px-3 py-2.5">
        <FilePdfOutlined className="text-lg text-danger" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-content">
            {file?.originalName ?? (block.document ? "Fayl topilmadi" : "PDF tanlanmagan")}
          </p>
          <p className="text-[11px] text-content-muted">{file ? formatBytes(file.size) : `PDF, ${LIMITS.pdfMaxMb} MB gacha`}</p>
        </div>
        {!readOnly && (
          <Button size="small" disabled={upload.isUploading} onClick={() => fileDialog("application/pdf,.pdf", (f) => void pick(f))}>
            {block.document ? "Almashtirish" : "PDF tanlash"}
          </Button>
        )}
      </div>
      <UploadStatus {...upload} error={upload.error ?? error} />
    </div>
  );
};

// Opens a native file dialog (replaces antd Upload's customRequest wiring).
const fileDialog = (accept: string, onPick: (file: File) => void, multiple = false) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.multiple = multiple;
  input.addEventListener("change", () => {
    const files = input.files ? Array.from(input.files) : [];
    files.forEach(onPick);
  });
  input.click();
};

const BlockBody = ({
  block,
  issues,
  onUpdate,
}: {
  block: FormBlock;
  issues?: Issue[];
  onUpdate: (updater: (block: FormBlock) => FormBlock) => void;
}) => {
  // Each editor narrows to its own block type; onChange replaces, onUpdate maps. The two
  // callbacks are cast to the editor's narrowed block type at the call site.
  const onChange = ((next: FormBlock) => onUpdate(() => next)) as never;
  const onUpdateProp = ((updater: (b: FormBlock) => FormBlock) => onUpdate(updater)) as never;
  switch (block.type) {
    case "HEADING_1":
    case "HEADING_2":
    case "PARAGRAPH":
      return <TextBlockEditor block={block} issues={issues} onChange={onChange} onUpdate={onUpdateProp} />;
    case "BULLET_LIST":
      return <BulletListEditor block={block} issues={issues} onChange={onChange} onUpdate={onUpdateProp} />;
    case "LINK":
      return <LinkEditor block={block} issues={issues} onChange={onChange} onUpdate={onUpdateProp} />;
    case "SOCIAL_LINKS":
      return <SocialLinksEditor block={block} issues={issues} onChange={onChange} onUpdate={onUpdateProp} />;
    case "BANNER":
      return <BannerEditor block={block} issues={issues} onChange={onChange} onUpdate={onUpdateProp} />;
    case "GALLERY":
      return <GalleryEditor block={block} issues={issues} onChange={onChange} onUpdate={onUpdateProp} />;
    case "ADDRESS":
      return <AddressEditor block={block} issues={issues} onChange={onChange} onUpdate={onUpdateProp} />;
    case "CONTACTS":
      return <ContactsEditor block={block} issues={issues} onChange={onChange} onUpdate={onUpdateProp} />;
    case "WORKING_HOURS":
      return <WorkingHoursEditor block={block} issues={issues} onChange={onChange} onUpdate={onUpdateProp} />;
    case "CALLOUT":
      return <CalloutEditor block={block} issues={issues} onChange={onChange} onUpdate={onUpdateProp} />;
    case "DOCUMENT":
      return <DocumentEditor block={block} issues={issues} onChange={onChange} onUpdate={onUpdateProp} />;
  }
};

interface BlockItemProps {
  block: FormBlock;
  index: number;
  total: number;
  issues?: Issue[];
  isServerTarget: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  handleProps: Record<string, unknown>;
  itemProps: Record<string, unknown>;
  onUpdate: (updater: (block: FormBlock) => FormBlock) => void;
  onMove: (to: number) => void;
  onRemove: () => void;
}

const BlockItem = ({
  block,
  index,
  total,
  issues,
  isServerTarget,
  isDragging,
  isDropTarget,
  handleProps,
  itemProps,
  onUpdate,
  onMove,
  onRemove,
}: BlockItemProps) => {
  const { readOnly } = usePartnerEditor();
  const ref = useRef<HTMLDivElement>(null);
  const hasError = isServerTarget || !!issues?.some((i) => !i.quiet);
  const typeIssue = issues?.find((i) => i.field === "type");

  useEffect(() => {
    if (isServerTarget) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isServerTarget]);

  const title = `${index + 1} · ${BLOCK_CATALOG[block.type].label}`;

  return (
    <div
      ref={ref}
      {...(readOnly ? {} : itemProps)}
      className={`flex gap-3 rounded-2xl border bg-surface px-3.5 py-3 transition-opacity ${
        hasError ? "border-2 border-danger" : "border-border"
      } ${isDragging ? "opacity-40" : ""} ${isDropTarget ? "ring-2 ring-accent" : ""}`}
    >
      {!readOnly && (
        <button
          type="button"
          {...handleProps}
          aria-label={`${title} — sudrab ko‘chirish`}
          className="mt-0.5 flex h-6 w-5 shrink-0 cursor-grab items-center justify-center text-content-muted hover:text-content active:cursor-grabbing"
        >
          <HolderOutlined />
        </button>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className={`font-mono text-[11px] ${hasError ? "text-danger-strong" : "text-content-muted"}`}>{title}</span>
          {!readOnly && (
            <RowActions
              label={`${title} amallari`}
              actions={[
                { key: "up", label: "Yuqoriga", disabled: index === 0, onClick: () => onMove(index - 1) },
                { key: "down", label: "Pastga", disabled: index === total - 1, onClick: () => onMove(index + 1) },
                { key: "remove", label: "O‘chirish", danger: true, dividerBefore: true, onClick: onRemove },
              ]}
            />
          )}
        </div>
        {typeIssue && <p className="text-xs text-danger-strong">{typeIssue.message}</p>}
        <BlockBody block={block} issues={issues} onUpdate={onUpdate} />
      </div>
    </div>
  );
};

const AddBlockMenu = ({ blocks, onAdd }: { blocks: FormBlock[]; onAdd: (type: BlockType) => void }) => {
  const present = new Set(blocks.map((b) => b.type));
  const full = blocks.length >= LIMITS.maxBlocks;
  const items = BLOCK_ORDER.map((type) => {
    const meta = BLOCK_CATALOG[type];
    const used = !!meta.once && present.has(type);
    return {
      key: type,
      disabled: used,
      label: used ? (
        <Tooltip title="Tavsifda faqat bitta bo‘ladi">
          <span className="flex items-center justify-between gap-4">
            {meta.label}
            <span className="text-[11px] text-content-muted">bor</span>
          </span>
        </Tooltip>
      ) : (
        meta.label
      ),
    };
  });
  return (
    <Tooltip title={full ? `Tavsifda ${LIMITS.maxBlocks} tagacha blok bo‘ladi` : undefined}>
      <Dropdown menu={{ items, onClick: ({ key }) => onAdd(key as BlockType) }} trigger={["click"]} disabled={full}>
        <Button type="dashed" block icon={<PlusOutlined />} disabled={full}>
          Blok qo‘shish
        </Button>
      </Dropdown>
    </Tooltip>
  );
};

export interface BlockListForm {
  values: { blocks: FormBlock[] };
  validation: { blockIssues: Record<string, Issue[]> };
  serverIssue: { kind: "block"; blockKey: string; field: string; message: string } | { kind: string } | null;
  updateBlock: (key: string, updater: (block: FormBlock) => FormBlock) => void;
  moveBlock: (from: number, to: number) => void;
  removeBlock: (key: string) => void;
  addBlock: (type: BlockType) => void;
}

export const BlockList = ({ form }: { form: BlockListForm }) => {
  const { lang, readOnly } = usePartnerEditor();
  const { values, validation, serverIssue } = form;
  const reorder = useReorder(form.moveBlock);
  const blockServerIssue = serverIssue?.kind === "block" ? (serverIssue as { blockKey: string; field: string; message: string }) : null;

  const issuesFor = (key: string): Issue[] | undefined => {
    const issues = validation.blockIssues[key];
    if (blockServerIssue?.blockKey === key) {
      return [{ field: blockServerIssue.field, lang: null, message: blockServerIssue.message }, ...(issues ?? [])];
    }
    return issues;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-muted">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-3.5 sm:px-6">
        <p className="text-[13px] font-semibold text-content">
          Tavsif <span className="font-normal text-content-muted">· {upper(lang)} · {values.blocks.length}/{LIMITS.maxBlocks} blok</span>
        </p>
        <p className="text-xs text-content-muted">Bo‘sh bloklar ilovada ko‘rinmaydi</p>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4 *:shrink-0 sm:px-6">
        <p className="text-[11px] text-content-muted">Tavsif · doim birinchi blok — ilova chizadi</p>
        {blockServerIssue && (
          <div role="alert" className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-[13px] text-danger-strong">
            Tavsifda xato bor — belgilangan blokni tuzating
          </div>
        )}
        {values.blocks.map((block, index) => (
          <BlockItem
            key={block.key}
            block={block}
            index={index}
            total={values.blocks.length}
            issues={issuesFor(block.key)}
            isServerTarget={blockServerIssue?.blockKey === block.key}
            isDragging={reorder.dragging === index}
            isDropTarget={reorder.over === index && reorder.dragging !== index}
            handleProps={reorder.handleProps(index)}
            itemProps={reorder.itemProps(index)}
            onUpdate={(updater) => form.updateBlock(block.key, updater)}
            onMove={(to) => form.moveBlock(index, to)}
            onRemove={() => form.removeBlock(block.key)}
          />
        ))}
        {values.blocks.length === 0 && <p className="py-6 text-center text-[13px] text-content-muted">Tavsif bo‘sh</p>}
        {!readOnly && <AddBlockMenu blocks={values.blocks} onAdd={form.addBlock} />}
      </div>
    </div>
  );
};
