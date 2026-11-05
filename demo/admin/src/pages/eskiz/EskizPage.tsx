import { ArrowRightOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { ApiErrorCode } from "@/constants/api-error-codes";
import { isSuperAdmin } from "@/permissions";
import { isApiError } from "@/services/api-error";
import { useAuth } from "@/hooks/use-auth";
import { useApiMessage } from "@/hooks/use-api-message";
import {
  useActivateEskizAccount,
  useCreateEskizAccount,
  useDeleteEskizAccount,
  useEskizAccounts,
  useEskizBalance,
  useSetEskizPassword,
  useTestSendSms,
  useUpdateEskizAccount,
  useVerifyEskizAccount,
} from "@/hooks/eskiz";
import { formatNumber } from "@/utils/format-number";
import { formatDateTime } from "@/utils/format-date-time";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { PasswordInput, TextArea, TextInput } from "@/components/ui/AppInput";
import { AppModal } from "@/components/ui/AppModal";
import { SidePanel } from "@/components/ui/SidePanel";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { StatusChip } from "@/components/ui/StatusChip";
import { TableEmptyState } from "@/components/ui/TableEmptyState";
import { RowActions } from "@/components/ui/RowActions";
import type { EskizAccount } from "@/services/eskiz/types";

const DEFAULT_VERIFY_ERROR = "Eskiz kirishni rad etdi";
const SUPER_ADMIN_ONLY = "Bu amal SUPER_ADMIN uchun";
const CANNOT_DELETE_ACTIVE = "Jonli akkaunt o‘chirilmaydi — avval boshqasini jonli qiling";
const PHONE_RE = /^\+998\d{9}$/;
const MAX_SMS_LENGTH = 500;
const TEST_SMS_MESSAGE = "Uysot: test xabar. Kredentiallar tekshirilmoqda.";

const verifyResult = (account: EskizAccount): { ok: boolean; text: string } =>
  account.lastVerifyOk === true
    ? { ok: true, text: "Kredentiallar ishlayapti" }
    : { ok: false, text: account.lastVerifyError ?? DEFAULT_VERIFY_ERROR };

const ActivateAccountModal = ({
  target,
  current,
  onClose,
}: {
  target: EskizAccount | null;
  current?: EskizAccount;
  onClose: () => void;
}) => {
  const toast = useApiMessage();
  const activate = useActivateEskizAccount();
  const verify = useVerifyEskizAccount();
  const unverified = target?.lastVerifyOk !== true;
  return (
    <ConfirmModal
      open={target !== null}
      title="Jonli akkauntni almashtirish"
      description="Bu barcha chiquvchi SMS bog‘liq bo‘lgan kredentialni almashtiradi. Kredentiallar ishlamasa, SMS yuborish to‘xtaydi — avval “Tekshirish” ni bosish tavsiya etiladi."
      confirmLabel="Jonli qilish"
      loading={activate.isPending}
      auditNote
      onCancel={onClose}
      onConfirm={() => {
        if (!target) return;
        activate.mutate(target.id, {
          onSuccess: () => {
            toast.success(`${target.username} endi jonli akkaunt`);
            onClose();
          },
          onError: (error) => toast.error(error),
        });
      }}
      extraAction={
        unverified && target ? (
          <Button
            loading={verify.isPending}
            onClick={() =>
              verify.mutate(target.id, {
                onSuccess: (account) => {
                  const result = verifyResult(account);
                  if (result.ok) toast.success(result.text);
                  else toast.errorText(result.text);
                },
                onError: (error) => toast.error(error),
              })
            }
          >
            Tekshirish
          </Button>
        ) : undefined
      }
    >
      {target && (
        <div className="flex flex-wrap items-center gap-4 rounded-lg bg-surface-muted px-4 py-3">
          <div>
            <p className="text-[13px] font-medium text-content">{target.username}</p>
            <p className="text-xs text-content-muted">yangi jonli</p>
          </div>
          {current && current.id !== target.id && (
            <>
              <ArrowRightOutlined className="text-content-muted" />
              <div>
                <p className="text-[13px] font-medium text-content">{current.username}</p>
                <p className="text-xs text-content-muted">zaxiraga o‘tadi</p>
              </div>
            </>
          )}
        </div>
      )}
      {unverified && <Alert type="warning" showIcon className="mt-4" message="Bu akkaunt hali tekshirilmagan." />}
    </ConfirmModal>
  );
};

const DeleteAccountModal = ({ target, onClose }: { target: EskizAccount | null; onClose: () => void }) => {
  const toast = useApiMessage();
  const remove = useDeleteEskizAccount();
  return (
    <ConfirmModal
      open={target !== null}
      tone="danger"
      title={target ? `“${target.username}” akkaunti o‘chirilsinmi?` : ""}
      description="Qator butunlay o‘chadi va uni tiklab bo‘lmaydi. Parolni qayta kiritmasdan tiklashning iloji yo‘q — kerak bo‘lsa, akkauntni qaytadan qo‘shishga to‘g‘ri keladi."
      confirmLabel="O‘chirish"
      loading={remove.isPending}
      auditNote
      onCancel={onClose}
      onConfirm={() => {
        if (!target) return;
        remove.mutate(target.id, {
          onSuccess: () => {
            toast.success(`${target.username} o‘chirildi`);
            onClose();
          },
          onError: (error) => toast.error(error),
        });
      }}
    >
      <p className="text-[13px] leading-relaxed text-content-secondary">
        Audit jurnalidagi yozuvlar login bilan saqlanib qoladi, shuning uchun tarix qator o‘chgandan keyin ham o‘qiladi.
      </p>
    </ConfirmModal>
  );
};

interface AccountFormValues {
  username: string;
  password?: string;
  originator?: string | null;
}

const AccountFormPanel = ({
  open,
  account,
  onClose,
}: {
  open: boolean;
  account: EskizAccount | null;
  onClose: () => void;
}) => {
  const [form] = Form.useForm<AccountFormValues>();
  const toast = useApiMessage();
  const create = useCreateEskizAccount();
  const update = useUpdateEskizAccount();
  const isEdit = account !== null;
  const error = create.error ?? update.error;

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (account) {
        form.setFieldsValue({ username: account.username, originator: account.originator ?? undefined });
      }
    }
  }, [open, account, form]);

  return (
    <SidePanel
      open={open}
      title={isEdit ? "Akkauntni tahrirlash" : "Akkaunt qo‘shish"}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button type="primary" loading={create.isPending || update.isPending} onClick={() => form.submit()}>
            {isEdit ? "Saqlash" : "Qo‘shish"}
          </Button>
        </>
      }
    >
      {isApiError(error) && error.code !== ApiErrorCode.ESKIZ_USERNAME_TAKEN && (
        <Alert type="error" showIcon className="mb-4" message={error.message} />
      )}
      <Form<AccountFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={(values) => {
          const onError = (err: unknown) => {
            if (isApiError(err) && err.code === ApiErrorCode.ESKIZ_USERNAME_TAKEN) {
              form.setFields([{ name: "username", errors: ["Bu login qo‘shilgan"] }]);
              return;
            }
            toast.error(err);
          };
          const onSuccess = () => {
            toast.success(isEdit ? "Akkaunt saqlandi" : "Akkaunt qo‘shildi");
            onClose();
          };
          if (account) {
            update.mutate(
              { id: account.id, username: values.username, originator: values.originator ?? null },
              { onSuccess, onError },
            );
            return;
          }
          create.mutate(
            { username: values.username, password: values.password ?? "", originator: values.originator ?? null },
            { onSuccess, onError },
          );
        }}
      >
        <Form.Item name="username" label="Login" rules={[{ required: true, message: "Login kiriting." }]}>
          <TextInput placeholder="uysot_new" autoComplete="off" />
        </Form.Item>
        {!isEdit && (
          <Form.Item name="password" label="Parol" rules={[{ required: true, message: "Parol kiriting." }]}>
            <PasswordInput placeholder="••••••••••" autoComplete="new-password" />
          </Form.Item>
        )}
        <Form.Item name="originator" label="originator" extra="SMS da ko‘rinadigan jo‘natuvchi nomi.">
          <TextInput placeholder="Uysot" />
        </Form.Item>
      </Form>
      <p className="text-xs leading-relaxed text-content-muted">
        {isEdit
          ? "Parol maydoni bu yerda yo‘q — u alohida amal."
          : "Yangi akkaunt darhol jonli bo‘lmaydi — avval “Tekshirish”, keyin “Jonli qilish”."}
      </p>
    </SidePanel>
  );
};

