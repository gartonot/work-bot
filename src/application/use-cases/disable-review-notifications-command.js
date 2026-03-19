function disableReviewNotificationsCommand(context) {
  return {
    handled: true,
    requiresAdmin: true,
    message: buildDisableReviewNotificationsMessage(context)
  };
}

function buildDisableReviewNotificationsMessage(context) {
  const { chatSettingsRepository, event } = context;

  const nextSettings = chatSettingsRepository.upsertChatSettings(event.chatId, (settings) => ({
    ...settings,
    reviewNotifications: {
      enabled: false
    }
  }));

  return `Уведомления о ревью выключены для чата ${nextSettings.chatId}.`;
}

module.exports = {
  disableReviewNotificationsCommand
};
