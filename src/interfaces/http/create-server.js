const http = require("node:http");
const { AppError } = require("../../core/errors/app-error");
const { dispatchTrackerEvent } = require("../../application/services/tracker-event-dispatcher");
const { dispatchVkTeamsEvent } = require("../../application/services/vk-teams-event-dispatcher");
const { normalizeTrackerEvent } = require("../events/normalize-tracker-event");
const { normalizeVkTeamsEvent } = require("../events/normalize-vk-teams-event");

function createServer(context) {
  return http.createServer(async (request, response) => {
    try {
      if (request.method === "GET" && request.url === "/health") {
        return sendJson(response, 200, { ok: true });
      }

      if (
        request.method === "POST" &&
        request.url === context.integrationsConfig.vkTeams.webhookPath
      ) {
        const payload = await readJsonBody(request);
        const event = normalizeVkTeamsEvent(payload);
        const result = await dispatchVkTeamsEvent(event, context);

        return sendJson(response, 200, {
          ok: true,
          result
        });
      }

      if (
        request.method === "POST" &&
        request.url === context.integrationsConfig.yandexTracker.webhookPath
      ) {
        const payload = await readJsonBody(request);
        const event = normalizeTrackerEvent(payload);
        const result = await dispatchTrackerEvent(event, context);

        return sendJson(response, 200, {
          ok: true,
          result
        });
      }

      return sendJson(response, 404, {
        ok: false,
        error: "Not found."
      });
    } catch (error) {
      context.logger.error("HTTP request failed.", {
        message: error.message,
        code: error.code || "UNEXPECTED_ERROR"
      });

      const statusCode = error.statusCode || 500;

      return sendJson(response, statusCode, {
        ok: false,
        error: error.message
      });
    }
  });
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    request.on("data", (chunk) => {
      rawBody += chunk;
    });

    request.on("end", () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (_error) {
        reject(new AppError("Invalid JSON payload.", { code: "INVALID_JSON", statusCode: 400 }));
      }
    });

    request.on("error", (error) => {
      reject(error);
    });
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

module.exports = {
  createServer
};
