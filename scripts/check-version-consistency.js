const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const identity = JSON.parse(
  fs.readFileSync(path.join(root, "server-identity.json"), "utf8")
);

const versionMatch = appSource.match(
  /const\s+APP_VERSION\s*=\s*["']([^"']+)["']/
);

if (!versionMatch) {
  console.error("APP_VERSION was not found in app.js.");
  process.exit(1);
}

const appVersion = versionMatch[1];
const identityVersion = String(identity.version || "").trim();

if (appVersion !== identityVersion) {
  console.error(
    `Version mismatch: app.js=${appVersion}, server-identity.json=${identityVersion}`
  );
  process.exit(1);
}

console.log(`Version consistency check passed: ${appVersion}`);
