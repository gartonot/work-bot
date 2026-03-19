const https = require("node:https");
const http = require("node:http");
const { URL } = require("node:url");
const { AppError } = require("../../core/errors/app-error");

async function postJson(urlString, payload, options = {}) {
  const url = new URL(urlString);
  const transport = url.protocol === "https:" ? https : http;
  const body = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const request = transport.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || undefined,
        path: `${url.pathname}${url.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(body),
          ...options.headers
        }
      },
      (response) => {
        let rawResponse = "";

        response.on("data", (chunk) => {
          rawResponse += chunk;
        });

        response.on("end", () => {
          const statusCode = response.statusCode || 500;

          if (statusCode >= 400) {
            reject(
              new AppError("VK Teams API request failed.", {
                code: "VK_TEAMS_API_ERROR",
                statusCode
              })
            );
            return;
          }

          if (!rawResponse) {
            resolve({});
            return;
          }

          try {
            resolve(JSON.parse(rawResponse));
          } catch (_error) {
            resolve({ raw: rawResponse });
          }
        });
      }
    );

    request.on("error", (error) => {
      reject(error);
    });

    request.write(body);
    request.end();
  });
}

module.exports = {
  postJson
};
