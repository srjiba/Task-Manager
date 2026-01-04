// ===========================
// Task Manager Application
// ===========================

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.initializeElements();
        this.initializeDarkMode();
        this.attachEventListeners();
        this.render();
    }

    // ===========================
    // DOM Elements
    // ===========================

    initializeElements() {
        this.form = document.getElementById('taskForm');
        this.input = document.getElementById('taskInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.searchInput = document.getElementById('searchInput');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.formError = document.getElementById('formError');
        this.totalCount = document.getElementById('totalCount');
        this.completedCount = document.getElementById('completedCount');
        this.pendingCount = document.getElementById('pendingCount');
        this.filterButtons = document.querySelectorAll('.btn-filter');
        this.darkModeToggle = document.getElementById('darkModeToggle');
    }

    // ===========================
    // Event Listeners
    // ===========================

    attachEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleAddTask(e));

        // Filter buttons
        this.filterButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Clear completed button
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());

        // Input validation
        this.input.addEventListener('input', () => this.clearError());

        // Dark mode toggle
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

        // Use event delegation for task list actions
        this.taskList.addEventListener('click', (e) => this.handleListClick(e));
        this.taskList.addEventListener('change', (e) => this.handleListChange(e));

        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.render());
        }
    }

    // ===========================
    // Task Management
    // ===========================

    /**
     * Add a new task
     */
    handleAddTask(e) {
        e.preventDefault();
        const taskText = this.input.value.trim();
        const priority = this.prioritySelect ? this.prioritySelect.value : 'medium';

        // Validation
        if (!taskText) {
            this.showError('Please enter a task');
            return;
        }

        if (taskText.length > 200) {
            this.showError('Task must be less than 200 characters');
            return;
        }

        // Create task object
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            priority: priority,
            createdAt: new Date(),
        };

        this.tasks.push(task);
        this.saveTasks();
        this.input.value = '';
        this.input.focus();
        this.render();

        // Announce to screen readers
        this.announceToScreenReader(`Task "${taskText}" added`);
    }

    /**
     * Delete a task
     */
    deleteTask(id) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        this.saveTasks();
        this.render();
        this.announceToScreenReader('Task deleted');
    }

    /**
     * Toggle task completion
     */
    toggleTask(id) {
        const task = this.tasks.find((t) => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
            const status = task.completed ? 'completed' : 'incomplete';
            this.announceToScreenReader(`Task marked as ${status}`);
        }
    }

    /**
     * Clear all completed tasks
     */
    clearCompleted() {
        const initialCount = this.tasks.length;
        this.tasks = this.tasks.filter((task) => !task.completed);
        const clearedCount = initialCount - this.tasks.length;
        this.saveTasks();
        this.render();
        this.announceToScreenReader(`${clearedCount} completed task(s) deleted`);
    }

    // ===========================
    // Filtering
    // ===========================

    /**
     * Handle filter button clicks
     */
    handleFilter(e) {
        const filter = e.target.dataset.filter;
        this.currentFilter = filter;

        // Update button states
        this.filterButtons.forEach((btn) => {
            const isActive = btn.dataset.filter === filter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });

        this.render();
    }

    /**
     * Get filtered tasks
     */
    getFilteredTasks() {
        const searchTerm = (this.searchInput && this.searchInput.value.trim().toLowerCase()) || '';
        let list = [];
        switch (this.currentFilter) {
            case 'completed':
                list = this.tasks.filter((t) => t.completed);
                break;
            case 'active':
                list = this.tasks.filter((t) => !t.completed);
                break;
            case 'all':
            default:
                list = this.tasks.slice();
                break;
        }

        if (searchTerm) {
            list = list.filter((t) => t.text.toLowerCase().includes(searchTerm));
        }

        return list;
    }

    // ===========================
    // Rendering
    // ===========================

    /**
     * Render the entire UI
     */
    render() {
        this.renderTasks();
        this.updateStats();
        this.updateClearButton();
    }

    /**
     * Render task list
     */
    renderTasks() {
        const filteredTasks = this.getFilteredTasks();

        // Clear the list
        this.taskList.innerHTML = '';

        // Show empty state
        if (this.tasks.length === 0) {
            this.emptyState.style.display = 'block';
            return;
        }

        this.emptyState.style.display = 'none';

        // Show filtered empty state
        if (filteredTasks.length === 0) {
            const message =
                this.currentFilter === 'completed'
                    ? 'No completed tasks yet'
                    : 'No pending tasks. Great job!';
            const emptyFiltered = document.createElement('div');
            emptyFiltered.className = 'empty-state';
            emptyFiltered.style.marginTop = '2rem';
            emptyFiltered.innerHTML = `<p>${message}</p>`;
            this.taskList.appendChild(emptyFiltered);
            return;
        }

        // Render each task
        filteredTasks.forEach((task) => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }

    /**
     * Create a task element
     */
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item${task.completed ? ' completed' : ''}`;
        li.setAttribute('role', 'listitem');

        // Format date
        const date = new Date(task.createdAt);
        const timeString = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        const badgeClass = task.priority === 'high' ? 'badge-high' : task.priority === 'low' ? 'badge-low' : 'badge-medium';
        li.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? 'checked' : ''}
                aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}: ${task.text}"
                data-id="${task.id}"
            >
            <div class="task-content">
                <span class="badge ${badgeClass}">${task.priority}</span>
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <span class="task-time">${timeString}</span>
            </div>
            <div class="task-actions">
                <button class="btn-edit" data-action="edit" data-id="${task.id}" aria-label="Edit task: ${task.text}">Edit</button>
                <button class="btn btn-danger" data-action="delete" data-id="${task.id}" aria-label="Delete task: ${task.text}">Delete</button>
            </div>
        `;

        return li;
    }

    // Handle click events inside the task list (delegation)
    handleListClick(e) {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;
        const action = actionBtn.dataset.action;
        const id = parseInt(actionBtn.dataset.id, 10);
        if (action === 'delete') this.deleteTask(id);
        if (action === 'edit') this.startEditTask(id, actionBtn);
    }

    // Handle change events inside task list (e.g., checkbox)
    handleListChange(e) {
        const checkbox = e.target.closest('.task-checkbox');
        if (!checkbox) return;
        const id = parseInt(checkbox.dataset.id, 10);
        this.toggleTask(id);
    }

    // Start inline editing of a task
    startEditTask(id, buttonEl) {
        const li = buttonEl.closest('.task-item');
        if (!li) return;
        const task = this.tasks.find((t) => t.id === id);
        if (!task) return;

        const content = li.querySelector('.task-content');
        content.innerHTML = `
            <input class="edit-input" type="text" value="${this.escapeHtml(task.text)}" aria-label="Edit task text">
            <select class="priority-select edit-priority">
                <option value="high" ${task.priority==='high'?'selected':''}>High</option>
                <option value="medium" ${task.priority==='medium'?'selected':''}>Medium</option>
                <option value="low" ${task.priority==='low'?'selected':''}>Low</option>
            </select>
        `;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'btn btn-primary';
        saveBtn.addEventListener('click', () => {
            const newText = li.querySelector('.edit-input').value.trim();
            const newPriority = li.querySelector('.edit-priority').value;
            if (!newText) return this.showError('Task text cannot be empty');
            task.text = newText;
            task.priority = newPriority;
            this.saveTasks();
            this.render();
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.style.marginLeft = '0.5rem';
        cancelBtn.addEventListener('click', () => this.render());

        const actions = li.querySelector('.task-actions');
        actions.innerHTML = '';
        actions.appendChild(saveBtn);
        actions.appendChild(cancelBtn);
    }

    /**
     * Update statistics
     */
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter((t) => t.completed).length;
        const pending = total - completed;

        this.totalCount.textContent = total;
        this.completedCount.textContent = completed;
        this.pendingCount.textContent = pending;
    }

    /**
     * Update clear button visibility
     */
    updateClearButton() {
        const hasCompleted = this.tasks.some((t) => t.completed);
        this.clearCompletedBtn.style.display = hasCompleted ? 'block' : 'none';
    }

    // ===========================
    // Storage
    // ===========================

    /**
     * Save tasks to localStorage
     */
    saveTasks() {
        try {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Failed to save tasks:', error);
        }
    }

    /**
     * Load tasks from localStorage
     */
    loadTasks() {
        try {
            const stored = localStorage.getItem('tasks');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load tasks:', error);
            return [];
        }
    }

    // ===========================
    // Utilities
    // ===========================

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show form error message
     */
    showError(message) {
        this.formError.textContent = message;
        this.input.setAttribute('aria-invalid', 'true');
    }

    /**
     * Clear form error message
     */
    clearError() {
        this.formError.textContent = '';
        this.input.setAttribute('aria-invalid', 'false');
    }

    /**
     * Announce messages to screen readers
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }

    // ===========================
    // Dark Mode
    // ===========================

    /**
     * Initialize dark mode based on saved preference or system preference
     */
    initializeDarkMode() {
        const savedDarkMode = this.loadDarkModePreference();
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDarkMode = savedDarkMode !== null ? savedDarkMode : prefersDark;

        if (isDarkMode) {
            this.enableDarkMode();
        }
    }

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        const isDarkMode = document.body.classList.contains('dark-mode');

        if (isDarkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    /**
     * Enable dark mode
     */
    enableDarkMode() {
        document.body.classList.add('dark-mode');
        this.darkModeToggle.setAttribute('aria-pressed', 'true');
        this.saveDarkModePreference(true);
        this.announceToScreenReader('Dark mode enabled');
    }

    /**
     * Disable dark mode
     */
    disableDarkMode() {
        document.body.classList.remove('dark-mode');
        this.darkModeToggle.setAttribute('aria-pressed', 'false');
        this.saveDarkModePreference(false);
        this.announceToScreenReader('Dark mode disabled');
    }

    /**
     * Save dark mode preference to localStorage
     */
    saveDarkModePreference(isDarkMode) {
        try {
            localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        } catch (error) {
            console.error('Failed to save dark mode preference:', error);
        }
    }

    /**
     * Load dark mode preference from localStorage
     */
    loadDarkModePreference() {
        try {
            const saved = localStorage.getItem('darkMode');
            return saved !== null ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Failed to load dark mode preference:', error);
            return null;
        }
    }
}

// ===========================
// Initialize Application
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
