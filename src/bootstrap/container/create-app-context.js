const { loadEnv } = require("../../infrastructure/env/load-env");
const { loadAppConfig } = require("../../infrastructure/config/load-app-config");
const {
  loadIntegrationsConfig
} = require("../../infrastructure/config/load-integrations-config");
const { createLogger } = require("../../infrastructure/logger/create-logger");
const {
  createChatSettingsRepository
} = require("../../infrastructure/repositories/chat-settings-repository");
const {
  createEventLogRepository
} = require("../../infrastructure/repositories/event-log-repository");
const {
  createVkTeamsClient
} = require("../../infrastructure/integrations/vk-teams/vk-teams-client");
const {
  createVkTeamsAccessService
} = require("../../infrastructure/integrations/vk-teams/vk-teams-access-service");
const {
  createVkTeamsMessageService
} = require("../../infrastructure/integrations/vk-teams/vk-teams-message-service");

function createAppContext() {
  const env = loadEnv();
  const appConfig = loadAppConfig();
  const integrationsConfig = loadIntegrationsConfig();
  const logger = createLogger({ level: appConfig.logging.level });
  const chatSettingsRepository = createChatSettingsRepository();
  const eventLogRepository = createEventLogRepository();
  const vkTeamsClient = createVkTeamsClient({ env, logger });
  const accessService = createVkTeamsAccessService({ vkTeamsClient });
  const messageService = createVkTeamsMessageService({ vkTeamsClient });

  return {
    env,
    appConfig,
    integrationsConfig,
    chatSettingsRepository,
    eventLogRepository,
    vkTeamsClient,
    accessService,
    messageService,
    logger
  };
}

module.exports = {
  createAppContext
};
