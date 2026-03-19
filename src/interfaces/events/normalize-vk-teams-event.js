function normalizeVkTeamsEvent(payload) {
  return {
    type: "message",
    chatId: payload.chatId || payload.chat_id || "unknown-chat",
    text: payload.text || payload.message?.text || "",
    user: {
      id: payload.userId || payload.user_id || payload.from?.id || "unknown-user"
    }
  };
}

module.exports = {
  normalizeVkTeamsEvent
};
