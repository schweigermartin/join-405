function loadTasks(columnId) {
    const container = document.getElementById(`${columnId}-tasks`);
    container.innerHTML = '';

    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];

    tasks.forEach(task => {
        container.innerHTML += renderTask(task);
    });
    updateTaskVisibilityById(columnId);
}

function renderTask(task) {
    const categoryClass = task.category === "Technical Task" ? "technical-task" : "user-story";
    let priorityIcon;
    switch (task.priority.toLowerCase()) {
        case "low":
            priorityIcon = "../Assets/prio_low.png";
            break;
        case "medium":
            priorityIcon = "../Assets/prio_medium.png";
            break;
        case "urgent":
            priorityIcon = "../Assets/prio_urgent.png";
            break;
        default:
            priorityIcon = "";
    }
    return `
        <div class="user-card" draggable="true" id="${task.id}" ondragstart="drag(event)" onclick="openTaskDetails('${task.id}')">
            <div class="user-story-card todo">
                <div class="progress-container">
                    <h3 class="category-label ${categoryClass}">${task.category}</h3>
                </div>
                <h4>${task.title}</h4>
                <p>${task.description}</p>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${task.totalSubtasks > 0 ? (task.completedSubtasks / task.totalSubtasks) * 100 : 0}%"></div>
                    </div>
                    <span class="subtasks">${task.completedSubtasks}/${task.totalSubtasks} Subtasks</span>
                </div>
                <div class="user-container">
                    <div class="user-avatar-container">
                     ${task.assignedUsers.map(user => {
                         const nameParts = user.name.split(' '); // Split the name into parts
                         const initials = nameParts.length > 1 
                            ? nameParts[0][0] + nameParts[1][0] // First and last initials
                            : nameParts[0][0]; // Only first initial if there's no last name
                         return `<div class="user-avatar" style="background-color: ${user.color};">${initials.toUpperCase()}</div>`;
                     }).join('')}
                    
                    </div>
                    <p>${priorityIcon ? `<img src="${priorityIcon}" alt="${task.priority} Priority" style="height:10px;">` : task.priority}</p>
                </div>
            </div>
        </div>
    `;
}


function getPriorityText(taskElement) {
    return taskElement.querySelector('.user-container p img')
        ? taskElement.querySelector('.user-container p img').alt.replace(' Priority', '')
        : taskElement.querySelector('.user-container p').innerText.trim();
}

function getPriorityIcon(priorityText) {
    switch (priorityText.toLowerCase()) {
        case "low":
            return "../Assets/prio_low.png";
        case "medium":
            return "../Assets/prio_medium.png";
        case "urgent":
            return "../Assets/prio_urgent.png";
        default:
            return "../Assets/prio_medium.png";
    }
}

function getAssignedUsers(taskElement) {
    return Array.from(taskElement.querySelectorAll('.user-avatar')).map(user => ({
        name: user.innerText.trim(),
        color: user.style.backgroundColor
    }));
}

function createTaskObject(taskElement, taskId) {
    const priorityText = getPriorityText(taskElement);
    return {
        id: taskId,
        title: taskElement.querySelector('h4').innerText,
        description: taskElement.querySelector('p').innerText,
        priority: priorityText,
        priorityIcon: getPriorityIcon(priorityText),
        completedSubtasks: parseInt(taskElement.querySelector('.subtasks').innerText.split('/')[0]),
        totalSubtasks: parseInt(taskElement.querySelector('.subtasks').innerText.split('/')[1]),
        category: taskElement.querySelector('.category-label').innerText.trim(),
        assignedUsers: getAssignedUsers(taskElement)
    };
}

function saveTaskToLocalStorage(columnId, taskElement, taskId) {
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];

    if (!tasks.find(task => task.id === taskId)) {
        const newTask = createTaskObject(taskElement, taskId);
        tasks.push(newTask);
        localStorage.setItem(columnId, JSON.stringify(tasks));
    }
}


