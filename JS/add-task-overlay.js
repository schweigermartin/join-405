let dropDownArrowContactsOverlay = document.getElementById("drop-down-arrow-contacts-overlay");
let dropDownArrowCategory = document.getElementById("drop-down");
let concatListOverlay = document.getElementById("contact-listOverlay");
let selectedPriorityOverlay = "";
let contacStateOverlay = 1;
let categoryState = 1;
let selectedCategory = "";
const categorySelect = document.getElementById("categorySelect");
const selectedCategoryElement = document.getElementById("selected-category");
let body = document.getElementById("body");
let title = document.getElementById("title-input");
let description = document.getElementById("description");
let date =  document.getElementById("date-input");
let titleError = document.getElementById("title-error");
let descriptionError = document.getElementById("description-error");
let dateError = document.getElementById("date-error");
let categoryError = document.getElementById("category-error");
let selectedUsersAddTask = [];

/**
 * Öffnet oder schließt das Dropdown-Menü für die Benutzerüberlagerung.
 */
function openDropDownMenuUserOverlay() {
  switch (contacStateOverlay) {
    case 1:
      concatListOverlay.style.display = "flex";
      dropDownArrowContactsOverlay.src = "../Assets/arrow_drop_downaa.png";
      contacStateOverlay = 2;
      addUserToTaskOverlay();
      break;
    case 2:
      concatListOverlay.style.display = "none";
      dropDownArrowContactsOverlay.src = "../Assets/arrow_drop_downaa (1).png";
      contacStateOverlay = 1;
      break;
  }
}
/**
 * Öffnet oder schließt das Dropdown-Menü für die Kategorieauswahl.
 */
function openDropDownMenuCategory() {
  switch (categoryState) {
    case 1:
      categorySelect.style.display = "block";
      dropDownArrowCategory.src = "../Assets/arrow_drop_downaa.png";
      categoryState = 2;
      break;
    case 2:
      categorySelect.style.display = "none";
      dropDownArrowCategory.src = "../Assets/arrow_drop_downaa (1).png";
      categoryState = 1;
      break;
  }
}

/**
 * Fügt Benutzer zur Aufgabenüberlagerung hinzu.
 */
function addUserToTaskOverlay() {
  concatListOverlay.innerHTML = "";

  loadedContacts.forEach((user, index) => {
    let isCheckedOverlay = selectedUsersAddTask.includes(user) ? "checked" : "";
    let selectedClassOverlay = selectedUsersAddTask.includes(user) ? "selected-user" : "";

    let initialsOverlay = user.initialien; 
    let colorOverlay = user.color; 

    concatListOverlay.innerHTML += renderAddToTaskContactsOverlay(colorOverlay, initialsOverlay, user, index, isCheckedOverlay, selectedClassOverlay);
  }); 
}

/**
 * Verarbeitet das Anklicken eines Benutzers in der Aufgabenüberlagerung.
 * @param {number} index - Der Index des Benutzers in der Liste.
 * @param {Event} event - Das auslösende Event.
 */
function checkBoxUserTaskOverlay(index, event) {
  event.stopPropagation(); 

  const user = loadedContacts[index];
  const contactElement = document.querySelectorAll('.contact-overlay')[index];
  const checkbox = contactElement.querySelector('input[type="checkbox"]');

  if (event.target.tagName !== "INPUT") {
    checkbox.checked = !checkbox.checked;
  }

  if (checkbox.checked) {
    if (!selectedUsersAddTask.includes(user)) {
      selectedUsersAddTask.push(user);
    }
    contactElement.classList.add('selected-user');
  } else {
    selectedUsersAddTask = selectedUsersAddTask.filter((u) => u !== user);
    contactElement.classList.remove('selected-user');
  }

  addedUsersOverlay(); 
}

/**
 * Aktualisiert die Anzeige der hinzugefügten Benutzer in der Aufgabenüberlagerung.
 */
function addedUsersOverlay() {
  let addedUsersOverlay = document.getElementById("addedUersOverlay");
  let maxVisibleUsersOverlay = 4;
  addedUsersOverlay.innerHTML = "";

  selectedUsersAddTask.slice(0, maxVisibleUsersOverlay).forEach((user) => {
    let initialsOverlay = user.initialien;

    let colorOverlay = user.color;

    addedUsersOverlay.innerHTML += renderAddedUsersOverlay(colorOverlay, initialsOverlay);
    
  });
  if (selectedUsersAddTask.length > maxVisibleUsersOverlay) {
    let remainingCountOvlay = selectedUsersAddTask.length - maxVisibleUsersOverlay;
    addedUsersOverlay.innerHTML += renderAddedUsersPlaceholder(`+${remainingCountOvlay}`);
  }
}

/**
 * Setzt das Formular zur Erstellung einer Aufgabe zurück.
 */
function clearTask() {
    selectedUsersAddTask = [];
    title.value = "";
    description.value = "";
    document.getElementById("addedUersOverlay").innerHTML = "";
    date.value = "";
    document.getElementById("newSubtaskOverlay").value = "";
    document.getElementById("subtaskLabels").innerHTML = "";
    document.getElementById("selected-category").innerHTML = "Select task category";
    btnMedium.style.backgroundColor = "#FFA800";
    imgMedium.src = "../Assets/prio_medium.png";
    btnLow.style.backgroundColor = "#ffffff";
    imgLow.src = "../Assets/prio_low.png"
    btnUrgent.style.backgroundColor = "#ffffff";
    imgUrgent.src = "../Assets/prio_urgent.png";
  }

