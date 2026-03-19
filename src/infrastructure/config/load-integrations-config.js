const { readJsonConfig } = require("./read-json-config");

function loadIntegrationsConfig() {
  return readJsonConfig("config/integrations.config.json");
}

module.exports = {
  loadIntegrationsConfig
};
