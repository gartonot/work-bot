const { handleTrackerReviewStatusChanged } = require("../use-cases/handle-tracker-review-status-changed");

async function dispatchTrackerEvent(event, context) {
  context.eventLogRepository.append({
    source: "yandex-tracker",
    eventType: event.type,
    taskKey: event.task.key,
    currentStatus: event.currentStatus
  });

  if (event.type !== "issue-status-changed") {
    return {
      handled: false,
      message: "Tracker event ignored."
    };
  }

  return handleTrackerReviewStatusChanged(event, context);
}

module.exports = {
  dispatchTrackerEvent
};
