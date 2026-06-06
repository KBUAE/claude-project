const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

function withTempCwd(run) {
  const originalCwd = process.cwd();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "claude-project-"));
  process.chdir(tempDir);
  try {
    run();
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function freshManager() {
  const modulePath = require.resolve("../src/taskManager");
  delete require.cache[modulePath];
  return require("../src/taskManager");
}

test("addTask creates a new incomplete task with incrementing id", () => {
  withTempCwd(() => {
    const manager = freshManager();
    const first = manager.addTask("Write docs");
    const second = manager.addTask("Ship release");

    assert.equal(first.id, 1);
    assert.equal(second.id, 2);
    assert.equal(first.completed, false);
    assert.equal(second.completed, false);
  });
});

test("completeTask marks task as completed", () => {
  withTempCwd(() => {
    const manager = freshManager();
    manager.addTask("Fix bug");
    const completed = manager.completeTask(1);

    assert.ok(completed);
    assert.equal(completed.completed, true);
    assert.equal(manager.listTasks()[0].completed, true);
  });
});

test("removeTask deletes matching task and keeps others", () => {
  withTempCwd(() => {
    const manager = freshManager();
    manager.addTask("Task A");
    manager.addTask("Task B");
    const removed = manager.removeTask(1);

    assert.equal(removed, true);
    assert.equal(manager.listTasks().length, 1);
    assert.equal(manager.listTasks()[0].id, 2);
  });
});
