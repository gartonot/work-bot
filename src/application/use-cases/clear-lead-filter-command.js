function clearLeadFilterCommand(context) {
  const nextSettings = context.chatSettingsRepository.upsertChatSettings(
    context.event.chatId,
    (settings) => ({
      ...settings,
      filters: (settings.filters || []).filter((filter) => filter.field !== "Лид разработки")
    })
  );

  return {
    handled: true,
    requiresAdmin: true,
    message: `Фильтр по лиду разработки очищен для чата ${nextSettings.chatId}.`
  };
}

module.exports = {
  clearLeadFilterCommand
};
