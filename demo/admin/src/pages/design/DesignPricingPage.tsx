import { MinusOutlined, PlusOutlined, ExclamationOutlined } from "@ant-design/icons";
import { Button, Form, InputNumber, Skeleton } from "antd";
import type { FormInstance } from "antd";
import { useEffect, useState } from "react";
import { isAdmin } from "@/permissions";
import { isAccessDenied, isApiError } from "@/services/api-error";
import { useAuth } from "@/hooks/use-auth";
import { useApiMessage } from "@/hooks/use-api-message";
import { useDesignPricing, useUpdateDesignPricing } from "@/hooks/design";
import { formatNumber } from "@/utils/format-number";
import { formatDateTime } from "@/utils/format-date-time";
import { PageHeader } from "@/components/ui/PageHeader";
import { DesignCard } from "@/components/ui/DesignCard";
import { SumInput } from "@/components/ui/SumInput";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableErrorState } from "@/components/ui/TableErrorState";
import { Forbidden } from "@/pages/forbidden/Forbidden";
import type { DesignPricing } from "@/services/design/types";

interface PricingForm {
  pricePerRender: number;
  freeRenders: number;
}

const MIN_RENDERS = 1;
const MAX_RENDERS = 50;

const estimate = (renders: number, pricePerRender: number, freeRenders: number) => {
  const free = Math.min(Math.max(freeRenders, 0), renders);
  const paid = renders - free;
  return { free, paid, total: paid * Math.max(pricePerRender, 0) };
};

// Form + pending-save controller shared by the editable pricing UI.
const usePricingControl = (data: DesignPricing | undefined, canWrite: boolean) => {
  const [form] = Form.useForm<PricingForm>();
  const toast = useApiMessage();
  const { mutate, isPending } = useUpdateDesignPricing();
  const [pending, setPending] = useState<PricingForm | null>(null);

  useEffect(() => {
    if (data && canWrite) {
      form.setFieldsValue({ pricePerRender: data.pricePerRender, freeRenders: data.freeRenders });
    }
  }, [data, canWrite, form]);

  const livePrice = Form.useWatch("pricePerRender", form);
  const liveFree = Form.useWatch("freeRenders", form);
  const isDirty = data !== undefined && (livePrice !== data.pricePerRender || liveFree !== data.freeRenders);

  return {
    form,
    live: { pricePerRender: livePrice ?? 0, freeRenders: liveFree ?? 0 },
    isDirty,
    isSaving: isPending,
    pending,
    requestSave: setPending,
    confirm: () => {
      if (!pending) return;
      mutate(pending, {
        onSuccess: () => {
          setPending(null);
          toast.success("Narx saqlandi");
        },
        onError: (error) => {
          setPending(null);
          if (isApiError(error) && error.fields) {
            form.setFields(
              Object.entries(error.fields).map(([name, message]) => ({ name: name as never, errors: [message] })),
            );
            return;
          }
          toast.error(error);
        },
      });
    },
    cancel: () => setPending(null),
  };
};

type PricingControl = ReturnType<typeof usePricingControl> & { form: FormInstance<PricingForm> };

const Calculator = ({ pricePerRender, freeRenders }: { pricePerRender: number; freeRenders: number }) => {
  const [renders, setRenders] = useState(5);
  const { free, paid, total } = estimate(renders, pricePerRender, freeRenders);
  return (
    <DesignCard
      title="Kalkulyator"
      extra={
        <div className="flex items-center gap-2 text-[13px]">
          <Button
            shape="circle"
            size="small"
            icon={<MinusOutlined />}
            aria-label="Kamaytirish"
            disabled={renders <= MIN_RENDERS}
            onClick={() => setRenders((n) => Math.max(MIN_RENDERS, n - 1))}
          />
          <span className="min-w-22 text-center text-content tabular-nums">{renders} ta render</span>
          <Button
            shape="circle"
            size="small"
            icon={<PlusOutlined />}
            aria-label="Ko‘paytirish"
            disabled={renders >= MAX_RENDERS}
            onClick={() => setRenders((n) => Math.min(MAX_RENDERS, n + 1))}
          />
        </div>
      }
    >
      <p className="flex items-baseline gap-2">
        <span className="text-5xl leading-none font-bold tracking-tighter text-content tabular-nums">
          {formatNumber(total)}
        </span>
        <span className="text-sm text-content-muted">so‘m</span>
      </p>
      <p className="rounded-md bg-surface-muted px-3.5 py-3 text-[13px] text-content-secondary tabular-nums">
        {renders} ta render so‘ralsa → {free} tekin + {paid} × {formatNumber(pricePerRender)} = {formatNumber(total)} so‘m
      </p>
      <p className="text-xs text-content-muted">
        Yangi mijozning birinchi buyurtmasi uchun. Tekin renderlarini ishlatib bo‘lgan mijoz har bir render uchun to‘laydi.
      </p>
      <p className="text-xs text-content-muted">Saqlash tugmasini bosmaguningizcha hech narsa o‘zgarmaydi.</p>
    </DesignCard>
  );
};

