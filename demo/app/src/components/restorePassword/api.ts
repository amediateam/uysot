// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: RestorePassword-D4Gkow_N (1)
import { useMutation } from "react-query";
import { Wa } from "@/services/api/client";
import { Nz } from "@/services/api/endpoints";
import { k$, Qy } from "@/utils/error-handler";
function re(m, o) {
  return useMutation(async (t) => (await Wa.post(Nz.SEND_CODE, t)).data, {
    onSuccess: (t) => {
      if (t.message) {
        k$(t.message, t.accept);
      }
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
export { re };