function updateTaskVisibilityById(columnId) {
    const container = document.getElementById(`${columnId}-tasks`);
    const taskList = document.querySelector(`#${columnId} .task-list`);
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
    taskList.style.display = tasks.length > 0 ? 'none' : 'block';
}

/*function openInputPage(columnId) {
    localStorage.setItem('currentColumn', columnId);
    window.location.href = "/HTML/add-task.html";
}*/
function openInputPage(columnId) {
    localStorage.setItem('currentColumn', columnId);

    // Lade den Inhalt der "add-task.html"
    fetch('/HTML/add-task.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extrahiere den <div id="main-content">-Inhalt
            const mainContent = doc.getElementById('main-content');

            if (mainContent) {
                document.getElementById('main-content-placeholder').innerHTML = mainContent.innerHTML;
                document.getElementById('modalAddtask').classList.add('show');
            }
        });
}

function closeModal() {
    document.getElementById('modalAddtask').classList.remove('show');
}


function searchTasks() {
    let searchText = '';
    
    // Überprüfen, welches Input-Feld aktiv ist
    const searchInputs = document.querySelectorAll('#search');
    searchInputs.forEach(input => {
        if (input.offsetParent !== null) { // Nur sichtbares Inputfeld nutzen
            searchText = input.value.trim().toLowerCase();
        }
    });

    let tasks = document.querySelectorAll('.user-card');
    
    if (searchText.length < 3) {
        tasks.forEach(task => task.style.display = "block");
        return;
    }

    tasks.forEach(task => {
        let taskTitle = task.querySelector('h4') ? task.querySelector('h4').textContent.toLowerCase() : '';
        if (taskTitle.includes(searchText)) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
}


window.addEventListener("load", function () {
    ['todo', 'in-progress', 'await-feedback', 'done'].forEach(loadTasks);
});

let currentTaskId = null;
function formatDate(dateString) {
    if (!dateString) {
        console.warn('Kein Datum übergeben.');
        return 'Datum nicht verfügbar'; // Rückgabewert bei fehlendem Datum
    }

    const [year, month, day] = dateString.split('-');

    if (!year || !month || !day) {
        console.warn('Ungültiges Datumsformat:', dateString);
        return 'Ungültiges Datum'; // Rückgabewert bei falschem Format
    }

    return `${day}/${month}/${year}`; // Ändert das Format zu dd/mm/yyyy
}


function formatPriority(priorityText) {
    let priorityIcon;
    switch (priorityText.toLowerCase()) {
        case "low":
            priorityIcon = "../Assets/prio_low.png";
            break;
        case "medium":
            priorityIcon = "../Assets/prio_medium.png";
            break;
        case "urgent":
            priorityIcon = "../Assets/prio_urgent.png";
            break;
        default:
            priorityIcon = "";
    }

    return `<span class="priority-text">${priorityText}</span> 
            <img src="${priorityIcon}" alt="${priorityText} Priority Icon" class="priority-icon">`;
}

function renderAssignedUsers(users) {
    return users.map(user => `
        <div class="user-item">
            <div class="user-avatar" style="background-color: ${user.color};">${user.name[0]}${user.name.split(' ')[1] ? user.name.split(' ')[1][0] : ''}</div>
            <span class="user-name">${user.name}</span>
        </div>
    `).join('');
}

function updateProgressBar(task) {
    const progressElement = document.querySelector(`#${task.id} .progress-bar .progress`);
    const percentage = task.totalSubtasks > 0 
        ? (task.completedSubtasks / task.totalSubtasks) * 100 
        : 0;
    progressElement.style.width = `${percentage}%`;

    const subtasksElement = document.querySelector(`#${task.id} .subtasks`);
    subtasksElement.innerText = `${task.completedSubtasks}/${task.totalSubtasks} Subtasks`;
}


// Subtask abhaken und Fortschritt direkt aktualisieren
function updateSubtaskCompletion(taskId, index) {
    const checkboxId = `subtask-${taskId}-${index}`;
    const checkboxElement = document.getElementById(checkboxId);

    const allColumns = ['todo', 'in-progress', 'await-feedback', 'done'];
    for (const column of allColumns) {
        let tasks = JSON.parse(localStorage.getItem(column)) || [];
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            if (checkboxElement.checked) {
                tasks[taskIndex].completedSubtasks++;
            } else {
                tasks[taskIndex].completedSubtasks--;
            }
            localStorage.setItem(column, JSON.stringify(tasks));
            updateProgressBar(tasks[taskIndex]);
            break;
        }
    }
}
function openTaskDetails(taskId) {
    const tasks = [...JSON.parse(localStorage.getItem('todo') || "[]"), 
                   ...JSON.parse(localStorage.getItem('in-progress') || "[]"),
                   ...JSON.parse(localStorage.getItem('await-feedback') || "[]"),
                   ...JSON.parse(localStorage.getItem('done') || "[]")];
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        currentTaskId = taskId;
        const modalCategory = document.getElementById('modalCategory');
        modalCategory.innerText = task.category || "No Category";
        modalCategory.className = `category-label ${task.categoryClass || ""}`;
        document.getElementById('modalTitle').innerText = task.title;
        document.getElementById('modalDescription').innerText = task.description;
        const dueDateElement = document.getElementById('modalDueDate');
        dueDateElement.innerText = task.dueDate ? formatDate(task.dueDate) : 'Kein Fälligkeitsdatum';
        document.getElementById('modalPriority').innerHTML = formatPriority(task.priority);
        document.getElementById('modalAssignedUsers').innerHTML = renderAssignedUsers(task.assignedUsers);
        const subtaskList = document.getElementById('modalSubtasks');
        if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
            subtaskList.innerHTML = task.subtasks.map((subtask, index) => `
                <label class="subtask-label">
                    <input type="checkbox" id="subtask-${taskId}-${index}"
                           ${task.completedSubtasks > index ? 'checked' : ''}
                           onchange="updateSubtaskCompletion('${taskId}', ${index})">
                    ${subtask}
                </label>
            `).join('');
        } else {
            subtaskList.innerHTML = '<p>Keine Subtasks verfügbar</p>';
        }
        
        document.getElementById('taskModal').style.display = 'block';
        updateProgressBar(task);
    }
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}



