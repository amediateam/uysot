// [restore] Путь файла восстановлен точно: data-sentry-source-file в production-бандле.
// [restore] Источник: RestorePassword-D4Gkow_N (3)
import { useTranslation } from "react-i18next";
import * as s from "react";
import { C } from "@/utils/password-policy";
import { Ti } from "@/components/toaster/state";
import { Qy } from "@/utils/error-handler";
import { re } from "@/components/restorePassword/api";
import * as e from "react/jsx-runtime";
import D from "@/components/restorePassword/sendCode/SendCode.module.css";
import { vH as W } from "@/assets/icons/contract/ArrowLeftIcon";
import { Input, Button } from "antd";
import Ne from "react-google-recaptcha";
import { rF as sitekey } from "@/pages/login/Login";
import { useMutation } from "react-query";
import { Wa } from "@/services/api/client";
import { Nz } from "@/services/api/endpoints";
function Te(m, o) {
  return useMutation(async (t) => (await Wa.post(Nz.VERIFY_CODE, t)).data, {
    onSuccess: (t) => {
      if (m) {
        m(t.data);
      }
    },
    onError: (t) => {
      if (o) {
        o(t);
      } else {
        Qy(t);
      }
    },
  });
}
const qe = ["digit-0", "digit-1", "digit-2", "digit-3", "digit-4", "digit-5"];
export const Le = ({ changePage, user, resendAfterSec, handleSuccessStep2 }) => {
  const { t: t_1 } = useTranslation();
  const [g, setG] = s.useState(["", "", "", "", "", ""]);
  const [_, set_] = s.useState(resendAfterSec || 60);
  const [E, setE] = s.useState(false);
  const fRef = s.useRef(null);
  const [w, setW] = s.useState(false);
  const R = () => setW(true);
  const xRef = s.useRef(null);
  const iRef = s.useRef(null);
  const pRef = s.useRef(null);
  const rRef = s.useRef(null);
  const qRef = s.useRef(null);
  const ARef = s.useRef(null);
  const d = [xRef, iRef, pRef, rRef, qRef, ARef];
  s.useEffect(() => {
    set_(resendAfterSec || 60);
  }, [resendAfterSec]);
  s.useEffect(() => {
    if (_ <= 0) {
      return () => {};
    }
    const n = setInterval(() => {
      set_((c) => {
        if (c <= 1) {
          return clearInterval(n), 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(n);
  }, [_]);
  const v = s.useCallback(async () => {
    for (let n = 0; n < 40 && !fRef.current; n++) {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    }
    return fRef.current;
  }, []);
  const N = s.useCallback(async () => {
    R();
    const n = await v();
    n?.reset();
    return (await n?.executeAsync()) ?? null;
  }, [v]);
  const F = Te(
    (n) => {
      handleSuccessStep2(n);
      changePage(3);
    },
    (n) => {
      const b = n?.response?.data?.errorMessage?.messageCode;
      if (b === C.VERIFY_CODE_INCORRECT) {
        setE(true);
        setG(["", "", "", "", "", ""]);
        xRef.current?.focus();
        Ti.error(
          t_1("global.VERIFY_CODE_INCORRECT", {
            defaultValue: "Kod noto'g'ri yoki eskirgan!",
          })
        );
        return;
      }
      if (b === C.RESET_TOO_MANY_ATTEMPTS) {
        Ti.error(
          t_1("global.RESET_TOO_MANY_ATTEMPTS", {
            defaultValue:
              "Kod bir necha marta noto'g'ri kiritildi va bekor qilindi. Yangi kod so'rang!",
          })
        );
        changePage(1);
        return;
      }
      Qy(n);
    }
  );
  const $ = re(
    (n) => {
      set_(n.resendAfterSec || 60);
      setG(["", "", "", "", "", ""]);
      setE(false);
      xRef.current?.focus();
    },
    (n) => {
      const c = n?.response?.data;
      const b = c?.errorMessage?.messageCode;
      const V = c?.errorMessage?.args;
      if (b === C.RESET_TOO_MANY_REQUESTS) {
        const seconds = Number(V?.["&seconds&"]) || 60;
        set_(seconds);
        Ti.error(
          t_1("global.RESET_TOO_MANY_REQUESTS", {
            seconds,
            defaultValue: `Juda ko'p so'rov yuborildi. ${seconds} soniyadan keyin qayta urinib ko'ring!`,
          })
        );
        return;
      }
      Qy(n);
    }
  );
  const oe = (n, c) => {
    setE(false);
    const b = c.target.value.replace(/\D/g, "");
    if (b.length > 1) {
      const O = b.slice(0, 6).split("");
      const X = [...g];
      for (let L = 0; L < 6; L++) {
        X[L] = O[L] || "";
      }
      setG(X);
      const _e = Math.min(O.length, 5);
      d[_e]?.current?.focus({
        cursor: "all",
      });
      return;
    }
    const V = b.slice(-1) || "";
    const I = [...g];
    I[n] = V;
    setG(I);
    if (V && n < 5) {
      d[n + 1]?.current?.focus({
        cursor: "all",
      });
    }
  };
  const ie = (n, c) => {
    if (c.key === "Backspace" && !g[n] && n > 0) {
      d[n - 1]?.current?.focus({
        cursor: "all",
      });
    }
  };
  const ce = (n) => {
    n.preventDefault();
    const c = n.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!c) {
      return;
    }
    setE(false);
    const b = c.split("");
    const V = ["", "", "", "", "", ""];
    for (let O = 0; O < b.length; O++) {
      V[O] = b[O];
    }
    setG(V);
    const I = Math.min(b.length, 5);
    d[I]?.current?.focus({
      cursor: "all",
    });
  };
  const le = () => {
    const code = g.join("");
    if (code.length === 6) {
      F.mutate({
        username: user.username,
        code,
      });
    } else {
      setE(true);
    }
  };
  const ue = () => {
    changePage(1);
  };
  const de = async () => {
    if (_ > 0 || $.isLoading) {
      return;
    }
    let recaptchaToken = null;
    try {
      recaptchaToken = await N();
    } catch {
      fRef.current?.reset();
    }
    $.mutate({
      username: user.username,
      recaptchaToken,
    });
  };
  return (
    <div className={D.container}>
      <h2>
        <W onClick={ue} />
        {t_1("profile.Hisobni_qayta_tiklash")}
      </h2>
      <p>
        {t_1("profile.Biz")} {user.phone} {t_1("profile.raqamiga_olti_xonali_tasdiqlash")}.
      </p>
      <div className={D.container_title}>{t_1("profile.Tasdiqlash_kodi")}</div>
      <div className={D.container_input}>
        {g.map((value, c) => (
          <Input
            key={qe[c]}
            status={E || F.isError ? "error" : undefined}
            ref={d[c]}
            onChange={(b) => oe(c, b)}
            onKeyDown={(b) => ie(c, b)}
            onPaste={c === 0 ? ce : undefined}
            value={value}
            maxLength={6}
            autoFocus={c === 0}
          />
        ))}
      </div>
      <div className={D.container_resent}>
        <span className={D.container_resent_title}>{t_1("profile.Kodni_olmadingizmi")}?</span>
        {_ === 0 ? (
          <span onClick={de} className={D.container_resent_button}>
            {t_1("contract.Qayta_yuborish")}
          </span>
        ) : (
          <span className={D.container_resent_disable_button}>
            {t_1("contract.Qayta_yuborish")} ({_}s)
          </span>
        )}
      </div>
      {w ? <Ne ref={fRef} sitekey={sitekey} size="invisible" /> : null}
      <Button
        loading={F.isLoading}
        onClick={le}
        type="primary"
        htmlType="submit"
        className={D.container_button}
      >
        {t_1("profile.Keyingi")}
      </Button>
    </div>
  );
};
