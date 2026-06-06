const openModalBtn = document.getElementById("saveTaskBtn");
const taskModal = document.getElementById("taskModal");
const modalTaskInput = document.getElementById("modalTaskInput");
const addTaskConfirm = document.getElementById("addTaskConfirm");
const closeModalBtn = document.getElementById("closeModalBtn");

const searchInput = document.getElementById("searchInput");
const darkModeBtn = document.getElementById("darkModeBtn");
const prioritySelect = document.getElementById("prioritySelect");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* SAVE */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* SYNC */
function sync() {
    saveTasks();
    renderBoard();
    updateCards();
}

/* VIEW SWITCH */
function showView(view) {

    document.getElementById("dashboardView").style.display =
        view === "dashboard" ? "block" : "none";

    document.getElementById("analyticsView").style.display =
        view === "analytics" ? "block" : "none";

    if (view === "analytics") renderChart();
}

/* DARK MODE */
darkModeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

/* SEARCH */
searchInput?.addEventListener("input", (e) => {

    const value = e.target.value.toLowerCase();

    const filtered = tasks.filter(t =>
        t.name.toLowerCase().includes(value)
    );

    renderBoard(filtered);
});

/* OPEN MODAL */
openModalBtn.addEventListener("click", () => {
    taskModal.style.display = "flex";
});

/* CLOSE MODAL */
closeModalBtn.addEventListener("click", () => {
    taskModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === taskModal) {
        taskModal.style.display = "none";
    }
});

/* ADD TASK */
addTaskConfirm.addEventListener("click", () => {

    const text = modalTaskInput.value.trim();

    if (!text) return;

    tasks.push({
        name: text,
        status: "Pending",
        priority: prioritySelect.value
    });

    modalTaskInput.value = "";
    taskModal.style.display = "none";

    sync();
});

/* ACTIONS */
function completeTask(i) {
    tasks[i].status = "Completed";
    sync();
}

function editTask(i) {
    const v = prompt("Edit task", tasks[i].name);
    if (!v) return;
    tasks[i].name = v;
    sync();
}

function deleteTask(i) {
    tasks.splice(i, 1);
    sync();
}

/* RENDER */
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

        div.innerHTML = `
            <h4>${t.name}</h4>
            <small>${t.status} | ${t.priority}</small>
        `;

        if (t.status === "Pending") pending.appendChild(div);
        if (t.status === "In Progress") progress.appendChild(div);
        if (t.status === "Completed") completed.appendChild(div);
    });
}

/* CARDS */
function updateCards() {

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const pending = tasks.filter(t => t.status === "Pending").length;

    const cards = document.querySelectorAll(".card p");

    cards[0].textContent = total;
    cards[1].textContent = completed;
    cards[2].textContent = pending;
}

/* EXPORT */
function exportTasks() {

    const blob = new Blob([JSON.stringify(tasks, null, 2)], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();
}

/* CHART */
function renderChart() {

    const ctx = document.getElementById("taskChart");

    new Chart(ctx, {
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

/* INIT */
sync();