function createVkTeamsMessageService({ vkTeamsClient }) {
  return {
    async sendChatMessage({ chatId, text }) {
      await vkTeamsClient.sendMessage({ chatId, text });
    }
  };
}

module.exports = {
  createVkTeamsMessageService
};
