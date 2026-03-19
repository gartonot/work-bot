function setLeadFilterCommand(context, args) {
  const leadUsername = normalizeUsername(args[0]);

  if (!leadUsername) {
    return {
      handled: true,
      requiresAdmin: true,
      message: "Укажи username лида: /set-lead-filter teamlead_username"
    };
  }

  const nextSettings = context.chatSettingsRepository.upsertChatSettings(
    context.event.chatId,
    (settings) => ({
      ...settings,
      filters: upsertLeadFilter(settings.filters || [], leadUsername)
    })
  );

  return {
    handled: true,
    requiresAdmin: true,
    message: `Фильтр по лиду разработки @${leadUsername} установлен для чата ${nextSettings.chatId}.`
  };
}

function upsertLeadFilter(filters, leadUsername) {
  const otherFilters = filters.filter((filter) => filter.field !== "Лид разработки");

  return [
    ...otherFilters,
    {
      field: "Лид разработки",
      operator: "in",
      values: [leadUsername]
    }
  ];
}

function normalizeUsername(value) {
  return String(value || "")
    .trim()
    .replace(/^@/, "");
}

module.exports = {
  setLeadFilterCommand
};
