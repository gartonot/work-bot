const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_LOG_PATH = path.resolve(
  process.cwd(),
  "private-docs",
  "ai-context",
  "runtime",
  "event-log.json"
);

function createEventLogRepository(options = {}) {
  const logPath = options.logPath || DEFAULT_LOG_PATH;
  const maxEntries = options.maxEntries || 100;

  ensureLogFile(logPath);

  return {
    getAll: () => readLog(logPath),
    getRecent: (limit = 10) => {
      const state = readLog(logPath);
      return state.entries.slice(-limit).reverse();
    },
    append: (entry) => {
      const state = readLog(logPath);
      const nextEntry = {
        timestamp: new Date().toISOString(),
        ...entry
      };
      const nextState = {
        entries: [...state.entries, nextEntry].slice(-maxEntries)
      };

      writeLog(logPath, nextState);

      return nextEntry;
    }
  };
}

function ensureLogFile(logPath) {
  const directoryPath = path.dirname(logPath);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  if (!fs.existsSync(logPath)) {
    writeLog(logPath, { entries: [] });
  }
}

function readLog(logPath) {
  const rawContent = fs.readFileSync(logPath, "utf8");
  return JSON.parse(rawContent);
}

function writeLog(logPath, state) {
  fs.writeFileSync(logPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

module.exports = {
  createEventLogRepository
};
