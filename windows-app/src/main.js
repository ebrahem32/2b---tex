const { app, BrowserWindow, dialog, ipcMain, shell, session } = require("electron");
const fs = require("fs");
const path = require("path");

// Last-resort address only. The manifest below is the real source of truth, so a
// server move needs a manifest edit, never a rebuild of this app.
const DEFAULT_APP_URL = "http://192.168.11.191:3000/login.html";
const APP_URL = resolveAppUrl();
const ICON_PATH = path.join(__dirname, "..", "assets", "2B Tex.ico");
const PRELOAD_PATH = path.join(__dirname, "preload.js");
const SHELL_PATH = path.join(__dirname, "shell.html");

function resolveAppUrl() {
  // The client bootstrapper writes the shared manifest beside the local app
  // install; reading appUrl from it lets the server address change without
  // rebuilding this app.
  const manifestPaths = [
    path.join(process.env.LOCALAPPDATA || "", "2BTex", "client-app-manifest.json"),
    path.join(__dirname, "..", "..", "..", "client-app-manifest.json"),
  ];
  for (const manifestPath of manifestPaths) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      const url = String(manifest.appUrl || "").trim();
      if (/^https?:\/\//i.test(url)) return url;
    } catch { /* manifest missing or unreadable; try next source */ }
  }
  return DEFAULT_APP_URL;
}

let mainWindow;

app.commandLine.appendSwitch("no-sandbox");
app.setAppUserModelId("com.2btex.operations");
app.name = "2B Tex";
app.setPath("userData", path.join(app.getPath("appData"), "2BTex", "DesktopApp"));

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
}

function createOfflineHtml() {
  return `
    <!doctype html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8">
      <title>2B Tex</title>
      <style>
        body {
          margin: 0;
          min-height: 100vh;
          display: grid;
          place-items: center;
          font-family: Tahoma, Arial, sans-serif;
          background: #101820;
          color: #f8fafc;
        }
        main {
          width: min(560px, calc(100vw - 40px));
          padding: 32px;
          border: 1px solid #263545;
          border-radius: 16px;
          background: #131d27;
          box-shadow: 0 24px 80px rgba(0,0,0,.35);
        }
        h1 { margin: 0 0 12px; font-size: 32px; }
        p { color: #b9c7d6; line-height: 1.8; }
        button {
          width: 100%;
          border: 0;
          border-radius: 12px;
          background: #d1ad62;
          color: #111827;
          font-weight: 700;
          font-size: 18px;
          padding: 14px;
          cursor: pointer;
        }
        code {
          direction: ltr;
          display: inline-block;
          color: #f8d98b;
        }
      </style>
    </head>
    <body>
      <main>
        <h1>تعذر فتح 2B Tex</h1>
        <p>التطبيق لم يستطع الوصول إلى السيرفر المركزي:</p>
        <p><code>${APP_URL}</code></p>
        <p>تأكد أن جهاز السيرفر شغال وأن خدمات 2B Tex تعمل، ثم حاول مرة أخرى.</p>
        <button onclick="location.href='${APP_URL}'">إعادة المحاولة</button>
      </main>
    </body>
    </html>
  `;
}

