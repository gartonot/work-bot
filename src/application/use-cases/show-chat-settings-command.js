function showChatSettingsCommand(context) {
  const chatSettings =
    context.chatSettingsRepository.getByChatId(context.event.chatId) || {
      chatId: context.event.chatId,
      reviewNotifications: { enabled: false },
      routing: { queues: [], boards: [] },
      filters: [],
      notifications: {
        mentionLead: true,
        mentionAssignee: true,
        additionalMentions: []
      }
    };

  return {
    handled: true,
    requiresAdmin: true,
    message: ["Текущие настройки чата:", JSON.stringify(chatSettings, null, 2)].join("\n")
  };
}

module.exports = {
  showChatSettingsCommand
};
