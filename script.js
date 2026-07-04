const todayDate = document.getElementById("todayDate");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const deleteAllBtn = document.getElementById("deleteAllBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function showTodayDate() {
  const today = new Date();

  todayDate.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounter() {
  const completed = tasks.filter((task) => task.completed).length;
  const remaining = tasks.length - completed;

  taskCounter.textContent = `Total: ${tasks.length} | Completed: ${completed} | Remaining: ${remaining}`;
}

function displayTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
      span.classList.add("completed");
    }

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "Done";
    completeBtn.classList.add("complete-btn");

    completeBtn.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      displayTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      displayTasks();
    });

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);
    taskList.appendChild(li);
  });

  updateCounter();

  deleteAllBtn.style.display = tasks.length > 0 ? "block" : "none";
}

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  tasks.push({
    text: taskText,
    completed: false,
  });

  saveTasks();
  displayTasks();
  taskInput.value = "";
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

deleteAllBtn.addEventListener("click", function () {
  tasks = [];
  saveTasks();
  displayTasks();
});

showTodayDate();
displayTasks();