/**
 * Wählt eine Kategorie aus und schließt das Dropdown-Menü.
 * @param {string} category - Die ausgewählte Kategorie.
 */
function selectCategory(category) {
  selectedCategory = category;
  selectedCategoryElement.innerText = category;
  categorySelect.style.display = "none";
  categoryError.style.display = "none";
  state = 1;
  dropDownArrowCategory.src = "../Assets/arrow_drop_downaa (1).png";
}

/**
 * Erstellt eine neue Aufgabe.
 * @param {string} title - Der Titel der Aufgabe.
 * @param {string} description - Die Beschreibung der Aufgabe.
 * @param {string} dueDate - Das Fälligkeitsdatum der Aufgabe.
 * @param {string} priority - Die Priorität der Aufgabe.
 * @param {string} category - Die Kategorie der Aufgabe.
 * @param {Array} subtaskListOverlay - Die Liste der Unteraufgaben.
 * @param {Array} selectedUsersAddTask - Die Liste der zugewiesenen Benutzer.
 * @returns {Object} Die erstellte Aufgabe.
 */
function createNewTask(title, description, dueDate, priority, category, subtaskListOverlay, selectedUsersAddTask) {
  const { completedSubtasks, totalSubtasks } = countSubtasks(subtaskListOverlay);
  return {
    id: `task-${Date.now()}`,
    title,
    description,
    dueDate,
    priority,
    category,
    subtasks: subtaskListOverlay,
    completedSubtasks,
    totalSubtasks,
    assignedUsers: selectedUsersAddTask,
  };
}

/**
 * Speichert eine Aufgabe in LocalStorage.
 * @param {string} columnId - Die ID der Spalte, in der die Aufgabe gespeichert werden soll.
 * @param {Object} newTask - Die zu speichernde Aufgabe.
 */
function saveTaskToLocalStorageOverlay(columnId, newTask) {
  const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
  tasks.push(newTask);
  localStorage.setItem(columnId, JSON.stringify(tasks));
}

/**
 * Prüft, ob eine Kategorie ausgewählt wurde.
 * @returns {boolean} True, wenn eine Kategorie ausgewählt wurde, sonst false.
 */
function isCategorySelected() {
  return selectedCategory !== ""; 
}

/**
 * Überprüft, ob alle erforderlichen Felder zum Erstellen einer Aufgabe ausgefüllt sind.
 */
function checkAddTaks() {
    let valid = true; 
    if (title.value.length < 1) {
      titleError.style.display = "flex";
      titleError.innerHTML = "Please add a title";
      valid = false; 
    }
    if (description.value.length < 1) {
      descriptionError.innerHTML = "Please add a description";
      descriptionError.style.display = "flex";
      valid = false; 
    }
    if (date.value.length < 1) {
      dateError.style.display = "flex";
      dateError.innerHTML = "Please select a date";
      valid = false;
    }
    if (!isCategorySelected()) {
      categoryError.style.display = "flex";
      categoryError.innerHTML = "Please select a category for the task";
      valid = false;
    }
    if (valid) {
      addTaskMsg(); 
    }
  }

/**
 * Löscht die Fehlermeldung für den Titel.
 */
function clearTitleError() {
  titleError.innerHTML = "";
}

/**
 * Löscht die Fehlermeldung für die Beschreibung.
 */
function clearDescriptionError() {
  descriptionError.innerHTML = "";
}

/**
 * Löscht die Fehlermeldung für das Datum.
 */
function clearDateError() {
  dateError.innerHTML = "";
}

/**
 * Erstellt eine neue Aufgabe und speichert sie.
 */
function addTask() {
  const title = getFormInputValue("title-input");
  const description = getFormInputValue("description");
  const dueDate = getFormInputValue("date-input");
  const priority = selectedPriorityOverlay || "medium";
  const category = selectedCategory;

  const newTask = createNewTask(
    title,
    description,
    dueDate,
    priority,
    category,
    subtaskListOverlay,
    selectedUsersAddTask
  );
  const currentColumn = localStorage.getItem("currentColumn") || "todo";
  saveTaskToLocalStorageOverlay(currentColumn, newTask);
  window.location.href = "board.html";
}

/**
 * Zeigt eine Nachricht an, wenn eine Aufgabe erfolgreich hinzugefügt wurde.
 */
function addTaskMsg() {
  let msgContainer = document.getElementById("add-task-msg");

    msgContainer.style.display = "flex";
    setTimeout(() => {
      msgContainer.style.display = "none";
      addTask();
      closeOverlay();
    }, 2000); 
}

document.getElementById('add-task-mobile').addEventListener('click', () => {
  if (window.innerWidth < 830) {
      window.location.href = '../HTML/add-task.html';
  }
});

/**
 * Schließt das Overlay für die Aufgabenerstellung.
 */
function closeOverlay() {
  selectedUsersAddTask = [];
  title.value = "";
  description.value = "";
  document.getElementById("addedUersOverlay").innerHTML = "";
  date.value = "";
  document.getElementById("newSubtaskOverlay").value = "";
  document.getElementById("subtaskLabels").innerHTML = "";
  document.getElementById("selected-category").innerHTML =
    "Select task category";
  btnMedium.style.backgroundColor = "#FFA800";
  imgMedium.src = "../Assets/prio_medium.png";
  btnLow.style.backgroundColor = "#ffffff";
  imgLow.src = "../Assets/prio_low.png"
  btnUrgent.style.backgroundColor = "#ffffff";
  imgUrgent.src = "../Assets/prio_urgent.png";
  let hero = document.getElementById("hero");
  hero.style.display = "none";
}

