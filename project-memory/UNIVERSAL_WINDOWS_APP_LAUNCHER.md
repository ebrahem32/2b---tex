# Universal Windows App Launcher

Date: 2026-07-19
Status: active

## Decision

2B Tex uses one launcher icon for both the production server and network clients.

## Files

- `F:\2B Tex\server-tools\open-2btex-universal.ps1`
- `F:\2B Tex\server-tools\open-2btex-universal.cmd`
- `F:\2B Tex\2B Tex.cmd`
- `F:\2B Tex\2B Tex.lnk`

## Behavior

When opened on the server machine:

- Ensures 2B Tex services are running.
- Opens the system in a Windows-style app window.

When opened on another network workstation:

- Does not install SQL Server.
- Does not install Node.js.
- Does not start backend services locally.
- Opens the central server URL in app mode:
  `http://192.168.10.37:3000/login.html`

## Important Rule

Only the server hosts the database and services. Client devices only run the universal launcher and connect to the server over the local network.
