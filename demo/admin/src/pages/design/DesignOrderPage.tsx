import { EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Image, Skeleton, Tooltip } from "antd";
import type { ImageProps } from "antd";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isAccessDenied, isApiError } from "@/services/api-error";
import { getOrderFile } from "@/services/design/api";
import { useApiMessage } from "@/hooks/use-api-message";
import { useDesignOrder, useDesignStyles, useOrderFile } from "@/hooks/design";
import { formatNumber } from "@/utils/format-number";
import { formatDateTime } from "@/utils/format-date-time";
import { DesignCard } from "@/components/ui/DesignCard";
import { StatusChip } from "@/components/ui/StatusChip";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { TableErrorState } from "@/components/ui/TableErrorState";
import { OrderStatusChip } from "@/components/ui/OrderStatusChip";
import { Forbidden } from "@/pages/forbidden/Forbidden";
import type { DesignOrderDetail, DesignRoom } from "@/services/design/types";
import type { OrderStatus } from "@/components/ui/OrderStatusChip";

const RENDER_BOX = "flex h-24 w-37.5 shrink-0 items-center justify-center rounded-md";
const BLOB_URL_TTL = 60_000;

const OrderHeader = ({ detail }: { detail: DesignOrderDetail }) => {
  const { order } = detail;
  const toast = useApiMessage();
  const copyPhone = () => {
    navigator.clipboard
      .writeText(detail.userPhone)
      .then(() => toast.success("Nusxalandi"))
      .catch(() => toast.errorText("Nusxalab bo‘lmadi."));
  };
  const ids: [string, number | null][] = [
    ["userId", detail.userId],
    ["contractId", order.contractId],
    ["flatId", order.flatId],
  ];
  return (
    <>
      <nav className="mb-4 flex items-center gap-2 text-[13px] text-content-muted">
        <Link to={ROUTES.designOrders} className="hover:text-accent">
          Buyurtmalar
        </Link>
        <span>/</span>
        <span className="font-mono font-medium text-content">#{order.id}</span>
      </nav>
      <DesignCard className="mb-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-7">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-content">Buyurtma #{order.id}</h1>
            <OrderStatusChip status={order.status} />
            {order.price?.amountDue === 0 && <StatusChip tone="success" label="Tekin" />}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-content">{detail.userPhone}</span>
            <Button size="small" onClick={copyPhone}>
              Nusxalash
            </Button>
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-x-6 gap-y-1 lg:border-l lg:border-border lg:pl-7">
          {ids.map(([label]) => (
            <dt key={label} className="text-[11px] text-content-muted">
              {label}
            </dt>
          ))}
          {ids.map(([label, value]) => (
            <dd key={label} className="font-mono text-[13px] text-content">
              {formatNumber(value)}
            </dd>
          ))}
        </dl>
        <div className="flex gap-7 lg:border-l lg:border-border lg:pl-7">
          <AreaMetric value={detail.flatAreaSqm} label="umumiy maydon" />
          <AreaMetric value={detail.flatLivingAreaSqm} label="yashash maydoni" />
        </div>
        {order.status === "GENERATION_FAILED" && (
          <p className="basis-full rounded-md bg-danger-soft px-3 py-2.5 text-[13px] text-danger-strong">
            {order.producedImageCount} / {order.requestedImageCount} render chizildi, keyin yaratish to‘xtadi. Qolgan
            renderlar joyida bo‘sh kataklar qoladi.
          </p>
        )}
      </DesignCard>
    </>
  );
};

const AreaMetric = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col gap-0.5">
    <p className="flex items-baseline gap-1">
      <span className="text-[28px] leading-none font-bold tracking-tight text-content tabular-nums">
        {formatNumber(value)}
      </span>
      <span className="text-xs text-content-muted">m²</span>
    </p>
    <p className="text-[11px] text-content-muted">{label}</p>
  </div>
);

