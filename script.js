document.addEventListener("DOMContentLoaded", () => {
    const burgerMenu = document.getElementById("burger-menu");
    const sidebar = document.getElementById("sidebar");
    const closeSidebarBtn = document.getElementById("close-sidebar");
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const setHighPriorityBtn = document.getElementById("set-high-priority");
    const setLowPriorityBtn = document.getElementById("set-low-priority");
    const languageSelect = document.getElementById("language-select");
    const taskList = document.getElementById("task-list");

    const tasks = [];
    let selectedPriority = "low"; // Default priority
    let currentLanguage = "en"; // Default language
    let currentPage = 0; // Page index for pagination
    const itemsPerPage = 3; // Number of tasks per page

    const translations = {
        en: { title: "To-Do List", addTask: "Add Task", highPriority: "High Priority", lowPriority: "Low Priority", filters: "Filters", language: "Language", complete: "Done", delete: "Delete", backToTasks: "Back to Tasks" },
        es: { title: "Lista de Tareas", addTask: "Agregar Tarea", highPriority: "Alta Prioridad", lowPriority: "Baja Prioridad", filters: "Filtros", language: "Idioma", complete: "Hecho", delete: "Eliminar", backToTasks: "Volver a Tareas" },
        fr: { title: "Liste de Tâches", addTask: "Ajouter une Tâche", highPriority: "Haute Priorité", lowPriority: "Basse Priorité", filters: "Filtres", language: "Langue", complete: "Terminer", delete: "Supprimer", backToTasks: "Retour aux Tâches" },
        uk: { title: "Список Завдань", addTask: "Додати Завдання", highPriority: "Високий Пріоритет", lowPriority: "Низький Пріоритет", filters: "Фільтри", language: "Мова", complete: "Завершити", delete: "Видалити", backToTasks: "Повернутися до Завдань" },
        pl: { title: "Lista Zadań", addTask: "Dodaj Zadanie", highPriority: "Wysoki Priorytet", lowPriority: "Niski Priorytet", filters: "Filtry", language: "Język", complete: "Ukończ", delete: "Usuń", backToTasks: "Powrót do Zadań" },
        de: { title: "Aufgabenliste", addTask: "Aufgabe Hinzufügen", highPriority: "Hohe Priorität", lowPriority: "Niedrige Priorität", filters: "Filter", language: "Sprache", complete: "Fertigstellen", delete: "Löschen", backToTasks: "Zurück zu den Aufgaben" },
        it: { title: "Lista di Compiti", addTask: "Aggiungi Compito", highPriority: "Alta Priorità", lowPriority: "Bassa Priorità", filters: "Filtri", language: "Lingua", complete: "Completa", delete: "Elimina", backToTasks: "Torna alle Attività" },
        fi: { title: "Tehtävälista", addTask: "Lisää Tehtävä", highPriority: "Korkea Prioriteetti", lowPriority: "Matala Prioriteetti", filters: "Suodattimet", language: "Kieli", complete: "Valmis", delete: "Poista", backToTasks: "Takaisin Tehtäviin" },
        sv: { title: "Att Göra Lista", addTask: "Lägg till Uppgift", highPriority: "Hög Prioritet", lowPriority: "Låg Prioritet", filters: "Filter", language: "Språk", complete: "Färdig", delete: "Radera", backToTasks: "Tillbaka till Uppgifter" },
        ch: { title: "Aufgabeliste", addTask: "Aufgabe Hinzufügen", highPriority: "Hohe Priorität", lowPriority: "Niedrige Priorität", filters: "Filter", language: "Sprache", complete: "Fertigstellen", delete: "Löschen", backToTasks: "Zurück zu den Aufgaben" },
        el: { title: "Λίστα Καθηκόντων", addTask: "Προσθήκη Καθήκοντος", highPriority: "Υψηλή Προτεραιότητα", lowPriority: "Χαμηλή Προτεραιότητα", filters: "Φίλτρα", language: "Γλώσσα", complete: "Ολοκλήρωση", delete: "Διαγραφή", backToTasks: "Επιστροφή στα Καθήκοντα" },
        cs: { title: "Seznam Úkolů", addTask: "Přidat Úkol", highPriority: "Vysoká Priorita", lowPriority: "Nízká Priorita", filters: "Filtry", language: "Jazyk", complete: "Dokončit", delete: "Smazat", backToTasks: "Zpět na Úkoly" },
        hu: { title: "Feladatlista", addTask: "Feladat Hozzáadása", highPriority: "Magas Prioritás", lowPriority: "Alacsony Prioritás", filters: "Szűrők", language: "Nyelv", complete: "Befejezés", delete: "Törlés", backToTasks: "Vissza a Feladatokhoz" },
        ro: { title: "Lista de Sarcini", addTask: "Adăugați Sarcină", highPriority: "Prioritate Mare", lowPriority: "Prioritate Mică", filters: "Filtre", language: "Limbă", complete: "Finalizare", delete: "Șterge", backToTasks: "Înapoi la Sarcini" }
    };

    function updateLanguage(lang) {
        currentLanguage = lang;
        const textElements = {
            title: document.getElementById("title"),
            addTask: document.getElementById("add-task-btn"),
            highPriority: setHighPriorityBtn,
            lowPriority: setLowPriorityBtn,
        };

        Object.keys(textElements).forEach(key => {
            const translation = translations[lang]?.[key] || translations.en[key];
            textElements[key].textContent = translation;
        });

        renderTasks(); // Update task buttons with new language
    }

    burgerMenu.addEventListener("click", () => {
        sidebar.style.left = "0";
    });

    closeSidebarBtn.addEventListener("click", () => {
        sidebar.style.left = "-250px";
    });

    languageSelect.addEventListener("change", (event) => {
        const selectedLanguage = event.target.value;
        updateLanguage(selectedLanguage);
    });

    setHighPriorityBtn.addEventListener("click", () => {
        selectedPriority = "high";
    });

    setLowPriorityBtn.addEventListener("click", () => {
        selectedPriority = "low";
    });

    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, priority: selectedPriority, completed: false });
            taskInput.value = "";
            renderTasks();
        }
    });

    function renderTasks() {
        taskList.innerHTML = "";
        const start = currentPage * itemsPerPage;
        const paginatedTasks = tasks.slice(start, start + itemsPerPage);

        paginatedTasks.forEach((task) => {
            const taskItem = document.createElement("li");
            taskItem.textContent = task.text;
            taskItem.classList.add(task.priority === "high" ? "high-priority" : "low-priority");

            if (task.completed) {
                taskItem.classList.add("completed");
            }

            const doneBtn = document.createElement("button");
            doneBtn.textContent = translations[currentLanguage]?.complete || "Done";
            doneBtn.classList.add("complete-btn");
            doneBtn.addEventListener("click", () => {
                task.completed = !task.completed; // Toggle completion
                renderTasks(); // Re-render to show updates
            });

            taskItem.appendChild(doneBtn);
            taskList.appendChild(taskItem);
        });
    }

    updateLanguage(currentLanguage);
    renderTasks(); // Initial render
});