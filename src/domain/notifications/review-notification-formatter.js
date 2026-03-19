function formatReviewNotification(task) {
  const lines = [
    `Задача переведена в ревью: ${task.key}`,
    `Task URL: ${task.url || "not provided"}`,
    `MR URL: ${task.mergeRequestUrl || "not provided"}`
  ];

  if (task.mentions.length > 0) {
    lines.push(`Mentions: ${task.mentions.join(" ")}`);
  }

  if (task.summary) {
    lines.splice(1, 0, `Summary: ${task.summary}`);
  }

  return lines.join("\n");
}

module.exports = {
  formatReviewNotification
};
