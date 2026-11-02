// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (4)
const IP = "uysot-login";
const AP = () => typeof BroadcastChannel !== "undefined";
const YU = () => {
  if (!AP()) {
    return;
  }
  const e = new BroadcastChannel(IP);
  e.postMessage({
    type: "logged-in",
  });
  e.close();
};
const Ine = (e) => {
  if (!AP()) {
    return () => {};
  }
  const t = new BroadcastChannel(IP);
  t.onmessage = (r) => {
    if (r.data?.type === "logged-in") {
      e();
    }
  };
  return () => t.close();
};
export { Ine, YU };
