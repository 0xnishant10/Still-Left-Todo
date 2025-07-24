const token = localStorage.getItem("token");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const userNameEl = document.getElementById("user-name");

if (!token) {
  // No token? Redirect to login.
  window.location.href = "login.html";
}

// Fetch user info from protected route
// show user name (assuming /protected returns { fullName })
fetch("/protected", {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(r => {
    if (!r.ok) throw new Error("unauthorized");
    return r.json();
  })
  .then(data => userNameEl.textContent = data.fullName)
  .catch(() => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

document.getElementById("logout-btn").addEventListener("click", function () {
  // Remove the token from localStorage
  localStorage.removeItem("token");

  // Redirect to login page
  window.location.href = "login.html";
});

// helpers
function el(tag, opts = {}) {
  const e = document.createElement(tag);
  Object.assign(e, opts);
  return e;
}

function renderTask(task) {
  const li = document.createElement("li");
  li.className = "flex items-center justify-between text-base text-start bg-white/10 p-3 px-6 rounded-xl";
  li.dataset.id = task._id;

  const left = el("div", { className: "flex text-md text-md items-center gap-2" });
  const checkbox = el("input", {
    type: "checkbox",
    className:
      "cursor-pointer px-3 w-4 h-4 scale-125 w-4 h-4 scale-125 accent-indigo-500",
    checked: !!task.completed,
  });
  const text = el("span", {
    textContent: task.task,
    className: task.completed ? "line-through text-md opacity-50" : "",
  });

  checkbox.addEventListener("change", () =>
    toggleComplete(task._id, checkbox.checked, text)
  );

  left.append(checkbox, text);

  const right = el("div", { className: "flex gap-2" });
  const editBtn = el("button", {
    textContent: "Edit",
    className:
      "px-2 py-1 text-sm cursor-pointer bg-blue-400 text-black rounded",
  });
  const delBtn = el("button", {
    textContent: "Delete",
    className: "px-2 py-1 text-sm cursor-pointer bg-red-400 text-black rounded",
  });

  editBtn.addEventListener("click", () => editTask(task._id, text));
  delBtn.addEventListener("click", () => deleteTask(task._id, li));

  right.append(editBtn, delBtn);

  li.append(left, right);
  taskList.appendChild(li);
}

// load tasks
function loadTasks() {
  fetch("/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((tasks) => {
      taskList.innerHTML = "";
      tasks.forEach(renderTask);
    })
    .catch(console.error);
}

//add task
addBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();
  if (!task) return;

  fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ task }),
  })
    .then((r) => r.json())
    .then(({ insertedId }) => {
      renderTask({ _id: insertedId, task, completed: false });
      taskInput.value = "";
    })
    .catch(console.error);
});

//toggle complete
function toggleComplete(id, completed, textNode) {
  fetch(`/tasks/${id}/complete`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ completed })
  })
    .then(r => {
      if (!r.ok) throw new Error();
      textNode.className = completed ? "line-through opacity-50" : "";
    })
    .catch(console.error);
}

// edit
function editTask(id, textNode) {
  const newText = prompt("Edit task:", textNode.textContent);
  if (!newText || newText === textNode.textContent) return;

  fetch(`/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ task: newText })
  })
    .then(r => {
      if (!r.ok) throw new Error();
      textNode.textContent = newText;
    })
    .catch(console.error);
}

// delete
function deleteTask(id, li) {
  fetch(`/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(r => {
      if (!r.ok) throw new Error();
      li.remove();
    })
    .catch(console.error);
}

loadTasks();