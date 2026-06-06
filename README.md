# claude-project
Simple Node.js CLI task manager scaffolded with Claude Code.

## Prerequisites
- Node.js
- npm

## Commands
- Add a task:
  - `npm start -- add "Write release notes"`
- Add a task with a due date:
  - `npm start -- add "Prepare demo" --due 2026-06-10`
- List tasks:
  - `npm start -- list`
- List overdue tasks:
  - `npm start -- overdue`
- List tasks due today:
  - `npm start -- due-today`
- Complete a task:
  - `npm start -- done 1`
- Remove a task:
  - `npm start -- remove 1`

Tasks are persisted to `tasks.json` in the project root.
Due dates use `YYYY-MM-DD`.

## Test
```bash
npm test
```
