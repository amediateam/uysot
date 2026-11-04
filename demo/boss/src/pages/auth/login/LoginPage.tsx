import { LoginForm } from "@/components/auth/LoginForm";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { LoginFields } from "./components/LoginFields";
import styles from "./Login.module.css";

export const LoginPage = () => (
  <div className={styles.login}>
    <img src="/bg_new.jpg" className={styles.login_login_newYear_bg} alt="bg" />
    <div className={styles.login_container_div}>
      <div className={styles.login_body}>
        <LoginForm>{(form) => <LoginFields {...form} />}</LoginForm>
      </div>
      <LanguageSwitcher />
    </div>
  </div>
);
