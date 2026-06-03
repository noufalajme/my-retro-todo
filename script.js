// --- Your Smart English Routine Data ---
const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const skincareRoutine = {
    0: ["Salicylic Cleanser", "Anua Serum", "Moisturizer"],            // Sunday
    1: ["Centella Hydration", "Retinal Night Magic"],                   // Monday
    2: ["Salicylic Cleanser", "Anua Serum", "Moisturizer"],            // Tuesday
    3: ["Exfoliation & Skin Renewal Night"],                            // Wednesday
    4: ["Deep Intensive Hydration Only"],                               // Thursday
    5: ["Centella Hydration", "Retinal Night Magic"],                   // Friday
    6: ["Exfoliation & Skin Renewal Night"]                             // Saturday
};

const hairAndShowerRoutine = {
    0: ["Henna Treatment", "Nutrient Hair Oil", "Deep Satisfying Shower"], // Sunday
    3: ["Hair Oil Application", "Refreshing Shower"],                       // Wednesday
    5: ["Hair Oil Application", "Refreshing Shower"]                        // Friday
};

// English Day Names for the Retro UI
const englishDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let currentDayIndex = new Date().getDay(); 
let todoList = [];

// App initialization on load
document.addEventListener("DOMContentLoaded", () => {
    initializeDateTime();
    loadAzkarCounters();
    buildDynamicRoutine();
    
    // Smooth transition button
    document.getElementById("start-btn").addEventListener("click", () => {
        switchScreen("welcome-screen", "main-dashboard");
    });
});

// 1. Automatically fetch and format date for your iPhone
function initializeDateTime() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    const dayName = englishDays[currentDayIndex];

    // Update Welcome Screen
    document.getElementById("welcome-day").innerText = dayName;
    document.getElementById("welcome-date").innerText = formattedDate;

    // Update Dashboard Header
    document.getElementById("current-day-title").innerText = `${dayName}'s List`;
    document.getElementById("current-date-subtitle").innerText = formattedDate;
}

// 2. Build the exact routine for the current day
function buildDynamicRoutine() {
    // A. Add Prayers
    prayers.forEach(prayer => {
        todoList.push({ id: `prayer-${prayer}`, text: `${prayer} Prayer`, checked: false });
    });

    // B. Add Smart Skincare for today
    const todaySkincare = skincareRoutine[currentDayIndex] || [];
    todaySkincare.forEach((step, idx) => {
        todoList.push({ id: `skincare-${idx}`, text: step, checked: false });
    });

    // C. Add Hair & Shower if applicable for today
    const todayHairShower = hairAndShowerRoutine[currentDayIndex];
    if (todayHairShower) {
        document.getElementById("hair-shower-section").classList.remove("hidden");
        todayHairShower.forEach((step, idx) => {
            todoList.push({ id: `hair-${idx}`, text: step, checked: false });
        });
    }

    // D. Load saved custom missions for today from LocalStorage
    const savedCustoms = JSON.parse(localStorage.getItem(`y2k-custom-tasks-${currentDayIndex}`)) || [];
    todoList = todoList.concat(savedCustoms);

    renderAllLists();
}

// 3. Render the pixel-styled list items on screen
function renderAllLists() {
    const prayersArea = document.getElementById("prayers-list");
    const skincareArea = document.getElementById("skincare-list");
    const hairArea = document.getElementById("hair-shower-list");
    const customArea = document.getElementById("custom-tasks-list");

    prayersArea.innerHTML = "";
    skincareArea.innerHTML = "";
    hairArea.innerHTML = "";
    customArea.innerHTML = "";

    todoList.forEach(item => {
        const itemHTML = `
            <div class="task-item ${item.checked ? 'checked' : ''}" onclick="toggleTaskCheck('${item.id}')">
                <div class="custom-checkbox"></div>
                <span class="task-text">${item.text}</span>
            </div>
        `;

        if (item.id.startsWith("prayer-")) {
            prayersArea.insertAdjacentHTML("beforeend", itemHTML);
        } else if (item.id.startsWith("skincare-")) {
            skincareArea.insertAdjacentHTML("beforeend", itemHTML);
        } else if (item.id.startsWith("hair-")) {
            hairArea.insertAdjacentHTML("beforeend", itemHTML);
        } else if (item.id.startsWith("custom-")) {
            customArea.insertAdjacentHTML("beforeend", itemHTML);
        }
    });

    calculateProgress();
}

// 4. Toggle checkmarks and live update the progress bar
function toggleTaskCheck(id) {
    const task = todoList.find(t => t.id === id);
    if (task) {
        task.checked = !task.checked;
        
        // Save state immediately if it's a custom task
        if (id.startsWith("custom-")) {
            const customs = todoList.filter(t => t.id.startsWith("custom-"));
            localStorage.setItem(`y2k-custom-tasks-${currentDayIndex}`, JSON.stringify(customs));
        }
        
        renderAllLists();
    }
}

function calculateProgress() {
    if (todoList.length === 0) return;
    const checkedCount = todoList.filter(t => t.checked).length;
    const percentage = Math.round((checkedCount / todoList.length) * 100);

    document.getElementById("progress-percentage").innerText = `${percentage}%`;
    document.getElementById("progress-bar").style.width = `${percentage}%`;
}

// 5. Custom Tasks Logic (+)
function openAddTaskModal() { document.getElementById("task-modal").classList.add("open"); }
function closeAddTaskModal() { document.getElementById("task-modal").classList.remove("open"); }

function saveCustomTask() {
    const input = document.getElementById("new-task-input");
    const text = input.value.trim();
    if (text) {
        const newTask = { id: `custom-${Date.now()}`, text: text, checked: false };
        todoList.push(newTask);
        
        const customs = todoList.filter(t => t.id.startsWith("custom-"));
        localStorage.setItem(`y2k-custom-tasks-${currentDayIndex}`, JSON.stringify(customs));
        
        input.value = "";
        closeAddTaskModal();
        renderAllLists();
    }
}

// 6. Cyber-pop Counter Box for Azkar (Saves dynamically on click)
function toggleAzkarModal() {
    document.getElementById("azkar-modal").classList.toggle("open");
}

function incrementCounter(key, target) {
    let currentCount = parseInt(localStorage.getItem(`y2k-azkar-${key}`)) || 0;
    if (currentCount < target) {
        currentCount++;
        localStorage.setItem(`y2k-azkar-${key}`, currentCount);
        document.getElementById(`count-${key}`).innerText = currentCount.toLocaleString();
    }
}

function loadAzkarCounters() {
    const keys = ["istighfar", "tasbeeh", "hawqala", "ibrahimya", "taj"];
    keys.forEach(key => {
        let count = parseInt(localStorage.getItem(`y2k-azkar-${key}`)) || 0;
        document.getElementById(`count-${key}`).innerText = count.toLocaleString();
    });
}

function resetAzkarCounters() {
    if (confirm("Reset all counter scores back to zero?")) {
        const keys = ["istighfar", "tasbeeh", "hawqala", "ibrahimya", "taj"];
        keys.forEach(key => {
            localStorage.setItem(`y2k-azkar-${key}`, 0);
            document.getElementById(`count-${key}`).innerText = "0";
        });
    }
}

// OS Retro Smooth Slide Transition
function switchScreen(fromId, toId) {
    const fromScreen = document.getElementById(fromId);
    const toScreen = document.getElementById(toId);
    
    fromScreen.style.opacity = "0";
    setTimeout(() => {
        fromScreen.classList.remove("active");
        toScreen.classList.add("active");
        setTimeout(() => { toScreen.style.opacity = "1"; }, 50);
    }, 300);
}