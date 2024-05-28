document.addEventListener('DOMContentLoaded', () => {


    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const taskDueDate = document.getElementById('taskDueDate');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const filterTitle = document.getElementById('filterTitle');
    const filterDueDate = document.getElementById('filterDueDate');
    const sortTasks = document.getElementById('sortTasks');

    let editMode = false;
    let editTaskId = null;


    addTaskButton.addEventListener('click', () => {
        const title = taskTitle.value.trim();
        const description = taskDescription.value.trim();
        const dueDate = taskDueDate.value;

        if (!title || !description || !dueDate) {
            alert('Please fill in all fields');
            return;
        }

        if (editMode) {
            updateTask(editTaskId, title, description, dueDate);
        } else {

            const id = new Date().getTime().toString();

            addTask(id, title, description, dueDate);
        }


        saveTasks();

        clearInputs();
    });

    function addTask(id, title, description, dueDate) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('taskItem');
        taskItem.setAttribute('data-id', id);
        taskItem.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
            <small>Due: ${dueDate}</small>
            <button class="editTaskButton">Edit</button>
            <button class="deleteTaskButton">Delete</button>
        `;

        taskList.appendChild(taskItem);


        taskItem.querySelector('.editTaskButton').addEventListener('click', () => editTask(id));
        taskItem.querySelector('.deleteTaskButton').addEventListener('click', () => deleteTask(id));
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.taskItem').forEach(taskItem => {
            tasks.push({
                id: taskItem.getAttribute('data-id'),
                title: taskItem.querySelector('h3').innerText,
                description: taskItem.querySelector('p').innerText,
                dueDate: taskItem.querySelector('small').innerText.replace('Due: ', '')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }


    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.id, task.title, task.description, task.dueDate));
    }


    function clearInputs() {
        taskTitle.value = '';
        taskDescription.value = '';
        taskDueDate.value = '';
        editMode = false;
        editTaskId = null;
        addTaskButton.textContent = 'Add Task';
    }

    function editTask(id) {
        const taskItem = document.querySelector(`.taskItem[data-id='${id}']`);
        taskTitle.value = taskItem.querySelector('h3').innerText;
        taskDescription.value = taskItem.querySelector('p').innerText;
        taskDueDate.value = taskItem.querySelector('small').innerText.replace('Due: ', '');

        editMode = true;
        editTaskId = id;
        addTaskButton.textContent = 'Save Task';
    }


    function updateTask(id, title, description, dueDate) {
        const taskItem = document.querySelector(`.taskItem[data-id='${id}']`);
        taskItem.querySelector('h3').innerText = title;
        taskItem.querySelector('p').innerText = description;
        taskItem.querySelector('small').innerText = `Due: ${dueDate}`;

        editMode = false;
        editTaskId = null;
        addTaskButton.textContent = 'Add Task';
    }


    function deleteTask(id) {
        const taskItem = document.querySelector(`.taskItem[data-id='${id}']`);
        taskList.removeChild(taskItem);
        saveTasks();
    }


    function filterTasks(tasks) {
        const titleFilter = filterTitle.value.toLowerCase();
        const dueDateFilter = filterDueDate.value;

        return tasks.filter(task => {
            const matchesTitle = task.title.toLowerCase().includes(titleFilter);
            const matchesDueDate = !dueDateFilter || task.dueDate === dueDateFilter;
            return matchesTitle && matchesDueDate;
        });
    }


    function sortTasksList(tasks) {
        const sortOption = sortTasks.value;

        return tasks.sort((a, b) => {
            switch (sortOption) {
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                case 'reverseAlphabetical':
                    return b.title.localeCompare(a.title);
                case 'soonest':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'latest':
                    return new Date(b.dueDate) - new Date(a.dueDate);
                default:
                    return 0;
            }
        });
    }


    function filterAndSortTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const filteredTasks = filterTasks(tasks);
        const sortedTasks = sortTasksList(filteredTasks);
        taskList.innerHTML = '';
        sortedTasks.forEach(task => addTask(task.id, task.title, task.description, task.dueDate));
    }


    filterTitle.addEventListener('input', filterAndSortTasks);
    filterDueDate.addEventListener('input', filterAndSortTasks);
    sortTasks.addEventListener('change', filterAndSortTasks);


    loadTasks();
});