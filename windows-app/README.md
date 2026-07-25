# 2B Tex Windows App

This folder builds the installable Windows desktop application for 2B Tex.

## Purpose

Client computers install one Windows application. They do not install:

- SQL Server
- Node.js
- project dependencies

Only `2B-Server` runs the production services and database. The desktop application connects to:

`http://192.168.11.191:3000/login.html`

## Build

From this folder:

```powershell
npm install
npm run build
```

Build outputs:

- `dist\2B Tex Setup 2026.7.25.exe`: normal Windows installer.
- `dist\2B Tex Portable 2026.7.25.exe`: portable emergency copy.
- `dist\win-unpacked`: managed deployment source used by the client updater.

## Install On A Client

The production entry point is `\\2B-Server\2B-Tex\2B Tex.exe`. It verifies and updates the local workstation package automatically, then opens the app. Workstations do not need a manual Node.js or SQL Server installation.

The application does not contain a separate database. All users work against the same production database on `2B-Server`, so concurrent devices see the same data.

## Server Behavior

If the application is opened on the server machine, it can start the 2B Tex services first. On workstations, it only connects to the production server.
