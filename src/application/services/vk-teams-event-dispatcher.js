const { ACCESS_LEVELS } = require("../../domain/access/access-levels");
const { routeVkTeamsCommand } = require("./vk-teams-command-router");

async function dispatchVkTeamsEvent(event, context) {
  context.eventLogRepository.append({
    source: "vk-teams",
    eventType: event.type,
    chatId: event.chatId,
    userId: event.user.id,
    text: event.text
  });

  if (event.type !== "message") {
    return {
      handled: false,
      message: "Event ignored."
    };
  }

  const userAccess = await context.accessService.getUserAccess({
    chatId: event.chatId,
    userId: event.user.id
  });

  const commandResult = routeVkTeamsCommand(event.text, {
    ...context,
    event,
    userAccess
  });

  context.eventLogRepository.append({
    source: "vk-teams",
    eventType: "command-result",
    chatId: event.chatId,
    userId: event.user.id,
    handled: commandResult.handled,
    requiresAdmin: Boolean(commandResult.requiresAdmin)
  });

  if (!commandResult.handled) {
    return commandResult;
  }

  if (commandResult.requiresAdmin && userAccess.level !== ACCESS_LEVELS.ADMIN) {
    const deniedResult = {
      handled: true,
      message: "Команда доступна только администратору чата."
    };

    await replyIfNeeded(event, deniedResult, context);

    return deniedResult;
  }

  await replyIfNeeded(event, commandResult, context);

  return commandResult;
}

async function replyIfNeeded(event, commandResult, context) {
  if (!commandResult.message) {
    return;
  }

  await context.messageService.sendChatMessage({
    chatId: event.chatId,
    text: commandResult.message
  });
}

module.exports = {
  dispatchVkTeamsEvent
};
