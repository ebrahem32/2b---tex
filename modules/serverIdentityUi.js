(() => {
  const EXPECTED_INSTANCE_ID = '2B-PRODUCTION-PRIMARY';
  const EXPECTED_HOSTS = new Set(['192.168.11.191', '2b-server']);
  const EXPECTED_PORT = '3000';
  const CHECK_INTERVAL_MS = 15000;
  const REQUEST_TIMEOUT_MS = 5000;

  const TEXT = {
    connected: '\u0645\u062a\u0635\u0644 \u0628\u0633\u064a\u0631\u0641\u0631 2B \u0627\u0644\u0631\u0626\u064a\u0633\u064a',
    checking: '\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0633\u064a\u0631\u0641\u0631 2B',
    disconnected: '\u063a\u064a\u0631 \u0645\u062a\u0635\u0644 \u0628\u0633\u064a\u0631\u0641\u0631 2B \u0627\u0644\u0631\u0626\u064a\u0633\u064a',
    untrusted: '\u0645\u0635\u062f\u0631 \u062a\u0634\u063a\u064a\u0644 \u063a\u064a\u0631 \u0645\u0639\u062a\u0645\u062f',
    retry: '\u0627\u0636\u063a\u0637 \u0644\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0641\u062d\u0635',
  };

  const style = document.createElement('style');
  style.textContent = `
    #twoBServerIdentity {
      position: fixed;
      left: 14px;
      bottom: 14px;
      z-index: 2147483000;
      display: flex;
      align-items: center;
      gap: 10px;
      width: max-content;
      max-width: calc(100vw - 28px);
      padding: 9px 12px;
      border: 1px solid rgba(148, 163, 184, 0.3);
      border-radius: 8px;
      background: rgba(9, 16, 24, 0.96);
      color: #f8fafc;
      direction: rtl;
      font-family: Tahoma, Arial, sans-serif;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      user-select: none;
    }
    #twoBServerIdentity .server-identity-dot {
      width: 10px;
      height: 10px;
      flex: 0 0 10px;
      border-radius: 50%;
      background: #f59e0b;
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.15);
    }
    #twoBServerIdentity .server-identity-copy {
      min-width: 0;
      line-height: 1.35;
    }
    #twoBServerIdentity .server-identity-title {
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }
    #twoBServerIdentity .server-identity-address {
      margin-top: 2px;
      color: #a7b4c5;
      font-size: 11px;
      direction: ltr;
      text-align: right;
      white-space: nowrap;
    }
    #twoBServerIdentity.is-online {
      border-color: rgba(34, 197, 94, 0.45);
    }
    #twoBServerIdentity.is-online .server-identity-dot {
      background: #22c55e;
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.16);
    }
    #twoBServerIdentity.is-offline,
    #twoBServerIdentity.is-untrusted {
      border-color: rgba(239, 68, 68, 0.55);
      background: rgba(42, 12, 16, 0.97);
    }
    #twoBServerIdentity.is-offline .server-identity-dot,
    #twoBServerIdentity.is-untrusted .server-identity-dot {
      background: #ef4444;
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.16);
    }
    @media (max-width: 640px) {
      #twoBServerIdentity {
        left: 8px;
        bottom: 8px;
        max-width: calc(100vw - 16px);
        padding: 7px 9px;
      }
      #twoBServerIdentity .server-identity-title {
        font-size: 12px;
      }
    }
    @media print {
      #twoBServerIdentity {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  const badge = document.createElement('div');
  badge.id = 'twoBServerIdentity';
  badge.className = 'is-checking';
  badge.setAttribute('role', 'status');
  badge.setAttribute('aria-live', 'polite');
  badge.innerHTML = `
    <span class="server-identity-dot" aria-hidden="true"></span>
    <span class="server-identity-copy">
      <span class="server-identity-title"></span>
      <span class="server-identity-address"></span>
    </span>
  `;

  const title = badge.querySelector('.server-identity-title');
  const address = badge.querySelector('.server-identity-address');

  function setState(state, titleText, addressText) {
    badge.className = `is-${state}`;
    title.textContent = titleText;
    address.textContent = addressText;
    badge.title = state === 'online' ? titleText : `${titleText} - ${TEXT.retry}`;
  }

  function syncVisibleVersion(identity) {
    const serverVersion = String(identity?.version || '').trim();
    const loadedVersion = String(window.TWO_B_APP_VERSION || '').trim();
    const loadedBuildTime = String(window.TWO_B_APP_BUILD_TIME || '').trim();
    const versionBadge = document.getElementById('appVersionBadge');
    if (!versionBadge || !serverVersion) return;
    const synchronized = !loadedVersion || loadedVersion === serverVersion;
    versionBadge.textContent = synchronized
      ? `النسخة ${serverVersion}${loadedBuildTime ? ` | ${loadedBuildTime}` : ''}`
      : `السيرفر ${serverVersion} | الواجهة ${loadedVersion} - اضغط R`;
    versionBadge.classList.toggle('is-version-mismatch', !synchronized);
    versionBadge.title = synchronized
      ? 'نسخة الواجهة متزامنة مع سيرفر 2B'
      : 'الواجهة المحملة أقدم من السيرفر. اضغط R لإعادة التحميل.';
  }

  function isCanonicalLocation() {
    const host = String(location.hostname || '').toLowerCase();
    const port = location.port || (location.protocol === 'https:' ? '443' : '80');
    return EXPECTED_HOSTS.has(host) && port === EXPECTED_PORT;
  }

  async function fetchWithTimeout(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      return await fetch(url, {
        cache: 'no-store',
        credentials: 'same-origin',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  }

  async function checkServerIdentity() {
    setState('checking', TEXT.checking, '192.168.11.191:3000');
    if (!isCanonicalLocation()) {
      setState('untrusted', TEXT.untrusted, location.host || '-');
      return;
    }
    try {
      const response = await fetchWithTimeout(`/server-identity.json?t=${Date.now()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const identity = await response.json();
      if (
        identity.instanceId !== EXPECTED_INSTANCE_ID
        || identity.address !== '192.168.11.191:3000'
      ) {
        setState('untrusted', TEXT.untrusted, location.host || '-');
        return;
      }
      setState('online', TEXT.connected, `${identity.address} | ${identity.version || ''}`);
      syncVisibleVersion(identity);
    } catch {
      setState('offline', TEXT.disconnected, '192.168.11.191:3000');
    }
  }

  function mount() {
    if (!document.body || document.getElementById(badge.id)) return;
    document.body.appendChild(badge);
    badge.addEventListener('click', checkServerIdentity);
    checkServerIdentity();
    window.setInterval(checkServerIdentity, CHECK_INTERVAL_MS);
  }

  window.addEventListener('online', checkServerIdentity);
  window.addEventListener('offline', () => {
    setState('offline', TEXT.disconnected, '192.168.11.191:3000');
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
