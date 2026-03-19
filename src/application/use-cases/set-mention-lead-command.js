function setMentionLeadCommand(context, args) {
  const enabled = parseBooleanArgument(args[0]);

  if (enabled === null) {
    return {
      handled: true,
      requiresAdmin: true,
      message: "Укажи on/off: /set-mention-lead on"
    };
  }

  const nextSettings = context.chatSettingsRepository.upsertChatSettings(
    context.event.chatId,
    (settings) => ({
      ...settings,
      notifications: {
        ...settings.notifications,
        mentionLead: enabled
      }
    })
  );

  return {
    handled: true,
    requiresAdmin: true,
    message: `Упоминание лида ${enabled ? "включено" : "выключено"} для чата ${nextSettings.chatId}.`
  };
}

function parseBooleanArgument(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (["on", "true", "1", "yes"].includes(normalized)) {
    return true;
  }

  if (["off", "false", "0", "no"].includes(normalized)) {
    return false;
  }

  return null;
}

module.exports = {
  setMentionLeadCommand
};
