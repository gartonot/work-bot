function getHelpCommand() {
  return {
    handled: true,
    requiresAdmin: false,
    message: [
      "Доступные команды:",
      "/help",
      "/status",
      "/recent-events",
      "/show-chat-settings",
      "/enable-review-notifications",
      "/disable-review-notifications",
      "/bind-review-queue DEV",
      "/unbind-review-queue DEV",
      "/bind-review-board backend-board",
      "/unbind-review-board backend-board",
      "/add-extra-mention reviewer_username",
      "/remove-extra-mention reviewer_username",
      "/set-lead-filter teamlead_username",
      "/clear-lead-filter",
      "/set-mention-lead on",
      "/set-mention-assignee on",
      "/clear-chat-settings"
    ].join("\n")
  };
}

module.exports = {
  getHelpCommand
};
