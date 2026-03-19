function addExtraMentionCommand(context, args) {
  const username = normalizeUsername(args[0]);

  if (!username) {
    return {
      handled: true,
      requiresAdmin: true,
      message: "Укажи username: /add-extra-mention reviewer_username"
    };
  }

  const nextSettings = context.chatSettingsRepository.upsertChatSettings(
    context.event.chatId,
    (settings) => ({
      ...settings,
      notifications: {
        ...settings.notifications,
        additionalMentions: uniqueValues([
          ...(settings.notifications?.additionalMentions || []),
          username
        ])
      }
    })
  );

  return {
    handled: true,
    requiresAdmin: true,
    message: `Дополнительное упоминание @${username} добавлено для чата ${nextSettings.chatId}.`
  };
}

function normalizeUsername(value) {
  return String(value || "")
    .trim()
    .replace(/^@/, "");
}

function uniqueValues(values) {
  return [...new Set(values)];
}

module.exports = {
  addExtraMentionCommand
};