function createOfflineHtmlSafe() {
  return `
    <!doctype html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8">
      <title>2B Tex</title>
      <style>
        body {
          margin: 0;
          min-height: 100vh;
          display: grid;
          place-items: center;
          font-family: Tahoma, Arial, sans-serif;
          background: #101820;
          color: #f8fafc;
        }
        main {
          width: min(560px, calc(100vw - 40px));
          padding: 32px;
          border: 1px solid #263545;
          border-radius: 16px;
          background: #131d27;
          box-shadow: 0 24px 80px rgba(0,0,0,.35);
        }
        h1 { margin: 0 0 12px; font-size: 32px; }
        p { color: #b9c7d6; line-height: 1.8; }
        button {
          width: 100%;
          border: 0;
          border-radius: 12px;
          background: #d1ad62;
          color: #111827;
          font-weight: 700;
          font-size: 18px;
          padding: 14px;
          cursor: pointer;
        }
        code {
          direction: ltr;
          display: inline-block;
          color: #f8d98b;
        }
      </style>
    </head>
    <body>
      <main>
        <h1>&#1578;&#1593;&#1584;&#1585; &#1601;&#1578;&#1581; 2B Tex</h1>
        <p>&#1575;&#1604;&#1578;&#1591;&#1576;&#1610;&#1602; &#1604;&#1605; &#1610;&#1587;&#1578;&#1591;&#1593; &#1575;&#1604;&#1608;&#1589;&#1608;&#1604; &#1573;&#1604;&#1609; &#1575;&#1604;&#1587;&#1610;&#1585;&#1601;&#1585; &#1575;&#1604;&#1605;&#1585;&#1603;&#1586;&#1610;:</p>
        <p><code>${APP_URL}</code></p>
        <p>&#1578;&#1571;&#1603;&#1583; &#1571;&#1606; &#1580;&#1607;&#1575;&#1586; &#1575;&#1604;&#1587;&#1610;&#1585;&#1601;&#1585; &#1588;&#1594;&#1575;&#1604; &#1608;&#1571;&#1606; &#1582;&#1583;&#1605;&#1575;&#1578; 2B Tex &#1578;&#1593;&#1605;&#1604;&#1548; &#1579;&#1605; &#1581;&#1575;&#1608;&#1604; &#1605;&#1585;&#1577; &#1571;&#1582;&#1585;&#1609;.</p>
        <button onclick="location.href='${APP_URL}'">&#1573;&#1593;&#1575;&#1583;&#1577; &#1575;&#1604;&#1605;&#1581;&#1575;&#1608;&#1604;&#1577;</button>
      </main>
    </body>
    </html>
  `;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 960,
    minHeight: 640,
    title: "2B Tex | نظام التشغيل",
    icon: fs.existsSync(ICON_PATH) ? ICON_PATH : undefined,
    autoHideMenuBar: true,
    show: false,
    transparent: false,
    backgroundColor: "#101820",
    webPreferences: {
      preload: fs.existsSync(PRELOAD_PATH) ? PRELOAD_PATH : undefined,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: true,
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  mainWindow.loadFile(SHELL_PATH, {
    query: {
      appUrl: APP_URL,
      preloadPath: PRELOAD_PATH,
    },
  });

  mainWindow.webContents.on("did-fail-load", (
    _event,
    _errorCode,
    _errorDescription,
    _validatedUrl,
    isMainFrame
  ) => {
    if (!isMainFrame) return;
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(createOfflineHtmlSafe())}`);
  });

  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    console.error("2B Tex shell renderer stopped:", details);
  });

  mainWindow.webContents.on("preload-error", (_event, preloadPath, error) => {
    console.error(`2B Tex preload failed (${preloadPath}):`, error);
  });

  mainWindow.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    if (level >= 2) console.error(`2B Tex renderer: ${message} (${sourceId}:${line})`);
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("did-attach-webview", (_event, guestContents) => {
    guestContents.setWindowOpenHandler(({ url }) => {
      if (/^https?:\/\//i.test(url)) shell.openExternal(url);
      return { action: "deny" };
    });
  });
}

function safeFileName(value) {
  const fallback = "2B-Tex-document.png";
  const text = String(value || fallback).trim() || fallback;
  return text
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 140);
}

function installDesktopBridge() {
  ipcMain.handle("2btex:save-png", async (_event, payload = {}) => {
    try {
      const dataUrl = String(payload.dataUrl || "");
      const match = dataUrl.match(/^data:image\/png;base64,(.+)$/);
      if (!match) return { ok: false, error: "Invalid PNG payload." };

      const suggestedName = safeFileName(payload.fileName || "2B-Tex-document.png");
      const result = await dialog.showSaveDialog(mainWindow, {
        title: "Save 2B Tex PNG",
        defaultPath: path.join(app.getPath("downloads"), suggestedName),
        filters: [{ name: "PNG Image", extensions: ["png"] }],
      });
      if (result.canceled || !result.filePath) return { ok: false, canceled: true };

      fs.writeFileSync(result.filePath, Buffer.from(match[1], "base64"));
      shell.showItemInFolder(result.filePath);
      return { ok: true, filePath: result.filePath };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  });

  ipcMain.handle("2btex:print", async (event) => {
    if (!event.sender || event.sender.isDestroyed()) return { ok: false, error: "Window is not ready." };
    try {
      const previewRoot = path.join(app.getPath("temp"), "2BTex", "PrintPreview");
      fs.mkdirSync(previewRoot, { recursive: true });
      const previewPath = path.join(previewRoot, `2B-Tex-${Date.now()}.pdf`);
      const pdf = await event.sender.printToPDF({
        printBackground: true,
        preferCSSPageSize: true,
        pageSize: "A4",
      });
      fs.writeFileSync(previewPath, pdf);
      const openError = await shell.openPath(previewPath);
      if (openError) return { ok: false, error: openError };
      return { ok: true, filePath: previewPath, preview: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  });
}

app.whenReady().then(async () => {
  // The webview uses its own persistent partition, not defaultSession. Clear
  // both caches so every launch reads the current server UI after a deployment.
  const systemSession = session.fromPartition("persist:2btex");
  await Promise.all([
    session.defaultSession.clearCache().catch(() => {}),
    systemSession.clearCache().catch(() => {}),
    systemSession.clearCodeCaches({}).catch(() => {}),
  ]);
  installDesktopBridge();
  createWindow();
});

app.on("second-instance", () => {
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

process.on("uncaughtException", (error) => {
  dialog.showErrorBox("2B Tex", error.message);
});
