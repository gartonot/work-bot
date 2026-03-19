function enableReviewNotificationsCommand(context) {
  return {
    handled: true,
    requiresAdmin: true,
    message: buildEnableReviewNotificationsMessage(context)
  };
}

function buildEnableReviewNotificationsMessage(context) {
  const { chatSettingsRepository, event } = context;

  const nextSettings = chatSettingsRepository.upsertChatSettings(event.chatId, (settings) => ({
    ...settings,
    reviewNotifications: {
      enabled: true
    }
  }));

  return `Уведомления о ревью включены для чата ${nextSettings.chatId}.`;
}

module.exports = {
  enableReviewNotificationsCommand
};
