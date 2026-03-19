function getRecentEventsCommand(context) {
  const recentEvents = context.eventLogRepository.getRecent(10);

  return {
    handled: true,
    requiresAdmin: true,
    message: formatRecentEventsMessage(recentEvents)
  };
}

function formatRecentEventsMessage(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return "Последних событий пока нет.";
  }

  return [
    "Последние события:",
    ...events.map((entry) => {
      const parts = [entry.timestamp, entry.source, entry.eventType];

      if (entry.chatId) {
        parts.push(`chat=${entry.chatId}`);
      }

      if (entry.taskKey) {
        parts.push(`task=${entry.taskKey}`);
      }

      return parts.join(" | ");
    })
  ].join("\n");
}

module.exports = {
  getRecentEventsCommand
};
