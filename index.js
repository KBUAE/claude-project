const {
  addTask,
  listTasks,
  completeTask,
  removeTask,
  listOverdueTasks,
  listDueTodayTasks,
} = require("./src/taskManager");

function printHelp() {
  console.log("Usage:");
  console.log("  npm start -- add \"Task title\" [--due YYYY-MM-DD]");
  console.log("  npm start -- list");
  console.log("  npm start -- overdue");
  console.log("  npm start -- due-today");
  console.log("  npm start -- done <id>");
  console.log("  npm start -- remove <id>");
}

function formatTask(task) {
  const status = task.completed ? "x" : " ";
  const due = task.dueDate ? ` (due: ${task.dueDate})` : "";
  return `[${status}] ${task.id}. ${task.title}${due}`;
}

function parseAddArgs(args) {
  const titleParts = [];
  let dueDate = null;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--due") {
      dueDate = args[index + 1];
      index += 1;
      continue;
    }
    titleParts.push(arg);
  }

  return {
    title: titleParts.join(" ").trim(),
    dueDate,
  };
}

function run() {
  const [, , command, ...args] = process.argv;

  if (!command || command === "help") {
    printHelp();
    return;
  }

  if (command === "add") {
    const { title, dueDate } = parseAddArgs(args);
    if (!title) {
      console.error("Task title is required.");
      process.exitCode = 1;
      return;
    }
    let task;
    try {
      task = addTask(title, { dueDate });
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
      return;
    }
    console.log(`Added task: ${formatTask(task)}`);
    return;
  }

  if (command === "list") {
    const tasks = listTasks();
    if (tasks.length === 0) {
      console.log("No tasks yet.");
      return;
    }
    tasks.forEach((task) => console.log(formatTask(task)));
    return;
  }

  if (command === "overdue") {
    const tasks = listOverdueTasks();
    if (tasks.length === 0) {
      console.log("No overdue tasks.");
      return;
    }
    tasks.forEach((task) => console.log(formatTask(task)));
    return;
  }

  if (command === "due-today") {
    const tasks = listDueTodayTasks();
    if (tasks.length === 0) {
      console.log("No tasks due today.");
      return;
    }
    tasks.forEach((task) => console.log(formatTask(task)));
    return;
  }

  if (command === "done") {
    const taskId = Number.parseInt(args[0], 10);
    if (Number.isNaN(taskId)) {
      console.error("A numeric task id is required.");
      process.exitCode = 1;
      return;
    }
    const task = completeTask(taskId);
    if (!task) {
      console.error(`Task ${taskId} not found.`);
      process.exitCode = 1;
      return;
    }
    console.log(`Completed task: ${formatTask(task)}`);
    return;
  }

  if (command === "remove") {
    const taskId = Number.parseInt(args[0], 10);
    if (Number.isNaN(taskId)) {
      console.error("A numeric task id is required.");
      process.exitCode = 1;
      return;
    }
    const removed = removeTask(taskId);
    if (!removed) {
      console.error(`Task ${taskId} not found.`);
      process.exitCode = 1;
      return;
    }
    console.log(`Removed task ${taskId}.`);
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exitCode = 1;
}

run();
