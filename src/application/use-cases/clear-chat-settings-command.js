function clearChatSettingsCommand(context) {
  const nextSettings = context.chatSettingsRepository.upsertChatSettings(
    context.event.chatId,
    (settings) => ({
      ...settings,
      reviewNotifications: {
        enabled: false
      },
      routing: {},
      filters: [],
      notifications: {
        mentionLead: true,
        mentionAssignee: true,
        additionalMentions: []
      }
    })
  );

  return {
    handled: true,
    requiresAdmin: true,
    message: `Настройки чата ${nextSettings.chatId} сброшены.`
  };
}

module.exports = {
  clearChatSettingsCommand
};
