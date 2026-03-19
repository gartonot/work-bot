const { readJsonConfig } = require("./read-json-config");

function loadAppConfig() {
  return readJsonConfig("config/app.config.json");
}

module.exports = {
  loadAppConfig
};
