const MODE =
  (process.env.NEXT_PUBLIC_APP_MODE ?? process.env.APP_MODE ?? "prod").toLowerCase();

export const isDemo = MODE === "demo";

export const locale: "en" | "es" = isDemo ? "en" : "es";
