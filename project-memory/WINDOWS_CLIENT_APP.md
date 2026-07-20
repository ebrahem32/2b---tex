# Windows Client App

Date: 2026-07-19
Status: active

## Decision

2B Tex runs as a central server application. Workstations must not install SQL Server, Node.js, or project dependencies.

## Server

The server hosts:

- SQL Server database
- Backend API
- Frontend web app
- WhatsApp service

## Client

The client app is a lightweight Windows launcher:

- `F:\2B Tex\client-app\2B Tex Client.cmd`
- Opens `http://192.168.10.37:3000/login.html`
- Uses Microsoft Edge or Chrome in app mode
- Stores only browser profile data under `%LOCALAPPDATA%\2BTex\ClientProfile`

## Rule

Install database and runtime services only on the server. Client devices only need network access to the server URL.
