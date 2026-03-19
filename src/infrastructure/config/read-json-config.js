const fs = require("node:fs");
const path = require("node:path");

function readJsonConfig(relativePath) {
  const filePath = path.resolve(process.cwd(), relativePath);
  const rawContent = fs.readFileSync(filePath, "utf8");

  return JSON.parse(rawContent);
}

module.exports = {
  readJsonConfig
};
