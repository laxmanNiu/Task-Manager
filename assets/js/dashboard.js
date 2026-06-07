const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "login.html";
}

/* ---------- ELEMENTS ---------- */
const openModalBtn = document.getElementById("saveTaskBtn");
const taskModal = document.getElementById("taskModal");
const modalTaskInput = document.getElementById("modalTaskInput");
const addTaskConfirm = document.getElementById("addTaskConfirm");
const closeModalBtn = document.getElementById("closeModalBtn");

const searchInput = document.getElementById("searchInput");
const darkModeBtn = document.getElementById("darkModeBtn");
const prioritySelect = document.getElementById("prioritySelect");
const dueDateInput = document.getElementById("dueDate");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* ---------- STORAGE ---------- */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ---------- INIT ---------- */
function initUser() {
    const el = document.getElementById("welcomeUser");
    if (el) {
        el.textContent = "Welcome, " + currentUser.name;
    }
}

/* ---------- SYNC ---------- */
function sync() {
    saveTasks();
    renderBoard();
    updateCards();
}

/* ---------- VIEW SWITCH ---------- */
function showView(view) {

    document.getElementById("dashboardView").style.display =
        view === "dashboard" ? "block" : "none";

    document.getElementById("analyticsView").style.display =
        view === "analytics" ? "block" : "none";

    if (view === "analytics") {
        renderChart();
    }
}

/* ---------- DARK MODE ---------- */
darkModeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

/* ---------- SEARCH ---------- */
searchInput?.addEventListener("input", (e) => {

    const value = e.target.value.toLowerCase();

    const filtered = tasks.filter(t =>
        t.name.toLowerCase().includes(value)
    );

    renderBoard(filtered);
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

    if (!text) return;

    tasks.push({
        id: Date.now(),
        name: text,
        status: "Pending",
        priority: prioritySelect.value,
        dueDate: dueDateInput ? dueDateInput.value : "",
        createdAt: new Date().toISOString()
    });

    modalTaskInput.value = "";
    if (dueDateInput) dueDateInput.value = "";

    taskModal.style.display = "none";

    sync();
});

/* ---------- ACTIONS ---------- */
function completeTask(i) {
    tasks[i].status = "Completed";
    sync();
}

function editTask(i) {
    const v = prompt("Edit task", tasks[i].name);
    if (!v) return;
    tasks[i].name = v.trim();
    sync();
}

function deleteTask(i) {
    tasks.splice(i, 1);
    sync();
}

/* ---------- RENDER BOARD ---------- */
function renderBoard(data = tasks) {

    const pending = document.getElementById("pending");
    const progress = document.getElementById("progress");
    const completed = document.getElementById("completed");

    pending.innerHTML = "<h3>Pending</h3>";
    progress.innerHTML = "<h3>In Progress</h3>";
    completed.innerHTML = "<h3>Completed</h3>";

    data.forEach((t, i) => {

        const div = document.createElement("div");
        div.className = "task";

        const today = new Date();
        const overdue =
            t.dueDate &&
            new Date(t.dueDate) < today &&
            t.status !== "Completed";

        if (overdue) {
            div.style.borderLeft = "5px solid red";
        }

        div.innerHTML = `
            <h4>${t.name}</h4>

            <small>${t.status}</small>

            <br>

            <small>📅 ${t.dueDate || "No Date"}</small>

            <br>

            <span class="priority ${t.priority.toLowerCase()}">
                ${t.priority}
            </span>

            <div>
                <button onclick="completeTask(${i})">✔</button>
                <button onclick="editTask(${i})">✏</button>
                <button onclick="deleteTask(${i})">🗑</button>
            </div>
        `;

        if (t.status === "Pending") pending.appendChild(div);
        if (t.status === "In Progress") progress.appendChild(div);
        if (t.status === "Completed") completed.appendChild(div);
    });
}

/* ---------- CARDS ---------- */
function updateCards() {

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const pending = tasks.filter(t => t.status === "Pending").length;

    const progressPercent =
        total === 0 ? 0 : Math.round((completed / total) * 100);

    const cards = document.querySelectorAll(".card p");

    if (cards.length >= 3) {
        cards[0].textContent = total;
        cards[1].textContent = completed;
        cards[2].textContent = pending;
    }

    const progressEl = document.getElementById("progressPercent");
    if (progressEl) {
        progressEl.textContent = progressPercent + "%";
    }
}

/* ---------- EXPORT ---------- */
function exportTasks() {

    const blob = new Blob(
        [JSON.stringify(tasks, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();
}

/* ---------- CHART ---------- */
let chartInstance = null;

function renderChart() {

    const ctx = document.getElementById("taskChart");

    if (!ctx) return;

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Pending", "Completed"],
            datasets: [{
                label: "Tasks",
                data: [
                    tasks.filter(t => t.status === "Pending").length,
                    tasks.filter(t => t.status === "Completed").length
                ]
            }]
        }
    });
}

/* ---------- LOGOUT ---------- */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

/* ---------- START ---------- */
initUser();
sync();