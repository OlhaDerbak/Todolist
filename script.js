document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const archiveList = document.getElementById("archive-list");
    const clearArchiveBtn = document.getElementById("clear-archive-btn");
    const languageSelect = document.getElementById("language-select");

    // Translations for supported languages
    const translations = {
        en: { add: "Add", complete: "Complete", delete: "Delete", return: "Return", placeholder: "Add a new task...", clear: "Clear Archive" },
        uk: { add: "Додати", complete: "Виконано", delete: "Видалити", return: "Повернути", placeholder: "Додати нове завдання...", clear: "Очистити архів" },
        de: { add: "Hinzufügen", complete: "Fertig", delete: "Löschen", return: "Zurück", placeholder: "Neue Aufgabe hinzufügen...", clear: "Archiv leeren" },
        pl: { add: "Dodaj", complete: "Zakończ", delete: "Usuń", return: "Przywróć", placeholder: "Dodaj nowe zadanie...", clear: "Wyczyść archiwum" }
    };

    // Change language function
    languageSelect.addEventListener("change", () => {
        const selectedLang = languageSelect.value;
        updateLanguage(selectedLang);
    });

    // Initialize with default language
    updateLanguage(languageSelect.value);

    // Add task
    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = "";
        }
    });

    // Function to update language
    function updateLanguage(lang) {
        addTaskBtn.textContent = translations[lang].add;
        taskInput.placeholder = translations[lang].placeholder;
        clearArchiveBtn.textContent = translations[lang].clear;
        updateTaskButtons(lang);
        updateArchiveButtons(lang);
    }

    // Function to update task buttons when language changes
    function updateTaskButtons(lang) {
        const taskItems = taskList.getElementsByTagName("li");
        for (let item of taskItems) {
            const completeBtn = item.querySelector(".complete-btn");
            const deleteBtn = item.querySelector(".delete-btn");
            completeBtn.textContent = translations[lang].complete;
            deleteBtn.textContent = translations[lang].delete;
        }
    }

    // Function to update archive buttons when language changes
    function updateArchiveButtons(lang) {
        const archivedItems = archiveList.getElementsByTagName("li");
        for (let item of archivedItems) {
            const returnBtn = item.querySelector(".return-btn");
            returnBtn.textContent = translations[lang].return;
        }
    }

    // Function to add task
    function addTask(taskText) {
        const li = document.createElement("li");

        const taskSpan = document.createElement("span");
        taskSpan.textContent = taskText;
        li.appendChild(taskSpan);

        const completeBtn = document.createElement("button");
        completeBtn.textContent = translations[languageSelect.value].complete;
        completeBtn.className = "complete-btn";
        completeBtn.addEventListener("click", () => {
            archiveTask(li);
        });
        li.appendChild(completeBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = translations[languageSelect.value].delete;
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => {
            // Only remove if the task is still a child of the task list
            if (taskList.contains(li)) {
                taskList.removeChild(li);
            }
        });
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    }

    // Function to archive task
    function archiveTask(taskItem) {
        taskItem.classList.add("completed");
        taskItem.querySelector(".complete-btn").remove();

        const returnBtn = document.createElement("button");
        returnBtn.textContent = translations[languageSelect.value].return;
        returnBtn.className = "return-btn";
        returnBtn.addEventListener("click", () => {
            returnTask(taskItem);
        });
        taskItem.appendChild(returnBtn);

        archiveList.appendChild(taskItem);
    }

    // Function to return a task to the current list
    function returnTask(taskItem) {
        taskItem.classList.remove("completed");
        taskItem.querySelector(".return-btn").remove();

        const completeBtn = document.createElement("button");
        completeBtn.textContent = translations[languageSelect.value].complete;
        completeBtn.className = "complete-btn";
        completeBtn.addEventListener("click", () => {
            archiveTask(taskItem);
        });
        taskItem.appendChild(completeBtn);

        taskList.appendChild(taskItem);
    }

    // Function to clear the archive
    clearArchiveBtn.addEventListener("click", () => {
        while (archiveList.firstChild) {
            archiveList.removeChild(archiveList.firstChild);
        }
    });
});