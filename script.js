// Task Manager - Bootstrap 5 + Vanilla JS
// Features: CRUD, localStorage persistence, search, filters, priority, category, due date, validation

class TaskManager {
  constructor() {
    this.storageKey = 'tasks_v1';
    this.tasks = this.loadTasks();
    this.modalEl = document.getElementById('taskModal');
    this.bsModal = new bootstrap.Modal(this.modalEl);
    this.form = document.getElementById('taskForm');
    this.searchInput = document.getElementById('searchInput');
    this.tasksContainer = document.getElementById('tasksContainer');
    this.emptyState = document.getElementById('emptyState');
    this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
    this.filterStatus = document.getElementById('filterStatus');
    this.filterPriority = document.getElementById('filterPriority');
    this.filterCategory = document.getElementById('filterCategory');

    // Form fields
    this.inputId = document.getElementById('taskId');
    this.inputTitle = document.getElementById('taskTitle');
    this.inputDescription = document.getElementById('taskDescription');
    this.inputPriority = document.getElementById('taskPriority');
    this.inputDueDate = document.getElementById('taskDueDate');
    this.inputCategory = document.getElementById('taskCategory');

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Save (create/update) task
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveFromForm();
    });

    // Search
    this.searchInput.addEventListener('input', () => this.render());

    // Filters
    this.filterStatus.addEventListener('change', () => this.render());
    this.filterPriority.addEventListener('change', () => this.render());
    this.filterCategory.addEventListener('change', () => this.render());

    // Clear completed
    this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());

    // When modal opens for add, reset form
    document.getElementById('addTaskBtn').addEventListener('click', () => this.openAddModal());
  }

  // Load/save
  loadTasks() {
    try { return JSON.parse(localStorage.getItem(this.storageKey)) || []; } catch (e) { return []; }
  }
  saveTasks() { localStorage.setItem(this.storageKey, JSON.stringify(this.tasks)); }

  // Open modal for new task
  openAddModal() {
    this.form.classList.remove('was-validated');
    this.inputId.value = '';
    this.inputTitle.value = '';
    this.inputDescription.value = '';
    this.inputPriority.value = 'Medium';
    this.inputDueDate.value = '';
    this.inputCategory.value = '';
    document.getElementById('taskModalLabel').textContent = 'Add Task';
    this.bsModal.show();
  }

  // Open modal to edit task
  openEditModal(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    this.form.classList.remove('was-validated');
    this.inputId.value = task.id;
    this.inputTitle.value = task.title;
    this.inputDescription.value = task.description || '';
    this.inputPriority.value = task.priority || 'Medium';
    this.inputDueDate.value = task.dueDate ? task.dueDate.split('T')[0] : '';
    this.inputCategory.value = task.category || '';
    document.getElementById('taskModalLabel').textContent = 'Edit Task';
    this.bsModal.show();
  }

  // Save task from modal form (create or update)
  saveFromForm() {
    this.form.classList.add('was-validated');
    if (!this.form.checkValidity()) return;

    const id = this.inputId.value ? Number(this.inputId.value) : Date.now();
    const task = {
      id,
      title: this.inputTitle.value.trim(),
      description: this.inputDescription.value.trim(),
      priority: this.inputPriority.value,
      dueDate: this.inputDueDate.value ? new Date(this.inputDueDate.value).toISOString() : null,
      category: this.inputCategory.value.trim() || 'General',
      completed: false,
      createdAt: this.inputId.value ? (this.tasks.find(t=>t.id===id)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };

    const existsIndex = this.tasks.findIndex(t => t.id === id);
    if (existsIndex > -1) {
      // Preserve completed state if present
      task.completed = this.tasks[existsIndex].completed;
      this.tasks[existsIndex] = task;
    } else {
      this.tasks.push(task);
    }

    this.saveTasks();
    this.populateCategoryFilter();
    this.bsModal.hide();
    this.render();
  }

  // Toggle completion
  toggleComplete(id) {
    const t = this.tasks.find(x => x.id === id);
    if (!t) return;
    t.completed = !t.completed;
    this.saveTasks();
    this.render();
  }

  // Delete
  deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.populateCategoryFilter();
    this.render();
  }

  // Clear completed
  clearCompleted() {
    if (!confirm('Clear all completed tasks?')) return;
    this.tasks = this.tasks.filter(t => !t.completed);
    this.saveTasks();
    this.render();
  }

  // Filtering & searching
  applyFilters(tasks) {
    const q = this.searchInput.value.trim().toLowerCase();
    const status = this.filterStatus.value;
    const priority = this.filterPriority.value;
    const category = this.filterCategory.value;

    return tasks.filter(t => {
      if (status === 'pending' && t.completed) return false;
      if (status === 'completed' && !t.completed) return false;
      if (priority !== 'all' && t.priority !== priority) return false;
      if (category !== 'all' && t.category !== category) return false;
      if (q) {
        const hay = (t.title + ' ' + (t.description||'') + ' ' + (t.category||'')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  // Render all
  render() {
    // Update stats
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('pendingCount').textContent = pending;

    // Populate filters
    this.populateCategoryFilter();

    // Render task cards
    const toShow = this.applyFilters(this.tasks).sort((a,b)=> new Date(a.dueDate||a.createdAt) - new Date(b.dueDate||b.createdAt));
    this.tasksContainer.innerHTML = '';

    if (toShow.length === 0) {
      this.emptyState.style.display = total === 0 ? 'block' : 'block';
      this.tasksContainer.innerHTML = '';
      return;
    }

    this.emptyState.style.display = 'none';

    toShow.forEach(task => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4 d-flex';

      const card = document.createElement('div');
      card.className = 'card task-card flex-fill';

      const body = document.createElement('div');
      body.className = 'card-body d-flex flex-column';

      // Title row
      const titleRow = document.createElement('div');
      titleRow.className = 'd-flex justify-content-between align-items-start mb-2 gap-2';

      const left = document.createElement('div');
      left.className = 'd-flex align-items-start gap-2';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-check-input me-2 mt-1';
      checkbox.checked = !!task.completed;
      checkbox.setAttribute('aria-label', `Mark task ${task.title} as ${task.completed? 'incomplete':'complete'}`);
      checkbox.addEventListener('change', () => this.toggleComplete(task.id));

      const title = document.createElement('h5');
      title.className = 'card-title mb-0 text-break-words';
      title.innerHTML = this.escape(task.title);

      left.appendChild(checkbox);
      left.appendChild(title);

      const badge = document.createElement('span');
      badge.className = `badge badge-priority ms-2 ${'badge-'+task.priority}`;
      badge.textContent = task.priority;

      titleRow.appendChild(left);
      titleRow.appendChild(badge);

      // Description
      const desc = document.createElement('p');
      desc.className = 'card-text mb-2 text-break-words';
      desc.innerHTML = task.description ? this.escape(task.description) : '';

      // Meta row
      const meta = document.createElement('div');
      meta.className = 'd-flex justify-content-between align-items-center task-meta mt-auto';

      const leftMeta = document.createElement('div');
      leftMeta.innerHTML = `<div>${this.escape(task.category||'General')}</div><div>${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</div>`;

      const actions = document.createElement('div');
      actions.className = 'btn-group';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-sm btn-outline-primary';
      editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
      editBtn.title = 'Edit';
      editBtn.addEventListener('click', () => this.openEditModal(task.id));

      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-sm btn-outline-danger';
      delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      delBtn.title = 'Delete';
      delBtn.addEventListener('click', () => this.deleteTask(task.id));

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      meta.appendChild(leftMeta);
      meta.appendChild(actions);

      if (task.completed) {
        title.classList.add('text-decoration-line-through','text-muted');
        desc.classList.add('text-muted');
      }

      body.appendChild(titleRow);
      if (task.description) body.appendChild(desc);
      body.appendChild(meta);

      card.appendChild(body);
      col.appendChild(card);
      this.tasksContainer.appendChild(col);
    });
  }

  populateCategoryFilter() {
    const categories = Array.from(new Set(this.tasks.map(t => t.category).filter(Boolean)));
    const existing = Array.from(this.filterCategory.options).map(o=>o.value);
    // Rebuild options keeping 'all' first
    this.filterCategory.innerHTML = '<option value="all">All Categories</option>' + categories.map(c => `<option value="${this.escapeAttr(c)}">${this.escape(c)}</option>`).join('');
  }

  escape(str){ return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
  escapeAttr(str){ return String(str).replaceAll('"','&quot;').replaceAll("'","&#39;"); }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new TaskManager();
});
