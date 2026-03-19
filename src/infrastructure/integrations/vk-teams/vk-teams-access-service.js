const { ACCESS_LEVELS } = require("../../../domain/access/access-levels");

function createVkTeamsAccessService({ vkTeamsClient }) {
  return {
    async getUserAccess({ chatId, userId }) {
      const role = await vkTeamsClient.getChatMemberRole({ chatId, userId });

      if (role.isAdmin) {
        return { level: ACCESS_LEVELS.ADMIN };
      }

      return { level: ACCESS_LEVELS.MEMBER };
    }
  };
}

module.exports = {
  createVkTeamsAccessService
};
