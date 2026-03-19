function unbindReviewQueueCommand(context, args) {
  const queue = normalizeArgument(args[0]);

  if (!queue) {
    return {
      handled: true,
      requiresAdmin: true,
      message: "Укажи очередь: /unbind-review-queue DEV"
    };
  }

  const nextSettings = context.chatSettingsRepository.upsertChatSettings(
    context.event.chatId,
    (settings) => ({
      ...settings,
      routing: {
        ...settings.routing,
        queues: (settings.routing?.queues || []).filter((value) => value !== queue)
      }
    })
  );

  return {
    handled: true,
    requiresAdmin: true,
    message: `Очередь ${queue} отвязана от чата ${nextSettings.chatId}.`
  };
}

function normalizeArgument(value) {
  return String(value || "").trim();
}

module.exports = {
  unbindReviewQueueCommand
};
