function bindReviewQueueCommand(context, args) {
  const queue = normalizeArgument(args[0]);

  if (!queue) {
    return {
      handled: true,
      requiresAdmin: true,
      message: "Укажи очередь: /bind-review-queue DEV"
    };
  }

  const nextSettings = context.chatSettingsRepository.upsertChatSettings(
    context.event.chatId,
    (settings) => ({
      ...settings,
      routing: {
        ...settings.routing,
        queues: uniqueValues([...(settings.routing?.queues || []), queue])
      }
    })
  );

  return {
    handled: true,
    requiresAdmin: true,
    message: `Очередь ${queue} привязана к чату ${nextSettings.chatId}.`
  };
}

function normalizeArgument(value) {
  return String(value || "").trim();
}

function uniqueValues(values) {
  return [...new Set(values)];
}

module.exports = {
  bindReviewQueueCommand
};
