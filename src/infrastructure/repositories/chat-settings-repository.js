const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_STORAGE_PATH = path.resolve(
  process.cwd(),
  "private-docs",
  "ai-context",
  "runtime",
  "chat-settings.json"
);

function createChatSettingsRepository(options = {}) {
  const storagePath = options.storagePath || DEFAULT_STORAGE_PATH;

  ensureStorageFile(storagePath);

  return {
    getAll: () => readStorage(storagePath),
    getByChatId: (chatId) => {
      const state = readStorage(storagePath);

      return state.chats.find((chat) => chat.chatId === chatId) || null;
    },
    replaceChatSettings: (chatId, nextSettings) => {
      const state = readStorage(storagePath);
      const otherChats = state.chats.filter((chat) => chat.chatId !== chatId);
      const nextState = {
        chats: sortChatsById([...otherChats, sanitizeChatSettings({ ...nextSettings, chatId })])
      };

      writeStorage(storagePath, nextState);

      return nextState.chats.find((chat) => chat.chatId === chatId) || null;
    },
    upsertChatSettings: (chatId, updater) => {
      const state = readStorage(storagePath);
      const existingSettings =
        state.chats.find((chat) => chat.chatId === chatId) || createDefaultChatSettings(chatId);
      const nextSettings = updater(existingSettings);

      return replaceChatSettings(storagePath, state, chatId, nextSettings);
    }
  };
}

function createDefaultChatSettings(chatId) {
  return {
    chatId,
    reviewNotifications: {
      enabled: false
    },
    routing: {},
    filters: [],
    notifications: {
      mentionLead: true,
      mentionAssignee: true,
      additionalMentions: []
    }
  };
}

function ensureStorageFile(storagePath) {
  const directoryPath = path.dirname(storagePath);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  if (!fs.existsSync(storagePath)) {
    writeStorage(storagePath, { chats: [] });
  }
}

function readStorage(storagePath) {
  const rawContent = fs.readFileSync(storagePath, "utf8");

  return JSON.parse(rawContent);
}

function replaceChatSettings(storagePath, state, chatId, nextSettings) {
  const otherChats = state.chats.filter((chat) => chat.chatId !== chatId);
  const nextState = {
    chats: sortChatsById([...otherChats, sanitizeChatSettings({ ...nextSettings, chatId })])
  };

  writeStorage(storagePath, nextState);

  return nextState.chats.find((chat) => chat.chatId === chatId) || null;
}

function writeStorage(storagePath, state) {
  fs.writeFileSync(storagePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function sanitizeChatSettings(settings) {
  return {
    chatId: settings.chatId,
    reviewNotifications: {
      enabled: Boolean(settings.reviewNotifications?.enabled)
    },
    routing: {
      queues: sortUniqueValues(settings.routing?.queues || []),
      boards: sortUniqueValues(settings.routing?.boards || [])
    },
    filters: Array.isArray(settings.filters) ? settings.filters : [],
    notifications: {
      mentionLead: settings.notifications?.mentionLead !== false,
      mentionAssignee: settings.notifications?.mentionAssignee !== false,
      additionalMentions: sortUniqueValues(settings.notifications?.additionalMentions || [])
    }
  };
}

function sortUniqueValues(values) {
  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))].sort();
}

function sortChatsById(chats) {
  return [...chats].sort((left, right) => left.chatId.localeCompare(right.chatId));
}

module.exports = {
  createChatSettingsRepository,
  createDefaultChatSettings
};
