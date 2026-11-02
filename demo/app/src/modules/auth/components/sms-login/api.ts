// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: sms-login-C3nOBmnF (1)
import { useMutation } from "react-query";
import { B } from "@/modules/auth/components/company-select-step";
import { Es } from "@/services/api/client";
import { Jt } from "@/services/api/endpoints";
import { Qy } from "@/utils/error-handler";
function sd(e) {
  return useMutation(
    async (d) =>
      B(
        await Es.post(Jt.OTP_SEND, {
          ...d,
          channel: "SMS",
        })
      ),
    {
      onError: e ?? Qy,
    }
  );
}
export { sd };