const SaveConfirm = ({ pricing, control }: { pricing: DesignPricing; control: PricingControl }) => {
  const pending = control.pending;
  const rows: [string, string, string][] = pending
    ? [
        ["Render narxi", formatNumber(pricing.pricePerRender), `${formatNumber(pending.pricePerRender)} so‘m`],
        ["Tekin renderlar", formatNumber(pricing.freeRenders), formatNumber(pending.freeRenders)],
      ]
    : [];
  return (
    <ConfirmModal
      open={pending !== null}
      tone="neutral"
      title={
        <span className="flex items-center gap-3">
          <span className="flex size-8.5 items-center justify-center rounded-full bg-warning-soft text-warning-strong">
            <ExclamationOutlined />
          </span>
          Narxni o‘zgartirish
        </span>
      }
      confirmLabel="Saqlash"
      loading={control.isSaving}
      auditNote
      onConfirm={control.confirm}
      onCancel={control.cancel}
    >
      <div className="mb-3.5 grid grid-cols-[1fr_auto_auto_auto] gap-x-3 gap-y-1.5 rounded-md bg-surface-muted px-3.5 py-3 text-[13px] tabular-nums">
        {rows.map(([label, from, to]) => (
          <div key={label} className="contents">
            <span className="text-content-muted">{label}</span>
            <span className="text-content-muted line-through">{from}</span>
            <span className="text-content-muted">→</span>
            <span className="font-semibold text-content">{to}</span>
          </div>
        ))}
      </div>
      <p className="text-[13px] leading-relaxed text-content-secondary">
        Yangi narx faqat bundan keyin yaratilgan buyurtmalarga qo‘llanadi. Mavjud buyurtmalar o‘z narxini saqlaydi.
      </p>
    </ConfirmModal>
  );
};

const PricingEditor = ({ pricing, control }: { pricing: DesignPricing; control: PricingControl }) => (
  <DesignCard>
    <Form form={control.form} layout="vertical" onFinish={control.requestSave} requiredMark>
      <Form.Item
        name="pricePerRender"
        label="Bitta render narxi"
        extra="so‘m, 0 yoki undan katta"
        rules={[
          { required: true, message: "Narxni kiriting." },
          { type: "number", min: 0, message: "Narx manfiy bo‘lishi mumkin emas" },
        ]}
      >
        <SumInput size="large" />
      </Form.Item>
      <Form.Item
        name="freeRenders"
        label="Tekin renderlar"
        extra="Har bir mijozga jami nechta render bepul beriladi, 0–100"
        rules={[
          { required: true, message: "Sonini kiriting." },
          { type: "integer", min: 0, max: 100, message: "0 dan 100 gacha butun son" },
        ]}
      >
        <InputNumber size="large" precision={0} className="w-full" />
      </Form.Item>
    </Form>
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3.5">
      <span className="text-xs text-content-muted tabular-nums">
        {pricing.updatedAt ? `Oxirgi o‘zgarish: ${formatDateTime(pricing.updatedAt)}` : "Standart tarif amalda"}
      </span>
      <Button type="primary" disabled={!control.isDirty} loading={control.isSaving} onClick={() => control.form.submit()}>
        Saqlash
      </Button>
    </div>
  </DesignCard>
);

export const DesignPricingPage = () => {
  const { role } = useAuth();
  const canWrite = isAdmin(role);
  const { data, isPending, isError, error, refetch } = useDesignPricing();
  const control = usePricingControl(data, canWrite);

  if (isAccessDenied(error)) {
    return <Forbidden />;
  }

  return (
    <>
      <PageHeader
        title="Narx sozlamasi"
        description="Render narxi va har bir mijozga beriladigan tekin renderlar soni."
      />
      {isError ? (
        <TableErrorState onRetry={() => void refetch()} />
      ) : isPending ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[420px_minmax(0,1fr)]">
          {canWrite ? (
            <PricingEditor pricing={data} control={control} />
          ) : (
            <DesignCard>
              {(
                [
                  ["Bitta render narxi", `${formatNumber(data.pricePerRender)} so‘m`],
                  ["Tekin renderlar", formatNumber(data.freeRenders)],
                ] as [string, string][]
              ).map(([label, value]) => (
                <p key={label} className="flex justify-between text-[13px]">
                  <span className="text-content-muted">{label}</span>
                  <span className="font-semibold text-content tabular-nums">{value}</span>
                </p>
              ))}
              <p className="border-t border-border pt-2.5 text-xs text-content-muted">
                {data.updatedAt ? "Panel orqali o‘rnatilgan" : "Standart qiymat amalda"}
              </p>
            </DesignCard>
          )}
          <Calculator
            pricePerRender={canWrite ? control.live.pricePerRender : data.pricePerRender}
            freeRenders={canWrite ? control.live.freeRenders : data.freeRenders}
          />
        </div>
      )}
      {data && <SaveConfirm pricing={data} control={control} />}
    </>
  );
};