function deleteTask() {
    const allColumns = ['todo', 'in-progress', 'await-feedback', 'done'];
    allColumns.forEach(column => {
        let tasks = JSON.parse(localStorage.getItem(column)) || [];
        tasks = tasks.filter(task => task.id !== currentTaskId);
        localStorage.setItem(column, JSON.stringify(tasks));
    });
    alert('Task deleted successfully.');
    closeTaskModal();
    window.location.reload();
}


function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

function addButton() {
    const headerBoard = document.getElementById('sectionBoard');
    const headerBoardPlus = document.getElementById('sectionBoardPlus');
    
    if (window.innerWidth < 1355) {
        headerBoard.classList.remove('hidden');  // Korrekt geschrieben
        headerBoardPlus.classList.add('hidden'); // Korrekt geschrieben
    } else {
        headerBoard.classList.add('hidden');     // Umgekehrt für größere Bildschirme
        headerBoardPlus.classList.remove('hidden');
    }
}

// Event Listener für die Anpassung der Ansicht basierend auf der Bildschirmgröße
window.addEventListener('resize', addButton);
window.addEventListener('DOMContentLoaded', addButton);

let draggedTaskId = null;

// Task dragging starts
function drag(event) {
    draggedTaskId = event.target.id; // Store the ID of the dragged task
    event.dataTransfer.effectAllowed = "move";
}

