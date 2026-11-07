
// ==================================
// 1. SELECT HTML ELEMENTS
// ==================================

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-name");
const categoryInput = document.querySelector("#category");
const deadlineInput = document.querySelector("#deadline");
const importantInput = document.querySelector("#important");
const taskList = document.querySelector(".task-list");
const progressSection = document.querySelector("#progress");


// ==================================
// 2. STORE TASKS
// ==================================

let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];


// ==================================
// 3. SAVE TASKS
// ==================================

function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}


// ==================================
// 4. DISPLAY TASKS
// ==================================

function displayTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task) {

        const listItem = document.createElement("li");
        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const taskText = document.createElement("span");

        taskText.textContent = task.name;

        const details = document.createElement("small");

        details.textContent =
            " | " + task.category +
            (task.deadline ? " | Due: " + task.deadline : "") +
            (task.important ? " | Important" : "");

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        // Complete a task
        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();
            displayTasks();

        });

        // Delete a task
        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();
            displayTasks();

        });

        listItem.appendChild(checkbox);
        listItem.appendChild(taskText);
        listItem.appendChild(details);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);

    });

    updateProgress();
}


// ==================================
// 5. ADD NEW TASK
// ==================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {

        id: Date.now(),

        name: taskName,

        category: categoryInput.value,

        deadline: deadlineInput.value,

        important: importantInput.checked,

        completed: false

    };

    tasks.push(newTask);

    saveTasks();

    displayTasks();

    taskForm.reset();

});


// ==================================
// 6. UPDATE LEARNING PROGRESS
// ==================================

function updateProgress() {

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function(task) {
        return task.completed;
    }).length;

    let percentage = 0;

    if (totalTasks > 0) {
        percentage = Math.round(
            (completedTasks / totalTasks) * 100
        );
    }

    let progressDisplay = document.querySelector("#tracker-progress");

    if (!progressDisplay) {

        progressDisplay = document.createElement("div");

        progressDisplay.id = "tracker-progress";

        progressSection.appendChild(progressDisplay);

    }

    progressDisplay.innerHTML = `
        <h3>Your Learning Progress</h3>

        <p>${completedTasks} of ${totalTasks} tasks completed</p>

        <div style="background:#ddd; height:20px; border-radius:10px; overflow:hidden;">

            <div style="
                width:${percentage}%;
                background:#176344;
                height:100%;
                transition:width 0.3s;
            "></div>

        </div>

        <h2>${percentage}% Completed</h2>
    `;

}


// ==================================
// 7. LOAD SAVED TASKS
// ==================================

displayTasks();
