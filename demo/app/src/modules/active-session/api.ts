// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (4)
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Uv, Wa } from "@/services/api/client";
import be from "dayjs";
import { Aa } from "@/constants/index";
const v$ = ({ date, timeStamp, format }) => {
  if (timeStamp) {
    const n = timeStamp > 9999999999 ? Math.floor(timeStamp / 1000) : timeStamp;
    return be
      .unix(n)
      .tz()
      .format(format || Aa);
  }
  return date || "";
};
function FU(e = {}) {
  return useQuery({
    queryKey: [Uv.ACTIVE_SESSION_USER],
    queryFn: async () =>
      (
        (
          await Wa.get("/v1/active/session/user", {
            withCredentials: true,
          })
        )?.data?.data ?? []
      )?.map((r) => ({
        ...r,
        lastActiveDateTime: v$({
          timeStamp: r.lastActiveTimestamp,
        }),
      })),
    enabled: e.enabled ?? true,
    staleTime: 0,
  });
}
function $U(e = {}) {
  const t = useQueryClient();
  return useMutation(
    async (r) =>
      (
        await Wa.post("/v1/active/session/terminate", r, {
          withCredentials: true,
        })
      )?.data,
    {
      onSuccess: (r) => {
        t.invalidateQueries([Uv.ACTIVE_SESSION_USER]);
        e.onSuccess?.(r);
      },
    }
  );
}
const VU = (e) => {
  if (e) {
    return e.split(",").filter(Boolean).slice(-2).join(", ") || e;
  }
  return "";
};
export { $U, FU, VU };
