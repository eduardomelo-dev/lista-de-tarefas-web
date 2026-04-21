const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const totalCount = document.querySelector("#total-count");
const doneCount = document.querySelector("#done-count");
const filterButtons = document.querySelectorAll(".filter-button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getVisibleTasks() {
  if (currentFilter === "open") {
    return tasks.filter((task) => !task.done);
  }

  if (currentFilter === "done") {
    return tasks.filter((task) => task.done);
  }

  return tasks;
}

function updateSummary() {
  const done = tasks.filter((task) => task.done).length;
  totalCount.textContent = `${tasks.length} ${tasks.length === 1 ? "tarefa" : "tarefas"}`;
  doneCount.textContent = `${done} ${done === 1 ? "concluída" : "concluídas"}`;
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  list.innerHTML = "";

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item ${task.done ? "done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.className = "task-check";
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Marcar ${task.text} como concluída`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", () => removeTask(task.id));

    item.append(checkbox, text, removeButton);
    list.appendChild(item);
  });

  emptyState.hidden = visibleTasks.length > 0;
  updateSummary();
}

function addTask(text) {
  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    done: false
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task);
  saveTasks();
  renderTasks();
}

function removeTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    return;
  }

  addTask(text);
  input.value = "";
  input.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTasks();
  });
});

renderTasks();