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

test("addTask stores dueDate when provided", () => {
  withTempCwd(() => {
    const manager = freshManager();
    const task = manager.addTask("Pay invoice", { dueDate: "2026-06-10" });

    assert.equal(task.dueDate, "2026-06-10");
  });
});

test("addTask throws on invalid due date format", () => {
  withTempCwd(() => {
    const manager = freshManager();

    assert.throws(
      () => manager.addTask("Invalid date", { dueDate: "06/10/2026" }),
      /Invalid due date format/
    );
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

test("listOverdueTasks returns only incomplete tasks due before today", () => {
  withTempCwd(() => {
    const manager = freshManager();
    manager.addTask("Overdue", { dueDate: "2026-06-01" });
    manager.addTask("Due today", { dueDate: "2026-06-06" });
    manager.addTask("Future", { dueDate: "2026-06-09" });
    manager.completeTask(1);

    const overdue = manager.listOverdueTasks(new Date("2026-06-06T12:00:00Z"));
    assert.equal(overdue.length, 0);

    manager.addTask("New overdue", { dueDate: "2026-06-01" });
    const overdueAfterAdd = manager.listOverdueTasks(
      new Date("2026-06-06T12:00:00Z")
    );
    assert.equal(overdueAfterAdd.length, 1);
    assert.equal(overdueAfterAdd[0].title, "New overdue");
  });
});

test("listDueTodayTasks returns only incomplete tasks due today", () => {
  withTempCwd(() => {
    const manager = freshManager();
    manager.addTask("Today one", { dueDate: "2026-06-06" });
    manager.addTask("Today two", { dueDate: "2026-06-06" });
    manager.addTask("Tomorrow", { dueDate: "2026-06-07" });
    manager.completeTask(2);

    const dueToday = manager.listDueTodayTasks(
      new Date("2026-06-06T08:00:00Z")
    );
    assert.equal(dueToday.length, 1);
    assert.equal(dueToday[0].title, "Today one");
  });
});
