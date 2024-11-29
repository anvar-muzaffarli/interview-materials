// Todo.js
export default class Todo {
    constructor(id, title, completed =false) {
      this.id = id;
      this.title = title;
      this.completed = completed;
    }
  
    render() {
      const li = document.createElement('li');
      li.className = 'border p-2 rounded mb-2 flex justify-between items-center';
      li.dataset.id = this.id;
  
      li.innerHTML = `
        <span>${this.completed ? `<s>${this.title}</s>` : this.title}</span>
        <div>
          <button class="edit-btn text-yellow-500">Edit</button>
          <button class="delete-btn text-red-500">Delete</button>
        </div>
      `;
  
      return li;
    }
  }
  