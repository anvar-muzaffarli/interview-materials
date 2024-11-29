// Task Constructor using Prototypes
function Task(description) {
    this.id = Date.now();
    this.description = description;
  }
  
  // Prototype method to render task HTML
  Task.prototype.render = function () {
    const li = document.createElement('li');
    li.className = 'border p-2 rounded mb-2 flex justify-between items-center';
    li.setAttribute('data-id', this.id);
  
    li.innerHTML = `
      <span>${this.description}</span>
      <div>
        <button class="edit-btn text-yellow-500">Edit</button>
        <button class="delete-btn text-red-500">Delete</button>
      </div>
    `;
    return li;
  };
  
  // App State
  const appState = {
    tasks: [],
  };
  
  // Get tasks from localStorage
  function getTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    appState.tasks = tasks.map(task => Object.assign(new Task(), task));
  }
  
  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(appState.tasks));
  }
  
  // Add a new task
  function addTask(description) {
    const newTask = new Task(description);
    appState.tasks.push(newTask);
    saveTasks();
    renderTasks();
  }
  
  // Edit a task
  function editTask(id, newDescription) {
    const task = appState.tasks.find(task => task.id === Number(id));
    if (task) {
      task.description = newDescription;
      saveTasks();
      renderTasks();
    }
  }
  
  // Delete a task
  function deleteTask(id) {
    appState.tasks = appState.tasks.filter(task => task.id !== Number(id));
    saveTasks();
    renderTasks();
  }
  
  // Render all tasks
  function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    appState.tasks.forEach(task => taskList.appendChild(task.render()));
  }
  
  // Event Listeners
  document.getElementById('addTaskBtn').addEventListener('click', () => {
    const taskInput = document.getElementById('taskInput');
    if (taskInput.value.trim()) {
      addTask(taskInput.value.trim());
      taskInput.value = '';
    }
  });
  
  document.getElementById('taskList').addEventListener('click', (e) => {
    const taskId = e.target.closest('li').dataset.id;
    if (e.target.classList.contains('edit-btn')) {
      const newDescription = prompt('Edit Task:', e.target.closest('li').querySelector('span').textContent);
      if (newDescription) editTask(taskId, newDescription);
    }
    if (e.target.classList.contains('delete-btn')) {
      deleteTask(taskId);
    }
  });
  
  // Initialize the app
  getTasks();
  renderTasks();
  