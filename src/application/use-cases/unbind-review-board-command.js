function unbindReviewBoardCommand(context, args) {
  const board = normalizeArgument(args[0]);

  if (!board) {
    return {
      handled: true,
      requiresAdmin: true,
      message: "Укажи доску: /unbind-review-board backend-board"
    };
  }

  const nextSettings = context.chatSettingsRepository.upsertChatSettings(
    context.event.chatId,
    (settings) => ({
      ...settings,
      routing: {
        ...settings.routing,
        boards: (settings.routing?.boards || []).filter((value) => value !== board)
      }
    })
  );

  return {
    handled: true,
    requiresAdmin: true,
    message: `Доска ${board} отвязана от чата ${nextSettings.chatId}.`
  };
}

function normalizeArgument(value) {
  return String(value || "").trim();
}

module.exports = {
  unbindReviewBoardCommand
};
