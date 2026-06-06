const {
  addTask,
  listTasks,
  completeTask,
  removeTask,
} = require("./src/taskManager");

function printHelp() {
  console.log("Usage:");
  console.log("  npm start -- add \"Task title\"");
  console.log("  npm start -- list");
  console.log("  npm start -- done <id>");
  console.log("  npm start -- remove <id>");
}

function formatTask(task) {
  const status = task.completed ? "x" : " ";
  return `[${status}] ${task.id}. ${task.title}`;
}

function run() {
  const [, , command, ...args] = process.argv;

  if (!command || command === "help") {
    printHelp();
    return;
  }

  if (command === "add") {
    const title = args.join(" ").trim();
    if (!title) {
      console.error("Task title is required.");
      process.exitCode = 1;
      return;
    }
    const task = addTask(title);
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
