const fs = require("node:fs");
const path = require("node:path");

const TASKS_FILE = path.join(process.cwd(), "tasks.json");

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

function addTask(title) {
  const tasks = loadTasks();
  const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0);
  const task = {
    id: maxId + 1,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
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

module.exports = {
  listTasks,
  addTask,
  completeTask,
  removeTask,
};
