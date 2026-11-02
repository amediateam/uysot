// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: webPushSession-CGnGvNL1 (1)
import { ce } from "@/utils/storage";
import { fz } from "@/constants/storage-keys";
export async function unregisterWebPushFromBackendAndFcm() {
  const { disconnectFirebaseFcmPush } = await (async () => {
    const { disconnectFirebaseFcmPush } = await import("@/services/firebase");
    return {
      disconnectFirebaseFcmPush,
    };
  })();
  await disconnectFirebaseFcmPush();
  ce.remove(fz);
}
