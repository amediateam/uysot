// Заглушка вместо закрытой части приложения (/main/*), которая не восстановлена.
// Показывается только в mock-режиме; в обычном режиме работает исходный ReloadToAppShell.
import { Button, Descriptions, Result, Tag } from "antd";
import { useLocation } from "react-router-dom";
import { V$ as logout } from "@/utils/logout";

export function MockAppShell() {
  const { pathname } = useLocation();
  let user: any = null;
  try {
    user = JSON.parse(
      JSON.parse(localStorage.getItem("user-data") ?? "null") ?? "null"
    );
  } catch {
    /* пусто */
  }
  if (!user) {
    try {
      user = JSON.parse(localStorage.getItem("user-data") ?? "null");
    } catch {
      /* пусто */
    }
  }
  if (!localStorage.getItem("token")) {
    window.location.replace("/");
    return null;
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 720,
          width: "100%",
          background: "var(--surface, #fff)",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 10px 40px rgba(0,0,0,.08)",
        }}
      >
        <Result
          status="success"
          title="Вход выполнен (mock API)"
          subTitle={
            <>
              Запрошен маршрут <Tag color="green">{pathname}</Tag>. Закрытая
              часть приложения ещё не восстановлена — здесь будет её интерфейс.
            </>
          }
          extra={
            <Button danger onClick={() => logout()}>
              Выйти
            </Button>
          }
        />
        {user && (
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Пользователь">
              {user.fullName} ({user.username})
            </Descriptions.Item>
            <Descriptions.Item label="Компания">
              {user.companyName} (id {user.companyId})
            </Descriptions.Item>
            <Descriptions.Item label="Часовой пояс">
              {user.companyTimeZone}
            </Descriptions.Item>
            <Descriptions.Item label="Разрешений">
              {user.role?.permissions?.length ?? 0}
            </Descriptions.Item>
            <Descriptions.Item label="Токен">
              {String(user.accessToken).slice(0, 40)}…
            </Descriptions.Item>
          </Descriptions>
        )}
      </div>
    </div>
  );
}
