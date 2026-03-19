const { postJson } = require("../../http/http-json-client");

function createVkTeamsClient({ env, logger }) {
  const apiBaseUrl = env.VK_TEAMS_API_BASE_URL;
  const botToken = env.VK_TEAMS_BOT_TOKEN;

  return {
    async getChatMemberRole({ chatId, userId }) {
      if (!botToken) {
        logger.warn("VK Teams token is missing. Falling back to local admin stub.", {
          chatId,
          userId
        });

        return {
          isAdmin: String(userId || "").toLowerCase().startsWith("admin")
        };
      }

      logger.warn("Real VK Teams member role request is not wired yet. Using fallback stub.", {
        chatId,
        userId
      });

      return {
        isAdmin: String(userId || "").toLowerCase().startsWith("admin")
      };
    },

    async sendMessage({ chatId, text }) {
      if (!botToken) {
        logger.info("VK Teams token is missing. Outgoing message is logged only.", {
          chatId,
          text
        });
        return;
      }

      logger.warn("Real VK Teams sendMessage API is not wired yet. Message is logged only.", {
        chatId,
        text
      });

      if (false) {
        await postJson(`${apiBaseUrl}/placeholder`, { chatId, text });
      }
    }
  };
}

module.exports = {
  createVkTeamsClient
};
