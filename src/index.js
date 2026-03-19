const { bootstrapApp } = require("./bootstrap/app/bootstrap-app");

bootstrapApp().catch((error) => {
  console.error("[bootstrap] Failed to start application.");
  console.error(error);
  process.exitCode = 1;
});