// Allow drop and add highlight to the task container
function allowDrop(event) {
    event.preventDefault(); // Prevent default behavior to allow dropping
    const taskContainer = event.target.closest('.task-container');
    if (taskContainer) {
        // Remove highlight from other task containers
        document.querySelectorAll('.task-container.highlight-drop').forEach((container) => {
            container.classList.remove('highlight-drop');
        });
        // Add highlight to the current task container
        taskContainer.classList.add('highlight-drop');
    }
}

// Remove highlight from all task containers
function removeHighlight() {
    document.querySelectorAll('.task-container.highlight-drop').forEach((container) => {
        container.classList.remove('highlight-drop');
    });
}

// Handle dropping the task
function drop(event) {
    event.preventDefault(); // Prevent default behavior
    const targetTaskContainer = event.target.closest('.task-container');
    removeHighlight(); // Remove all highlights after dropping

    if (targetTaskContainer && draggedTaskId) {
        const draggedTaskElement = document.getElementById(draggedTaskId);
        const sourceTaskContainer = draggedTaskElement.closest('.task-container');

        if (draggedTaskElement && targetTaskContainer !== sourceTaskContainer) {
            // Move the task in the DOM
            targetTaskContainer.appendChild(draggedTaskElement);

            // Update localStorage for source and target containers
            const sourceColumnId = sourceTaskContainer.closest('.column').id;
            const targetColumnId = targetTaskContainer.closest('.column').id;

            const sourceTasks = JSON.parse(localStorage.getItem(sourceColumnId)) || [];
            const targetTasks = JSON.parse(localStorage.getItem(targetColumnId)) || [];

            const taskIndex = sourceTasks.findIndex((task) => task.id === draggedTaskId);
            if (taskIndex > -1) {
                targetTasks.push(sourceTasks.splice(taskIndex, 1)[0]);
                localStorage.setItem(sourceColumnId, JSON.stringify(sourceTasks));
                localStorage.setItem(targetColumnId, JSON.stringify(targetTasks));
            }

            // Update UI
            loadTasks(sourceColumnId);
            loadTasks(targetColumnId);
        }
    }
}

// Attach dragleave event to remove highlight when dragging leaves a container
document.querySelectorAll('.task-container').forEach((taskContainer) => {
    taskContainer.addEventListener('dragleave', removeHighlight);
});


