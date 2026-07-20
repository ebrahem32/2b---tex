# Windows App Launcher

Date: 2026-07-19
Status: active

## What Was Added

- `F:\2B Tex\server-tools\open-2btex-app.ps1`
- `F:\2B Tex\server-tools\open-2btex-app.cmd`
- Desktop shortcut: `2B Tex.lnk`
- Project shortcut: `F:\2B Tex\2B Tex.lnk`

## Behavior

- Starts the production services through `start-2btex-server.ps1 -NoOpen`.
- Opens 2B Tex in browser app mode instead of a normal browser tab.
- Uses the LAN URL generated from the server IP, for example `http://192.168.10.37:3000/login.html`.
- Uses a persistent browser profile at `F:\2B Tex\app-profile`.

## Safety Notes

- No database schema changes.
- No business calculation changes.
- No inventory or waste logic changes.
- No extra local project copy was introduced.
- SQL Server, backend, frontend, and WhatsApp service remain separate production services.

## Operator Use

Use the `2B Tex` shortcut on the desktop or inside `F:\2B Tex` to start the system and open it directly as a Windows-style app.
