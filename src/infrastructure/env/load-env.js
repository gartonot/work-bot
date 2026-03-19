const fs = require("node:fs");
const path = require("node:path");

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");

  if (fs.existsSync(envPath)) {
    const rawContent = fs.readFileSync(envPath, "utf8");
    applyEnvFile(rawContent);
  }

  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number.parseInt(process.env.PORT || "3000", 10),
    VK_TEAMS_BOT_TOKEN: process.env.VK_TEAMS_BOT_TOKEN || "",
    VK_TEAMS_API_BASE_URL: process.env.VK_TEAMS_API_BASE_URL || "https://teams.vk.com",
    YANDEX_TRACKER_TOKEN: process.env.YANDEX_TRACKER_TOKEN || "",
    YANDEX_TRACKER_API_BASE_URL:
      process.env.YANDEX_TRACKER_API_BASE_URL || "https://api.tracker.yandex.net",
    YANDEX_TRACKER_ORG_ID: process.env.YANDEX_TRACKER_ORG_ID || ""
  };
}

function applyEnvFile(rawContent) {
  const lines = rawContent.split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = stripWrappingQuotes(value);
  }
}

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

module.exports = {
  loadEnv
};
