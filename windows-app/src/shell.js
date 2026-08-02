(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const appUrl = params.get("appUrl") || "http://192.168.11.191:3000/login.html";
  const preloadPath = params.get("preloadPath") || "";
  const shellRoot = document.querySelector(".desktop-shell");
  const webview = document.getElementById("systemView");
  const loadingState = document.getElementById("loadingState");
  const offlineState = document.getElementById("offlineState");
  const connectionDot = document.getElementById("connectionDot");
  const connectionState = document.getElementById("connectionState");
  const connectionLabel = document.getElementById("connectionLabel");
  const serverAddress = document.getElementById("serverAddress");
  const activeTitle = document.getElementById("activeTitle");
  const toast = document.getElementById("toast");
  let toastTimer;
  let mainLoadFailed = false;

  const guestLayoutCss = `
    .app-sidebar,
    .mobile-menu-toggle,
    .sidebar-backdrop {
      display: none !important;
    }
    .app-shell {
      display: block !important;
      grid-template-columns: minmax(0, 1fr) !important;
      width: 100% !important;
      max-width: none !important;
      padding: 12px !important;
    }
    .app-content {
      width: 100% !important;
      min-width: 0 !important;
      max-width: none !important;
    }
    @media (max-width: 760px) {
      .app-shell { padding: 8px !important; }
    }
  `;

  function toFileUrl(filePath) {
    if (!filePath) return "";
    return `file:///${filePath.replace(/\\/g, "/").replace(/^\/+/, "")}`;
  }

  function setConnection(state, message) {
    const online = state === "online";
    connectionDot.classList.toggle("online", online);
    connectionDot.classList.toggle("offline", state === "offline");
    connectionState.textContent = online ? "متصل بالسيرفر" : (state === "loading" ? "جاري الاتصال" : "السيرفر غير متاح");
    connectionLabel.textContent = message || (online ? "البيانات المركزية متصلة" : "تعذر الاتصال");
  }

  function showToast(message, error = false) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.toggle("error", error);
    toast.hidden = false;
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 3200);
  }

  function selectorFor(kind, command) {
    const safeCommand = CSS.escape(command);
    if (kind === "stage") return `[data-stage-shortcut="${safeCommand}"]`;
    if (kind === "document") return `[data-doc-menu="${safeCommand}"]`;
    return `[data-nav-action="${safeCommand}"]`;
  }

  async function runCommand(button) {
    const kind = button.dataset.kind || "action";
    const command = button.dataset.command || "";
    const selector = selectorFor(kind, command);
    const script = `
      (() => {
        const target = document.querySelector(${JSON.stringify(selector)});
        if (!target) return { ok: false, reason: "missing" };
        target.click();
        return { ok: true };
      })()
    `;

    try {
      const result = await webview.executeJavaScript(script, true);
      if (!result?.ok) {
        showToast("هذا القسم غير متاح في صلاحيات المستخدم الحالية.", true);
        return;
      }
      document.querySelectorAll(".nav-command.active").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      activeTitle.textContent = button.textContent.trim();
      if (window.innerWidth <= 780) shellRoot.classList.add("nav-collapsed");
    } catch {
      showToast("تعذر فتح القسم. تحقق من اتصال السيرفر.", true);
    }
  }

  function loadSystem() {
    loadingState.hidden = false;
    offlineState.hidden = true;
    setConnection("loading", "جاري الاتصال بسيرفر 2B");
    webview.src = appUrl;
  }

  if (preloadPath) webview.setAttribute("preload", toFileUrl(preloadPath));
  try {
    serverAddress.textContent = new URL(appUrl).host;
  } catch {
    serverAddress.textContent = "2B-Server";
  }

  document.querySelectorAll(".group-title").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest(".nav-group");
      group.classList.toggle("open");
      button.setAttribute("aria-expanded", String(group.classList.contains("open")));
    });
  });

  document.querySelectorAll(".nav-command").forEach((button) => {
    button.addEventListener("click", () => runCommand(button));
  });

  document.getElementById("sidebarButton").addEventListener("click", () => {
    shellRoot.classList.toggle("nav-collapsed");
  });
  document.getElementById("refreshButton").addEventListener("click", () => {
    loadingState.hidden = false;
    webview.reloadIgnoringCache();
  });
  document.getElementById("backButton").addEventListener("click", () => {
    if (webview.canGoBack()) webview.goBack();
  });
  document.getElementById("retryButton").addEventListener("click", loadSystem);

  webview.addEventListener("dom-ready", async () => {
    await webview.insertCSS(guestLayoutCss).catch(() => {});
    loadingState.hidden = true;
    offlineState.hidden = true;
    mainLoadFailed = false;
    setConnection("online", "البيانات المركزية متصلة");
  });
  webview.addEventListener("did-start-loading", () => {
    mainLoadFailed = false;
    setConnection("loading", "جاري تحميل البيانات");
  });
  webview.addEventListener("did-stop-loading", () => {
    loadingState.hidden = true;
    if (!mainLoadFailed) {
      offlineState.hidden = true;
      setConnection("online", "البيانات المركزية متصلة");
    }
  });
  webview.addEventListener("did-fail-load", (event) => {
    if (event.errorCode === -3 || event.isMainFrame === false) return;
    mainLoadFailed = true;
    loadingState.hidden = true;
    offlineState.hidden = false;
    setConnection("offline", "فشل الوصول إلى السيرفر");
  });
  webview.addEventListener("page-title-updated", (event) => {
    if (!document.querySelector(".nav-command.active")) activeTitle.textContent = event.title || "2B Tex";
  });

  loadSystem();
})();