const PriceCard = ({ detail }: { detail: DesignOrderDetail }) => {
  const { price, paidAt } = detail.order;
  if (!price) {
    return (
      <DesignCard title="Narx">
        <p className="text-[13px] text-content-muted">
          Buyurtma to‘lov joriy qilinishidan oldin yaratilgan — narx yozilmagan.
        </p>
      </DesignCard>
    );
  }
  const rows: [string, string][] = [
    ["Jami render", formatNumber(price.totalRenders)],
    ["Tekin", formatNumber(price.freeRenders)],
    ["Pullik", formatNumber(price.paidRenders)],
    ["1 render narxi", `${formatNumber(price.pricePerRender)} so‘m`],
  ];
  const status = paidAt
    ? `To‘langan: ${formatDateTime(paidAt)}`
    : price.amountDue === 0
      ? "Tekin buyurtma"
      : "Hali to‘lanmagan";
  return (
    <DesignCard title="Narx">
      <dl className="flex flex-col gap-2 text-[13px]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <dt className="text-content-muted">{label}</dt>
            <dd className="text-content tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-baseline justify-between border-t border-border pt-3">
        <span className="text-[13px] text-content-muted">To‘lanadigan</span>
        <span className="flex items-baseline gap-1">
          <span className="text-[26px] font-bold tracking-tight text-content tabular-nums">
            {formatNumber(price.amountDue)}
          </span>
          <span className="text-xs text-content-muted">so‘m</span>
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-content-muted">
        <span className="tabular-nums">{status}</span>
        {detail.servicePaymentId !== null && (
          <Link to={ROUTES.designPaymentDetail(String(detail.servicePaymentId))} className="font-semibold">
            To‘lovni ochish →
          </Link>
        )}
      </div>
    </DesignCard>
  );
};

const useReportOpener = () => {
  const [isOpening, setIsOpening] = useState(false);
  const toast = useApiMessage();
  return {
    isOpening,
    openReport: async (orderId: number, fileId: number) => {
      const tab = window.open("", "_blank");
      if (!tab) {
        toast.errorText("Brauzer yangi oynani ochishga ruxsat bermadi.");
        return;
      }
      setIsOpening(true);
      try {
        const blob = await getOrderFile(orderId, fileId);
        const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
        tab.location.href = url;
        window.setTimeout(() => URL.revokeObjectURL(url), BLOB_URL_TTL);
      } catch (error) {
        tab.close();
        toast.error(error);
      } finally {
        setIsOpening(false);
      }
    },
  };
};

const EstimateCard = ({ detail }: { detail: DesignOrderDetail }) => {
  const { openReport, isOpening } = useReportOpener();
  const { order, reportFileId } = detail;
  const unmeasured = order.rooms.filter((room) => room.areaSqm === null).map((room) => room.label);
  const note =
    order.totalEstimatedCost === null
      ? "Reja hali tahlil qilinmagan."
      : unmeasured.length > 0
        ? `${unmeasured.join(", ")} hali o‘lchanmagan — jami keyin yangilanadi.`
        : null;
  return (
    <>
      <DesignCard title="Smeta">
        <p className="flex items-baseline gap-1.5">
          <span className="text-3xl leading-none font-bold tracking-tight text-content tabular-nums">
            {formatNumber(order.totalEstimatedCost)}
          </span>
          <span className="text-[13px] text-content-muted">so‘m</span>
        </p>
        {note && <p className="text-xs text-content-muted">{note}</p>}
        {reportFileId === null ? (
          <Tooltip title="PDF hali tayyor emas">
            <span>
              <Button block disabled>
                PDF ni ochish
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button type="primary" block loading={isOpening} onClick={() => void openReport(order.id, reportFileId)}>
            PDF ni ochish
          </Button>
        )}
      </DesignCard>
      <DesignCard>
        {(
          [
            ["Yaratilgan", order.createdAt],
            ["Oxirgi yangilangan", order.updatedAt],
          ] as [string, string][]
        ).map(([label, value]) => (
          <p key={label} className="flex justify-between text-xs">
            <span className="text-content-muted">{label}</span>
            <span className="text-content tabular-nums">{formatDateTime(value)}</span>
          </p>
        ))}
      </DesignCard>
    </>
  );
};

const RenderImage = ({ orderId, fileId }: { orderId: number; fileId: number }) => {
  const { data, isPending, isError } = useOrderFile(orderId, fileId);
  if (isPending) {
    return <div className={`${RENDER_BOX} animate-pulse bg-surface-muted`} />;
  }
  if (isError || !data) {
    return <div className={`${RENDER_BOX} bg-surface-muted text-[11px] text-content-muted`}>yuklanmadi</div>;
  }
  return (
    <Image
      src={data}
      alt=""
      rootClassName="h-24 w-37.5 shrink-0 overflow-hidden rounded-md"
      className="h-24 w-37.5 object-cover"
      preview={{ cover: <EyeOutlined className="text-base" /> } as ImageProps["preview"]}
    />
  );
};

