function bindReviewBoardCommand(context, args) {
  const board = normalizeArgument(args[0]);

  if (!board) {
    return {
      handled: true,
      requiresAdmin: true,
      message: "Укажи доску: /bind-review-board backend-board"
    };
  }

  const nextSettings = context.chatSettingsRepository.upsertChatSettings(
    context.event.chatId,
    (settings) => ({
      ...settings,
      routing: {
        ...settings.routing,
        boards: uniqueValues([...(settings.routing?.boards || []), board])
      }
    })
  );

  return {
    handled: true,
    requiresAdmin: true,
    message: `Доска ${board} привязана к чату ${nextSettings.chatId}.`
  };
}

function normalizeArgument(value) {
  return String(value || "").trim();
}

function uniqueValues(values) {
  return [...new Set(values)];
}

module.exports = {
  bindReviewBoardCommand
};
