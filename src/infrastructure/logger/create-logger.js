function createLogger({ level = "info" } = {}) {
  return {
    debug: (message, meta) => logMessage("debug", level, message, meta),
    info: (message, meta) => logMessage("info", level, message, meta),
    warn: (message, meta) => logMessage("warn", level, message, meta),
    error: (message, meta) => logMessage("error", level, message, meta)
  };
}

function logMessage(messageLevel, configuredLevel, message, meta) {
  const priorities = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40
  };

  if (priorities[messageLevel] < priorities[configuredLevel]) {
    return;
  }

  const timestamp = new Date().toISOString();
  const renderedMeta = meta ? ` ${JSON.stringify(meta)}` : "";

  console.log(`[${timestamp}] [${messageLevel.toUpperCase()}] ${message}${renderedMeta}`);
}

module.exports = {
  createLogger
};
