function normalizeTrackerEvent(payload) {
  return {
    type: payload.type || "issue-status-changed",
    currentStatus:
      payload.currentStatus ||
      payload.status ||
      payload.issue?.status ||
      payload.issue?.status?.display ||
      "",
    task: {
      key: payload.taskKey || payload.issue?.key || "unknown-task",
      summary: payload.summary || payload.issue?.summary || payload.issue?.title || "",
      queue: payload.queue || payload.issue?.queue || payload.issue?.queueKey || "",
      board: payload.board || payload.issue?.board || payload.issue?.boardId || "",
      url: payload.taskUrl || payload.issue?.url || "",
      mergeRequestUrl:
        payload.mergeRequestUrl ||
        payload.issue?.mergeRequestUrl ||
        payload.issue?.mrUrl ||
        "",
      assigneeUsername:
        payload.assigneeUsername || payload.issue?.assigneeUsername || payload.issue?.assignee || "",
      leadUsername:
        payload.leadUsername ||
        payload.issue?.leadUsername ||
        payload.issue?.["Лид разработки"] ||
        "",
      fields: {
        "Лид разработки":
          payload.leadUsername ||
          payload.issue?.leadUsername ||
          payload.issue?.["Лид разработки"] ||
          ""
      }
    }
  };
}

module.exports = {
  normalizeTrackerEvent
};
