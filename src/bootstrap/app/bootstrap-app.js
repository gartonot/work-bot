const { createAppContext } = require("../../bootstrap/container/create-app-context");
const { createServer } = require("../../interfaces/http/create-server");

async function bootstrapApp() {
  const context = createAppContext();
  const { appConfig, env, integrationsConfig, chatSettingsRepository, logger } = context;
  const chatSettingsState = chatSettingsRepository.getAll();
  const server = createServer(context);

  logger.info("Starting application bootstrap.", {
    appName: appConfig.appName,
    environment: env.NODE_ENV,
    port: env.PORT
  });

  logger.info("Configuration loaded.", {
    reviewNotificationsEnabled: appConfig.features.reviewNotifications,
    vkTeamsEnabled: integrationsConfig.vkTeams.enabled,
    yandexTrackerEnabled: integrationsConfig.yandexTracker.enabled,
    configuredChatsInRuntimeStorage: chatSettingsState.chats.length
  });

  logger.info("Application skeleton is ready.");

  await startServer(server, env.PORT, logger);

  return context;
}

function startServer(server, port, logger) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, () => {
      logger.info("HTTP server started.", { port });
      resolve();
    });
  });
}

module.exports = {
  bootstrapApp
};
