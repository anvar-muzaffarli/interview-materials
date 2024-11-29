import Storage from './Storage.js';
import Todo from './Todo.js';



export default class TodoApp {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.todos = Storage.getFromLocal('todos').map(
      (todo) => new Todo(todo.id, todo.title, todo.completed)
    );
    this.todoListElement = document.getElementById('todoList');
    this.todoInputElement = document.getElementById('todoInput');
    this.todoFormElement = document.getElementById('todoForm');

    this.init();
  }

  async init() {
    //ARROW FUNCTION ISTISNA OLMAQLA!
    try {
      const apiTodos = await this.fetchTodos();

//spread
      this.todos = [...this.todos, ...apiTodos];
      //localStorage
      Storage.saveToLocal('todos', this.todos);
      this.renderTodos();
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }

    this.todoFormElement.addEventListener('submit', this.addTodoHandler.bind(this));
    this.todoListElement.addEventListener('click', this.todoActionsHandler.bind(this));
  }

  async fetchTodos() {
    const response = await fetch(`${this.apiUrl}/todos`);
    // res.status(200).json({})
    const data = await response.json();
    // Primitiv vs Reference Pass By Value Pass By Reference
    return data.map((item) => new Todo(item.id, item.title, item.completed));
  }

  async addTodoHandler(event) {
    //event propogation
    event.preventDefault();
    const title = this.todoInputElement.value.trim();

    if (!title) {
      Swal.fire('Error', 'Todonu daxil et', 'error');
      return;
    
    }

    try {
      
      const newTodo = new Todo(Date.now(), title);
      this.todos.push(newTodo);
      Storage.saveToLocal('todos', this.todos);
      this.renderTodos();



    
      await fetch(`${this.apiUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newTodo.id,
          title: newTodo.title,
          completed: newTodo.completed,
        }),
      });

      Swal.fire('Success', 'Todo added successfully!', 'success');
    } catch (error) {
      console.error('Failed to add todo:', error);
      Swal.fire('Error', 'Failed to add todo.', 'error');
    }
  }

  async editTodoHandler(id) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (!todo) return;

    const { value: newTitle } = await Swal.fire({
      title: 'Duzelt',
      input: 'text',
      inputLabel: 'Todonu duzelt',
      inputValue: todo.title,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Legv et',
      inputValidator: (value) => {
        if (!value.trim()) {
          return 'Title cannot be empty!';
        }
      },
    });

    if (newTitle) {
      try {
        todo.title = newTitle;
        Storage.saveToLocal('todos', this.todos);
        this.renderTodos();

        //http://jsonplaceholder.typicode.com
        //RestFul API GET POST PUT DELETE

        // {"title":"Interview task"}

        await fetch(`${this.apiUrl}/todos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todo),
        });

        Swal.fire('Updated!', 'Your todo has been updated.', 'success');
      } catch (error) {
        console.error('Failed to edit todo:', error);
        Swal.fire('Error!', 'Failed to update the todo.', 'error');
      }
    }
  }


  // 0xFBA123
  async deleteTodoHandler(id) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      Storage.saveToLocal('todos', this.todos);
      this.renderTodos();

      try {
        await fetch(`${this.apiUrl}/todos/${id}`, { method: 'DELETE' });
        Swal.fire('Deleted!', 'Your todo has been deleted.', 'success');
      } catch (error) {
        console.error('Failed to delete todo:', error);
        Swal.fire('Error!', 'Failed to delete the todo.', 'error');
      }
    }
  }

  todoActionsHandler(event) {
    const todoElement = event.target.closest('li');
    const id = parseInt(todoElement.dataset.id, 10);

    if (event.target.classList.contains('edit-btn')) {
      this.editTodoHandler(id);
    } else if (event.target.classList.contains('delete-btn')) {
      this.deleteTodoHandler(id);
    }
  }

  renderTodos() {
    this.todoListElement.innerHTML = '';
    this.todos.forEach((todo) => {
      this.todoListElement.appendChild(todo.render());
    });
  }
}