const VerifyCell = ({ account }: { account: EskizAccount }) => {
  if (account.lastVerifyOk === true) {
    return (
      <div>
        <p className="text-[13px] text-success-strong">✓ Kredentiallar ishlayapti</p>
        <p className="text-xs text-content-muted">{formatDateTime(account.lastVerifiedAt)}</p>
      </div>
    );
  }
  if (account.lastVerifyOk === false) {
    return (
      <div>
        <p className="text-[13px] text-danger-strong">✕ Eskiz kirishni rad etdi</p>
        {account.lastVerifyError && <p className="text-xs text-content-muted">{account.lastVerifyError}</p>}
      </div>
    );
  }
  return <span className="text-[13px] text-content-muted">Tekshirilmagan</span>;
};

const AccountsTable = ({
  onCreate,
  onChangePassword,
  onActivate,
  onDelete,
}: {
  onCreate: () => void;
  onChangePassword: (account: EskizAccount) => void;
  onActivate: (account: EskizAccount) => void;
  onDelete: (account: EskizAccount) => void;
}) => {
  const toast = useApiMessage();
  const { role } = useAuth();
  const canManage = isSuperAdmin(role);
  const { data, isPending, isError, refetch } = useEskizAccounts();
  const verify = useVerifyEskizAccount();

  const columns: ColumnsType<EskizAccount> = [
    {
      title: "Login",
      key: "username",
      render: (_v, record) => <span className="text-[13px] font-medium text-content">{record.username}</span>,
    },
    {
      title: "originator",
      key: "originator",
      width: 140,
      render: (_v, record) =>
        record.originator ? (
          <span className="text-[13px] text-content">{record.originator}</span>
        ) : (
          <span className="text-content-muted">—</span>
        ),
    },
    {
      title: "Holat",
      key: "status",
      width: 110,
      render: (_v, record) => (
        <StatusChip tone={record.isActive ? "success" : "neutral"} label={record.isActive ? "Faol" : "Zaxira"} />
      ),
    },
    {
      title: "Oxirgi o‘zgarish",
      key: "updated",
      width: 180,
      render: (_v, record) => <span className="text-[13px] text-content-muted">{formatDateTime(record.updatedAt)}</span>,
    },
    { title: "Tekshiruv", key: "verify", width: 240, render: (_v, record) => <VerifyCell account={record} /> },
    {
      title: <span className="sr-only">Amallar</span>,
      key: "actions",
      width: 80,
      align: "right",
      render: (_v, record) => (
        <RowActions
          label={`${record.username} amallari`}
          actions={[
            {
              key: "verify",
              label: "Tekshirish",
              disabled: verify.isPending,
              onClick: () =>
                verify.mutate(record.id, {
                  onSuccess: (account) => {
                    const result = verifyResult(account);
                    if (result.ok) toast.success(result.text);
                    else toast.errorText(result.text);
                  },
                  onError: (error) => toast.error(error),
                }),
            },
            { key: "password", label: "Parolni almashtirish", onClick: () => onChangePassword(record) },
            {
              key: "activate",
              label: "Jonli qilish",
              disabled: !canManage || record.isActive,
              disabledReason: canManage ? undefined : SUPER_ADMIN_ONLY,
              onClick: () => onActivate(record),
            },
            {
              key: "delete",
              label: "O‘chirish",
              danger: true,
              disabled: record.isActive,
              disabledReason: record.isActive ? CANNOT_DELETE_ACTIVE : undefined,
              onClick: () => onDelete(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-medium text-content">Akkauntlar</h2>
        <p className="text-xs text-content-muted">Parol hech qachon ko‘rsatilmaydi — faqat almashtiriladi</p>
      </div>
      <DataTable<EskizAccount>
        columns={columns}
        data={data}
        rowKey="id"
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        emptyState={
          <TableEmptyState
            title="Akkaunt yo‘q"
            description="SMS jo‘natish uchun kamida bitta Eskiz akkaunti kerak."
            action={{ label: "Akkaunt qo‘shish", onClick: onCreate }}
          />
        }
        pagination={false}
      />
    </>
  );
};

const BalanceBar = ({ account, onTestSms }: { account: EskizAccount; onTestSms: () => void }) => {
  const { role } = useAuth();
  const canManage = isSuperAdmin(role);
  const { data, isError } = useEskizBalance(true);
  const balance = isError ? null : (data?.balance ?? null);
  const balanceUnavailable = !isError && data?.balance === null;

  return (
    <section className="mb-6 flex flex-wrap items-center gap-8 rounded-xl border border-border bg-surface p-5">
      <div>
        <p className="text-[13px] text-content-muted">Qolgan balans</p>
        {balanceUnavailable ? (
          <p className="mt-1 text-xl font-medium text-content-muted">ma’lumot yo‘q</p>
        ) : (
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-content tabular-nums">{formatNumber(balance)}</span>
            <span className="text-[13px] text-content-muted">SMS</span>
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] text-content-muted">Jonli akkaunt</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-medium text-content">{account.username}</span>
          <StatusChip tone="success" label="Faol" />
        </div>
        <p className="mt-1 text-xs text-content-muted">Oxirgi tekshirish: {formatDateTime(account.lastVerifiedAt)}</p>
      </div>
      <div className="w-full sm:ml-auto sm:w-auto sm:text-right">
        <Tooltip title={canManage ? undefined : SUPER_ADMIN_ONLY}>
          <span className="inline-block">
            <Button disabled={!canManage} onClick={onTestSms}>
              Test SMS yuborish
            </Button>
          </span>
        </Tooltip>
        <p className="mt-1 text-xs text-content-muted">haqiqiy SMS, pul turadi</p>
      </div>
      {balanceUnavailable && (
        <p className="w-full text-xs leading-relaxed text-content-muted">
          Eskiz balansni qaytarmadi. Bu xato emas — SMS yuborish ishlashda davom etadi.
        </p>
      )}
    </section>
  );
};

const ChangePasswordModal = ({
  open,
  account,
  onClose,
}: {
  open: boolean;
  account: EskizAccount | null;
  onClose: () => void;
}) => {
  const [form] = Form.useForm<{ password: string }>();
  const toast = useApiMessage();
  const setPassword = useSetEskizPassword();

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  return (
    <AppModal
      open={open}
      title="Parolni almashtirish"
      onCancel={onClose}
      footer={
        <>
          <Button onClick={onClose}>Bekor qilish</Button>
          <Button type="primary" loading={setPassword.isPending} onClick={() => form.submit()}>
            Saqlash
          </Button>
        </>
      }
    >
      {account && (
        <div className="mb-5 flex items-center gap-2">
          <span className="text-[13px] font-medium text-content">{account.username}</span>
          <StatusChip tone={account.isActive ? "success" : "neutral"} label={account.isActive ? "Faol" : "Zaxira"} />
        </div>
      )}
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={({ password }) => {
          if (!account) return;
          setPassword.mutate(
            { id: account.id, password },
            {
              onSuccess: () => {
                toast.success("Parol almashtirildi. Endi “Tekshirish” ni bosing.");
                onClose();
              },
              onError: (error) => toast.error(error),
            },
          );
        }}
      >
        <Form.Item name="password" label="Yangi parol" rules={[{ required: true, message: "Yangi parolni kiriting." }]}>
          <PasswordInput placeholder="••••••••••••" autoComplete="new-password" />
        </Form.Item>
      </Form>
      <p className="text-xs leading-relaxed text-content-muted">
        Joriy parol so‘ralmaydi — u faqat serverda shifrlangan holda saqlanadi va operatorga ko‘rinmaydi. Almashtirgandan keyin
        “Tekshirish” ni bosing.
      </p>
    </AppModal>
  );
};

const TestSmsModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form] = Form.useForm<{ phoneNumber: string; message: string }>();
  const { mutate, isPending, data, error, reset } = useTestSendSms();

  useEffect(() => {
    if (open) {
      reset();
      form.resetFields();
      form.setFieldsValue({ message: TEST_SMS_MESSAGE });
    }
  }, [open, form, reset]);

  const close = () => {
    reset();
    onClose();
  };

  if (data) {
    return (
      <AppModal open={open} title="SMS yuborildi" onCancel={close} footer={<Button onClick={close}>Yopish</Button>}>
        <p className="text-[13px] text-content">
          {form.getFieldValue("phoneNumber")} · {data.username}
        </p>
        <p className="mt-1 text-[13px] text-content-muted">
          status: {data.status} · id {data.messageId}
        </p>
        {data.balanceAfter !== null && (
          <p className="mt-3 text-[13px] text-content-secondary">
            Balansdan 1 SMS yechildi. Qolgan: {data.balanceAfter}.
          </p>
        )}
      </AppModal>
    );
  }

  if (isApiError(error) && error.providerMessage) {
    return (
      <AppModal
        open={open}
        title="Yuborilmadi"
        onCancel={close}
        footer={
          <>
            <Button onClick={close}>Yopish</Button>
            <Button type="primary" onClick={reset}>
              Qayta urinish
            </Button>
          </>
        }
      >
        <p className="text-[13px] font-medium text-content">Eskiz javobi:</p>
        <p className="mt-1 font-mono text-[13px] text-danger-strong">
          {error.providerStatus} · "{error.providerMessage}"
        </p>
        <p className="mt-4 text-xs leading-relaxed text-content-muted">
          Sabab yashirilmaydi — Eskiz qaytargan matn to‘g‘ridan-to‘g‘ri ko‘rsatiladi. Balansdan pul yechilmadi.
        </p>
      </AppModal>
    );
  }

  return (
    <AppModal
      open={open}
      title="Test SMS yuborish"
      onCancel={close}
      footer={
        <>
          <Button onClick={close}>Bekor qilish</Button>
          <Button type="primary" loading={isPending} onClick={() => form.submit()}>
            Yuborish
          </Button>
        </>
      }
    >
      {isApiError(error) && !error.providerMessage && (
        <Alert type="error" showIcon className="mb-4" message={error.message} />
      )}
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={(values) => mutate(values)}
      >
        <Form.Item
          name="phoneNumber"
          label="Telefon raqami"
          extra="Format: +998XXXXXXXXX"
          rules={[
            { required: true, message: "Telefon raqamini kiriting." },
            { pattern: PHONE_RE, message: "Format: +998XXXXXXXXX" },
          ]}
        >
          <TextInput placeholder="+998901234567" />
        </Form.Item>
        <Form.Item
          name="message"
          label="Matn"
          rules={[
            { required: true, message: "Matnni kiriting." },
            { max: MAX_SMS_LENGTH, message: `Ko‘pi bilan ${MAX_SMS_LENGTH} belgi` },
          ]}
        >
          <TextArea rows={3} maxLength={MAX_SMS_LENGTH} />
        </Form.Item>
      </Form>
      <Alert type="warning" showIcon message="Bu haqiqiy SMS — haqiqiy telefonga ketadi va balansdan pul yechiladi." />
    </AppModal>
  );
};

export const EskizPage = () => {
  const { data } = useEskizAccounts();
  const activeAccount = data?.find((account) => account.isActive);
  const [formAccount, setFormAccount] = useState<EskizAccount | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [passwordAccount, setPasswordAccount] = useState<EskizAccount | null>(null);
  const [activateTarget, setActivateTarget] = useState<EskizAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EskizAccount | null>(null);
  const [testOpen, setTestOpen] = useState(false);

  const openCreate = () => {
    setFormAccount(null);
    setFormOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Eskiz sozlamalari"
        description="SMS jo‘natish kredentiallari — bir vaqtda faqat bitta akkaunt jonli bo‘ladi."
        actions={
          <Button type="primary" onClick={openCreate}>
            Akkaunt qo‘shish
          </Button>
        }
      />
      {activeAccount && <BalanceBar account={activeAccount} onTestSms={() => setTestOpen(true)} />}
      <AccountsTable
        onCreate={openCreate}
        onChangePassword={setPasswordAccount}
        onActivate={setActivateTarget}
        onDelete={setDeleteTarget}
      />
      <AccountFormPanel open={formOpen} account={formAccount} onClose={() => setFormOpen(false)} />
      <ChangePasswordModal
        open={passwordAccount !== null}
        account={passwordAccount}
        onClose={() => setPasswordAccount(null)}
      />
      <ActivateAccountModal target={activateTarget} current={activeAccount} onClose={() => setActivateTarget(null)} />
      <DeleteAccountModal target={deleteTarget} onClose={() => setDeleteTarget(null)} />
      <TestSmsModal open={testOpen} onClose={() => setTestOpen(false)} />
    </>
  );
};
