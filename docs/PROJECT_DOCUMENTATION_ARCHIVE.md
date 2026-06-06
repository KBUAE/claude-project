# Project Documentation Archive
Archived: 2026-06-06

This file captures the current project documentation at task close.

## README.md snapshot

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
`npm test`

## CLAUDE.md snapshot

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A minimal Node.js (CommonJS) project consisting of a single entry point, `index.js`. It is not a git repository and has no dependencies, linter, or test framework configured.

## Commands

- `npm start` — run the app (`node index.js`)
- There is no test suite; `npm test` is the default placeholder and exits with an error.
