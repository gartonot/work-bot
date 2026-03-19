function matchesChatRouting(task, routing) {
  if (!routing || Object.keys(routing).length === 0) {
    return true;
  }

  const queueMatches =
    !Array.isArray(routing.queues) ||
    routing.queues.length === 0 ||
    routing.queues.includes(task.queue);

  const boardMatches =
    !Array.isArray(routing.boards) ||
    routing.boards.length === 0 ||
    routing.boards.includes(task.board);

  return queueMatches && boardMatches;
}

module.exports = {
  matchesChatRouting
};
