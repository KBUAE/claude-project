const fs = require("node:fs");
const path = require("node:path");

const TASKS_FILE = path.join(process.cwd(), "tasks.json");
function toDateOnlyUtc(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function toIsoDateString(date) {
  return date.toISOString().slice(0, 10);
}

function normalizeDueDate(dueDate) {
  if (!dueDate) {
    return null;
  }
  const parsed = toDateOnlyUtc(String(dueDate).trim());
  if (!parsed) {
    return null;
  }
  return toIsoDateString(parsed);
}

function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) {
    return [];
  }

  const content = fs.readFileSync(TASKS_FILE, "utf8").trim();
  if (!content) {
    return [];
  }

  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed;
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2) + "\n", "utf8");
}

function listTasks() {
  return loadTasks();
}
function addTask(title, options = {}) {
  const tasks = loadTasks();
  const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0);
  const dueDate = normalizeDueDate(options.dueDate);
  if (options.dueDate && !dueDate) {
    throw new Error("Invalid due date format. Use YYYY-MM-DD.");
  }
  const task = {
    id: maxId + 1,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate,
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

function completeTask(taskId) {
  const tasks = loadTasks();
  const task = tasks.find((entry) => entry.id === taskId);
  if (!task) {
    return null;
  }
  task.completed = true;
  saveTasks(tasks);
  return task;
}

function removeTask(taskId) {
  const tasks = loadTasks();
  const nextTasks = tasks.filter((entry) => entry.id !== taskId);
  if (nextTasks.length === tasks.length) {
    return false;
  }
  saveTasks(nextTasks);
  return true;
}
function listOverdueTasks(referenceDate = new Date()) {
  const today = toIsoDateString(referenceDate);
  return loadTasks().filter(
    (task) => !task.completed && task.dueDate && task.dueDate < today
  );
}

function listDueTodayTasks(referenceDate = new Date()) {
  const today = toIsoDateString(referenceDate);
  return loadTasks().filter(
    (task) => !task.completed && task.dueDate === today
  );
}

module.exports = {
  listTasks,
  addTask,
  completeTask,
  removeTask,
  listOverdueTasks,
  listDueTodayTasks,
};
