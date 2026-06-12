# README FOR CODEX

Read this folder before making any change to the 2B Tex System.

## Project Identity

- Project name: 2B Tex System.
- The system runs and manages a real textile and dyeing factory workflow.
- This is not an invoicing app and not a demo project.
- GitHub is the official source of code.
- Railway is the external runtime environment.
- `project-memory/` is the persistent memory for any future Codex session.

## Required Working Rule

Before any change:

1. Read the files in `project-memory/`.
2. Run `git status`.
3. Understand the current operational flow.
4. Preserve the existing working system.

After any change:

1. Run `npm run check`.
2. Confirm `Operational flow check passed`.
3. Commit with a clear message.
4. Push to `origin/main`.
5. Report what changed and what was not touched.

## Critical Safety

Do not touch calculations, database schema, waste logic, or stock logic unless the user explicitly requests it and the change is tested.

Do not delete data, backups, environment files, or local project folders.

