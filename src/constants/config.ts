import { config } from "dotenv";

config({
  path:
    (process.env.NODE_ENV === "development" && ".env.development") ||
    (process.env.NODE_ENV === "production" && ".env.production") ||
    (process.env.NODE_ENV === "testing" && ".env.testing") ||
    ".env",
});

export const PORT = process.env.PORT || 4100;