function editTask() {
    const taskId = currentTaskId;
    const allColumns = ['todo', 'in-progress', 'await-feedback', 'done'];
    let task = null;
    let columnId = null;

    // Find the task and its column
    for (const column of allColumns) {
        const tasks = JSON.parse(localStorage.getItem(column)) || [];
        const foundTask = tasks.find(t => t.id === taskId);
        if (foundTask) {
            task = foundTask;
            columnId = column;
            break;
        }
    }

    if (task) {
        // Create and fill modal content
        const modalContent = `
            <div class="modal-edit-content">
                <div class="close-edit"><span class="close-button-edit" onclick="closeEditModal()">X</span></div>
                <label for="editTitle">Title</label>
                <input class="edit-text" type="text" id="editTitle" value="${task.title}">

                <label for="editDescription">Description:</label>
                <textarea class="edit-text" id="editDescription">${task.description}</textarea>

                <div class="input-containers">
                  <p>Due date<span>*</span></p>
                  <input class="inputStyle edit-text" type="date" id="editDueDate" value="${task.dueDate || ''}" />
                </div>

                <div class="prio-container">
                  <p>Prio</p>
                  <div class="prio-btn-container">
                    <button onclick="changeColorPrioBtn('urgent')" id="btn-urgent" class="btn-prio-urgent ${task.priority === 'urgent' ? 'active' : ''}">Urgent<img src="../Assets/prio_urgent.png" alt="Urgent" /></button>
                    <button onclick="changeColorPrioBtn('medium')" id="btn-medium" class="btn-prio-medium ${task.priority === 'medium' ? 'active' : ''}">Medium<img src="../Assets/prio_medium.png" alt="Medium" /></button>
                    <button onclick="changeColorPrioBtn('low')" id="btn-low" class="btn-prio-low ${task.priority === 'low' ? 'active' : ''}">Low<img src="../Assets/prio_low.png" alt="Low" /></button>
                  </div>
                </div>

                <div class="input-containers">
                  <p>Assigned to</p>
                  <div onclick="openDropDownMenuUser(), addUserToTask()" class="drop-down">
                    <div>Select contacts to assign</div>
                    <div>
                      <img class="drop-down-arrow" id="drop-down-arrow" src="../Assets/arrow_drop_downaa (1).png" alt="Arrow down"/>
                    </div>
                  </div>
                  <div class="contact-list-container" id="contact-list"></div>
                  <div id="addedUsers">
                    ${task.assignedUsers.map(user => `<div class="user-item"><span>${user.name}</span></div>`).join('')}
                  </div>
                </div>

                <div class="input-containers">
                  <p>Subtasks</p>
                  <div class="subtask-container">
                    <input oninput="toggleButtonVisibility()" class="subtusk-input" type="text" placeholder="Add new subtask" id="newSubtask"/>
                    <img onclick="toggleButtonVisibility(true)" id="plusButton" class="plus-img" src="../Assets/Subtasks +.png" alt=""/>
                    <div class="imgContainer">
                       <button class="add-subtask" id="confirmButton" onclick="addSubtask()">
                          <img src="../Assets/check_blue.png" alt="" />
                       </button>
                       <span class="linie" id="linie" onclick="cancelSubtask()">|</span>
                       <button class="cancle-subtask" id="cancelButton" onclick="cancelSubtask()">
                          <img src="../Assets/iconoir_cancel.png" alt="" />
                        </button>
                    </div>
                  </div>
                  <div id="subtaskLabels" class="subtask-label-container">
                    ${task.subtasks.map((subtask, index) => `
                      <div class="subtask-label">
                        <input type="checkbox" id="subtask-${index}" ${index < task.completedSubtasks ? 'checked' : ''} />
                        <span>${subtask}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="save-edit">
                   <button class="btnPrimary" onclick="saveTaskEdits('${taskId}', '${columnId}')">Save <img src="../Assets/check_blue.png" alt="" /></button>
                </div>
            </div>
        `;

        // Show the modal
        const modal = document.createElement("div");
        modal.id = "editModal";
        modal.className = "modal";
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        modal.style.display = "block";
    }
}


// Benutzer hinzufügen
function addUser() {
    const userName = document.getElementById("newUser").value.trim();
    if (userName) {
        const userList = document.getElementById("userList");
        const userItem = document.createElement("div");
        userItem.className = "user-item";
        userItem.innerHTML = `
            <span>${userName}</span>
            <button onclick="removeUser('${userName}')">Remove</button>
        `;
        userList.appendChild(userItem);
        document.getElementById("newUser").value = "";
    }
}

// Benutzer entfernen
function removeUser(userName) {
    const userItems = document.querySelectorAll("#userList .user-item");
    userItems.forEach(item => {
        if (item.innerText.includes(userName)) {
            item.remove();
        }
    });
}

function saveTaskEdits(taskId, columnId) {
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        // Aktualisierte Details
        tasks[taskIndex].title = document.getElementById("editTitle").value;
        tasks[taskIndex].description = document.getElementById("editDescription").value;
        tasks[taskIndex].priority = document.getElementById("editPriority").value;
        tasks[taskIndex].dueDate = document.getElementById("editDueDate").value;
        tasks[taskIndex].assignedUsers = Array.from(document.querySelectorAll("#userList .user-item span"))
            .map(userSpan => ({ name: userSpan.innerText, color: "#ccc" })); // Standardfarbe

        // Änderungen speichern
        localStorage.setItem(columnId, JSON.stringify(tasks));
        loadTasks(columnId); // UI aktualisieren
        closeEditModal(); // Modal schließen
    }
}

function closeEditModal() {
    const modal = document.getElementById("editModal");
    if (modal) {
        modal.remove();
    }
}
