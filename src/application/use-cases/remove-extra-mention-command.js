function removeExtraMentionCommand(context, args) {
  const username = normalizeUsername(args[0]);

  if (!username) {
    return {
      handled: true,
      requiresAdmin: true,
      message: "Укажи username: /remove-extra-mention reviewer_username"
    };
  }

  const nextSettings = context.chatSettingsRepository.upsertChatSettings(
    context.event.chatId,
    (settings) => ({
      ...settings,
      notifications: {
        ...settings.notifications,
        additionalMentions: (settings.notifications?.additionalMentions || []).filter(
          (value) => value !== username
        )
      }
    })
  );

  return {
    handled: true,
    requiresAdmin: true,
    message: `Дополнительное упоминание @${username} удалено для чата ${nextSettings.chatId}.`
  };
}

function normalizeUsername(value) {
  return String(value || "")
    .trim()
    .replace(/^@/, "");
}

module.exports = {
  removeExtraMentionCommand
};
