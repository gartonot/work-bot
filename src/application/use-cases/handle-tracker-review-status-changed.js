const { TRACKER_STATUSES } = require("../../domain/tracker/tracker-statuses");
const { matchesChatRouting } = require("../../domain/chat/chat-routing-policy");
const { matchesTaskFilters } = require("../../domain/filters/task-filter-policy");
const { formatReviewNotification } = require("../../domain/notifications/review-notification-formatter");

async function handleTrackerReviewStatusChanged(event, context) {
  const reviewStatusNames = context.integrationsConfig.yandexTracker.reviewStatusNames || [
    TRACKER_STATUSES.REVIEW
  ];

  if (!reviewStatusNames.includes(event.currentStatus)) {
    return {
      handled: false,
      message: "Tracker status change ignored."
    };
  }

  const settingsState = context.chatSettingsRepository.getAll();
  const eligibleChats = settingsState.chats.filter((chat) => isEligibleChat(chat, event.task));

  if (eligibleChats.length === 0) {
    return {
      handled: true,
      message: "No chats have review notifications enabled."
    };
  }

  const task = {
    key: event.task.key,
    summary: event.task.summary,
    url: event.task.url,
    mergeRequestUrl: event.task.mergeRequestUrl,
    mentions: buildMentions(event.task, eligibleChats)
  };

  const message = formatReviewNotification(task);

  for (const chat of eligibleChats) {
    await context.messageService.sendChatMessage({
      chatId: chat.chatId,
      text: message
    });
  }

  return {
    handled: true,
    message: `Review notification dispatched to ${eligibleChats.length} chat(s).`
  };
}

function buildMentions(task, eligibleChats) {
  const mentions = [];

  for (const chat of eligibleChats) {
    if (chat.notifications?.mentionAssignee !== false && task.assigneeUsername) {
      mentions.push(`@${task.assigneeUsername}`);
    }

    if (chat.notifications?.mentionLead !== false && task.leadUsername) {
      mentions.push(`@${task.leadUsername}`);
    }
  }

  for (const chat of eligibleChats) {
    for (const mention of chat.notifications?.additionalMentions || []) {
      mentions.push(`@${mention}`);
    }
  }

  return [...new Set(mentions)];
}

function isEligibleChat(chat, task) {
  if (!chat.reviewNotifications || !chat.reviewNotifications.enabled) {
    return false;
  }

  if (!matchesChatRouting(task, chat.routing)) {
    return false;
  }

  return matchesTaskFilters(task, chat.filters);
}

module.exports = {
  handleTrackerReviewStatusChanged
};
