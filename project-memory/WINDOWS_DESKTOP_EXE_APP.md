# Windows Desktop EXE App

Date: 2026-07-19
Status: active

## Decision

2B Tex now has a real Windows desktop executable, not only a browser shortcut.

## Main App File

- `F:\2B Tex\2B Tex.exe`

## Build Source

- `F:\2B Tex\windows-app`

## Behavior

- Opens the central 2B Tex production server inside a desktop application window.
- Client workstations do not install SQL Server.
- Client workstations do not install Node.js.
- Client workstations do not run backend services locally.
- The production server remains the only machine running SQL Server, backend, frontend, and WhatsApp services.

## Network URL

`http://192.168.10.37:3000/login.html`

## Build Notes

- Built with Electron.
- Output portable executable: `F:\2B Tex\windows-app\dist\2B Tex.exe`.
- Production copy: `F:\2B Tex\2B Tex.exe`.
- Desktop shortcut points directly to the executable.

## Validation

Production health check passed after building the app:

- SQL Server service running.
- Frontend port `3000` listening.
- Backend port `3050` listening.
- WhatsApp port `3020` listening.
- Login page returned HTTP 200.
