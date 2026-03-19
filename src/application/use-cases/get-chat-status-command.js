function getChatStatusCommand(context) {
  const { chatSettingsRepository, event, userAccess } = context;
  const recentEvents = context.eventLogRepository.getRecent(3);
  const chatSettings =
    chatSettingsRepository.getByChatId(event.chatId) || {
      reviewNotifications: {
        enabled: false
      }
    };

  return {
    handled: true,
    requiresAdmin: false,
    message: [
      `Chat: ${event.chatId}`,
      `User access: ${userAccess.level}`,
      `Review notifications: ${chatSettings.reviewNotifications.enabled ? "enabled" : "disabled"}`,
      `Queues: ${formatList(chatSettings.routing?.queues)}`,
      `Boards: ${formatList(chatSettings.routing?.boards)}`,
      `Lead filter: ${formatLeadFilter(chatSettings.filters)}`,
      `Mention lead: ${formatBoolean(chatSettings.notifications?.mentionLead)}`,
      `Mention assignee: ${formatBoolean(chatSettings.notifications?.mentionAssignee)}`,
      `Extra mentions: ${formatList(chatSettings.notifications?.additionalMentions)}`,
      `Recent events: ${formatRecentEvents(recentEvents)}`
    ].join("\n")
  };
}

function formatList(values) {
  return Array.isArray(values) && values.length > 0 ? values.join(", ") : "-";
}

function formatLeadFilter(filters) {
  const leadFilter = Array.isArray(filters)
    ? filters.find((filter) => filter.field === "Лид разработки")
    : null;

  if (!leadFilter || !Array.isArray(leadFilter.values) || leadFilter.values.length === 0) {
    return "-";
  }

  return leadFilter.values.join(", ");
}

function formatBoolean(value) {
  return value === false ? "off" : "on";
}

function formatRecentEvents(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return "-";
  }

  return events
    .map((entry) => `${entry.source}:${entry.eventType}`)
    .join(", ");
}

module.exports = {
  getChatStatusCommand
};
