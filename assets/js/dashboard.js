const openModalBtn = document.getElementById("saveTaskBtn");
const taskModal = document.getElementById("taskModal");
const modalTaskInput = document.getElementById("modalTaskInput");
const addTaskConfirm = document.getElementById("addTaskConfirm");
const closeModalBtn = document.getElementById("closeModalBtn");

const darkModeBtn = document.getElementById("darkModeBtn");
const searchInput = document.getElementById("searchInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* ---------- STORAGE ---------- */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ---------- SYNC ---------- */
function sync() {
    saveTasks();
    renderBoard();
    updateCards();
}

/* ---------- DARK MODE ---------- */
darkModeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

/* ---------- SEARCH ---------- */
searchInput?.addEventListener("input", (e) => {

    const value = e.target.value.toLowerCase();

    const filtered = tasks.filter(task =>
        task.name.toLowerCase().includes(value)
    );

    renderFiltered(filtered);
});

/* ---------- MODAL ---------- */
openModalBtn.addEventListener("click", () => {
    taskModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
    taskModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === taskModal) {
        taskModal.style.display = "none";
    }
});

/* ---------- ADD TASK ---------- */
addTaskConfirm.addEventListener("click", () => {

    const text = modalTaskInput.value.trim();

    if (!text) {
        alert("Enter task");
        return;
    }

tasks.push({
    name: text,
    status: "Pending",
    priority: "Medium"
});

    modalTaskInput.value = "";
    taskModal.style.display = "none";

    sync();
});

/* ---------- ACTIONS ---------- */
function completeTask(index) {
    tasks[index].status = "Completed";
    sync();
}

function editTask(index) {
    const updated = prompt("Edit task:", tasks[index].name);

    if (!updated || !updated.trim()) return;

    tasks[index].name = updated.trim();
    sync();
}

function deleteTask(index) {
    const ok = confirm("Delete task?");
    if (!ok) return;

    tasks.splice(index, 1);
    sync();
}

/* ---------- RENDER BOARD (DEFAULT) ---------- */
function renderBoard() {

    const pendingCol = document.getElementById("pending");
    const progressCol = document.getElementById("progress");
    const completedCol = document.getElementById("completed");

    pendingCol.innerHTML = "<h3>Pending</h3>";
    progressCol.innerHTML = "<h3>In Progress</h3>";
    completedCol.innerHTML = "<h3>Completed</h3>";

    tasks.forEach((task, index) => {

        const card = document.createElement("div");
        card.className = "task";
        card.draggable = true;

        card.innerHTML = `
    <h4>${task.name}</h4>

    <small>
        ${task.status}
        <span class="priority ${task.priority.toLowerCase()}">
            ${task.priority}
        </span>
    </small>
`;

        /* DRAG START */
        card.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("index", index);
        });

        placeTask(card, task.status, pendingCol, progressCol, completedCol);
    });

    enableDropZones();
}

/* ---------- SEARCH RENDER ---------- */
function renderFiltered(filteredTasks) {

    const pendingCol = document.getElementById("pending");
    const progressCol = document.getElementById("progress");
    const completedCol = document.getElementById("completed");

    pendingCol.innerHTML = "<h3>Pending</h3>";
    progressCol.innerHTML = "<h3>In Progress</h3>";
    completedCol.innerHTML = "<h3>Completed</h3>";

    filteredTasks.forEach((task) => {

        const card = document.createElement("div");
        card.className = "task";

        card.innerHTML = `
    <h4>${task.name}</h4>

    <small>
        ${task.status}
        <span class="priority ${task.priority.toLowerCase()}">
            ${task.priority}
        </span>
    </small>
`;

        placeTask(card, task.status, pendingCol, progressCol, completedCol);
    });
}

/* ---------- HELPER ---------- */
function placeTask(card, status, pendingCol, progressCol, completedCol) {

    if (status === "Pending") {
        pendingCol.appendChild(card);
    }
    else if (status === "In Progress") {
        progressCol.appendChild(card);
    }
    else {
        completedCol.appendChild(card);
    }
}

/* ---------- DRAG & DROP ---------- */
function enableDropZones() {

    const columns = document.querySelectorAll(".column");

    columns.forEach(col => {

        col.addEventListener("dragover", (e) => {
            e.preventDefault();
            col.classList.add("drag-over");
        });

        col.addEventListener("dragleave", () => {
            col.classList.remove("drag-over");
        });

        col.addEventListener("drop", (e) => {

            col.classList.remove("drag-over");

            const index = e.dataTransfer.getData("index");

            if (col.id === "pending") {
                tasks[index].status = "Pending";
            }

            if (col.id === "progress") {
                tasks[index].status = "In Progress";
            }

            if (col.id === "completed") {
                tasks[index].status = "Completed";
            }

            sync();
        });
    });
}

/* ---------- CARDS ---------- */
function updateCards() {

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const pending = tasks.filter(t => t.status === "Pending").length;
    const progress = tasks.filter(t => t.status === "In Progress").length;

    const cards = document.querySelectorAll(".card p");

    if (cards.length >= 3) {
        cards[0].textContent = total;
        cards[1].textContent = completed;
        cards[2].textContent = pending;
    }
}

/* ---------- INIT ---------- */
sync();