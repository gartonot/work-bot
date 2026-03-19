const { addExtraMentionCommand } = require("../use-cases/add-extra-mention-command");
const { bindReviewBoardCommand } = require("../use-cases/bind-review-board-command");
const { bindReviewQueueCommand } = require("../use-cases/bind-review-queue-command");
const { clearLeadFilterCommand } = require("../use-cases/clear-lead-filter-command");
const { clearChatSettingsCommand } = require("../use-cases/clear-chat-settings-command");
const { enableReviewNotificationsCommand } = require("../use-cases/enable-review-notifications-command");
const {
  disableReviewNotificationsCommand
} = require("../use-cases/disable-review-notifications-command");
const { getHelpCommand } = require("../use-cases/get-help-command");
const { getRecentEventsCommand } = require("../use-cases/get-recent-events-command");
const { getChatStatusCommand } = require("../use-cases/get-chat-status-command");
const { removeExtraMentionCommand } = require("../use-cases/remove-extra-mention-command");
const { setLeadFilterCommand } = require("../use-cases/set-lead-filter-command");
const { setMentionAssigneeCommand } = require("../use-cases/set-mention-assignee-command");
const { setMentionLeadCommand } = require("../use-cases/set-mention-lead-command");
const { showChatSettingsCommand } = require("../use-cases/show-chat-settings-command");
const { unbindReviewBoardCommand } = require("../use-cases/unbind-review-board-command");
const { unbindReviewQueueCommand } = require("../use-cases/unbind-review-queue-command");

function routeVkTeamsCommand(commandText, context) {
  const parsed = parseCommand(commandText);
  const normalizedCommand = parsed.name;
  const args = parsed.args;

  if (normalizedCommand === "/help") {
    return getHelpCommand();
  }

  if (normalizedCommand === "/status") {
    return getChatStatusCommand(context);
  }

  if (normalizedCommand === "/recent-events") {
    return getRecentEventsCommand(context);
  }

  if (normalizedCommand === "/show-chat-settings") {
    return showChatSettingsCommand(context);
  }

  if (normalizedCommand === "/enable-review-notifications") {
    return enableReviewNotificationsCommand(context);
  }

  if (normalizedCommand === "/disable-review-notifications") {
    return disableReviewNotificationsCommand(context);
  }

  if (normalizedCommand === "/bind-review-queue") {
    return bindReviewQueueCommand(context, args);
  }

  if (normalizedCommand === "/bind-review-board") {
    return bindReviewBoardCommand(context, args);
  }

  if (normalizedCommand === "/unbind-review-queue") {
    return unbindReviewQueueCommand(context, args);
  }

  if (normalizedCommand === "/unbind-review-board") {
    return unbindReviewBoardCommand(context, args);
  }

  if (normalizedCommand === "/add-extra-mention") {
    return addExtraMentionCommand(context, args);
  }

  if (normalizedCommand === "/remove-extra-mention") {
    return removeExtraMentionCommand(context, args);
  }

  if (normalizedCommand === "/set-lead-filter") {
    return setLeadFilterCommand(context, args);
  }

  if (normalizedCommand === "/set-mention-lead") {
    return setMentionLeadCommand(context, args);
  }

  if (normalizedCommand === "/set-mention-assignee") {
    return setMentionAssigneeCommand(context, args);
  }

  if (normalizedCommand === "/clear-lead-filter") {
    return clearLeadFilterCommand(context);
  }

  if (normalizedCommand === "/clear-chat-settings") {
    return clearChatSettingsCommand(context);
  }

  return {
    handled: false,
    message:
      "Неизвестная команда. Доступные команды: /help, /status, /recent-events, /show-chat-settings, /enable-review-notifications, /disable-review-notifications, /bind-review-queue, /unbind-review-queue, /bind-review-board, /unbind-review-board, /add-extra-mention, /remove-extra-mention, /set-lead-filter, /clear-lead-filter, /set-mention-lead, /set-mention-assignee, /clear-chat-settings."
  };
}

function parseCommand(commandText) {
  const trimmed = String(commandText || "").trim();
  const [name = "", ...args] = trimmed.split(/\s+/);

  return {
    name: name.toLowerCase(),
    args
  };
}

module.exports = {
  routeVkTeamsCommand
};
