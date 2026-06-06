# claude-project
Simple Node.js CLI task manager scaffolded with Claude Code.

## Prerequisites
- Node.js
- npm

## Commands
- Add a task:
  - `npm start -- add "Write release notes"`
- List tasks:
  - `npm start -- list`
- Complete a task:
  - `npm start -- done 1`
- Remove a task:
  - `npm start -- remove 1`

Tasks are persisted to `tasks.json` in the project root.

## Test
```bash
npm test
```