const RenderPlaceholder = ({ status }: { status: OrderStatus }) => {
  if (status === "GENERATION_FAILED") {
    return (
      <div className={`${RENDER_BOX} border border-dashed border-danger bg-danger-soft text-[11px] text-danger-strong`}>
        chizilmadi
      </div>
    );
  }
  const generating = status === "GENERATING";
  return (
    <div
      className={`${RENDER_BOX} flex-col gap-1.5 border border-dashed border-border-strong bg-surface-muted text-[11px] text-content-muted`}
    >
      {generating && <LoadingOutlined className="text-sm text-progress" />}
      {generating ? "chizilmoqda" : "navbatda"}
    </div>
  );
};

const TOILET_COMBINED: Record<string, string> = {
  true: "hojatxona bilan birga",
  false: "hojatxona alohida",
};

const RoomCard = ({ orderId, room, status }: { orderId: number; room: DesignRoom; status: OrderStatus }) => {
  const missing = Math.max(room.imageCount - room.renders.length, 0);
  const toiletNote =
    room.type === "SANUZEL" && room.combinedWithToilet !== null
      ? TOILET_COMBINED[String(room.combinedWithToilet)]
      : null;
  return (
    <div
      className={`flex flex-col gap-3 rounded-lg bg-surface px-4.5 py-4 shadow-card ${
        room.imageCount === 0 ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex min-w-44 flex-col gap-0.5">
          <p className="text-sm font-semibold text-content">{room.label}</p>
          <p className="font-mono text-[11px] text-content-muted">
            {room.type}
            {toiletNote && ` · ${toiletNote}`}
          </p>
        </div>
        <div className="flex gap-6 text-[13px] text-content tabular-nums">
          {room.areaSqm === null ? (
            <span className="text-content-muted">hali o‘lchanmagan</span>
          ) : (
            <span>
              {formatNumber(room.areaSqm)} <span className="text-content-muted">m²</span>
            </span>
          )}
          <span>{room.estimatedCost === null ? "—" : `${formatNumber(room.estimatedCost)} so‘m`}</span>
        </div>
        <div className="ml-auto">
          {room.imageCount === 0 ? (
            <StatusChip tone="neutral" label="faqat smeta" />
          ) : (
            <span className="text-xs text-content-muted tabular-nums">
              {room.renders.length} / {room.imageCount} render
            </span>
          )}
        </div>
      </div>
      {room.imageCount > 0 && (
        <div className="flex flex-wrap gap-2">
          <Image.PreviewGroup
            preview={{ countRender: (current, total) => `${room.label} · render ${current} / ${total}` }}
          >
            {room.renders.map((render) => (
              <RenderImage key={render.fileId} orderId={orderId} fileId={render.fileId} />
            ))}
          </Image.PreviewGroup>
          {Array.from({ length: missing }, (_v, index) => (
            <RenderPlaceholder key={index} status={status} />
          ))}
        </div>
      )}
    </div>
  );
};

export const DesignOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data, isPending, isError, error, refetch } = useDesignOrder(Number(orderId));
  const { data: styles } = useDesignStyles();

  if (isAccessDenied(error)) {
    return <Forbidden />;
  }
  if (isApiError(error) && error.code === ApiErrorCode.DESIGN_ORDER_NOT_FOUND) {
    return (
      <DesignCard>
        <TableEmptyState
          title="Buyurtma topilmadi"
          description={`#${orderId} raqamli buyurtma yo‘q.`}
          action={{ label: "Buyurtmalarga qaytish", onClick: () => navigate(ROUTES.designOrders) }}
        />
      </DesignCard>
    );
  }
  if (isError) {
    return <TableErrorState onRetry={() => void refetch()} />;
  }
  if (isPending) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  const { order } = data;
  const styleName = styles?.find((style) => style.id === order.styleId)?.name;

  return (
    <>
      <OrderHeader detail={data} />
      <div className="grid items-start gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <PriceCard detail={data} />
          <EstimateCard detail={data} />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[15px] font-semibold text-content">
              Xonalar{styleName && <span className="font-normal text-content-muted"> · uslub {styleName}</span>}
            </h2>
            <span className="text-xs text-content-muted tabular-nums">
              {order.producedImageCount} / {order.requestedImageCount} render tayyor
            </span>
          </div>
          {order.rooms.map((room) => (
            <RoomCard key={room.id} orderId={order.id} room={room} status={order.status} />
          ))}
        </div>
      </div>
    </>
  );
};
