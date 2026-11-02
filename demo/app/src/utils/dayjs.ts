// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (1)
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import be from "dayjs";
import JF from "dayjs/plugin/localizedFormat";
be.extend(JF);
be.extend(timezone);
be.extend(utc);
