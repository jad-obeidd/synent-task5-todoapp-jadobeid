const todayDate = document.getElementById("todayDate");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const searchInput = document.getElementById("searchInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const progressBar = document.getElementById("progressBar");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const emptyMessage = document.getElementById("emptyMessage");
const themeBtn = document.getElementById("themeBtn");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

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

function updateStats() {
  const completed = tasks.filter((task) => task.completed).length;
  const remaining = tasks.length - completed;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  taskCounter.textContent = `Total: ${tasks.length} | Completed: ${completed} | Remaining: ${remaining}`;

  progressBar.style.width = `${progress}%`;
}

function getFilteredTasks() {
  const searchValue = searchInput.value.toLowerCase();

  return tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(searchValue);

    if (currentFilter === "active") {
      return matchesSearch && !task.completed;
    }

    if (currentFilter === "completed") {
      return matchesSearch && task.completed;
    }

    return matchesSearch;
  });
}

function displayTasks() {
  taskList.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    const taskContent = document.createElement("div");
    taskContent.classList.add("task-content");

    const taskTitle = document.createElement("p");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = task.text;

    const priorityBadge = document.createElement("span");
    priorityBadge.classList.add("priority", task.priority);
    priorityBadge.textContent = task.priority;

    taskContent.appendChild(taskTitle);
    taskContent.appendChild(priorityBadge);

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("done-btn");
    doneBtn.textContent = task.completed ? "Undo" : "Done";

    doneBtn.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      displayTasks();
    });

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit your task:", task.text);

      if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        displayTasks();
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      saveTasks();
      displayTasks();
    });

    actions.appendChild(doneBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(taskContent);
    li.appendChild(actions);

    taskList.appendChild(li);
  });

  updateStats();

  emptyMessage.style.display = filteredTasks.length === 0 ? "block" : "none";
  deleteAllBtn.style.display = tasks.length > 0 ? "block" : "none";
}

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    priority: priorityInput.value,
    completed: false,
  };

  tasks.push(newTask);

  saveTasks();
  displayTasks();

  taskInput.value = "";
  priorityInput.value = "medium";
  taskInput.focus();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

searchInput.addEventListener("input", displayTasks);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    currentFilter = button.dataset.filter;
    displayTasks();
  });
});

deleteAllBtn.addEventListener("click", () => {
  const confirmDelete = confirm("Are you sure you want to delete all tasks?");

  if (confirmDelete) {
    tasks = [];
    saveTasks();
    displayTasks();
  }
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
  }
}

showTodayDate();
loadTheme();
displayTasks();
