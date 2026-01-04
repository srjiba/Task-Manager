# Task Manager

A professional, accessible Task Manager web application built with HTML5, CSS3, JavaScript (ES6+) and Bootstrap 5.

This repository contains a single-page task manager with full CRUD functionality, search and filters, priority levels, due dates, categories, and localStorage persistence.

---

## Features

- Create, Read, Update, Delete (CRUD) tasks
- Task metadata: title, description, priority (Low / Medium / High), due date, category
- Toggle task status: Pending / Completed
- Search and filters: by text, status, priority, and category
- Dashboard stats: Total / Completed / Pending
- Bulk action: Clear all completed tasks
- Accessibility-minded markup and announcements
- Responsive layout using Bootstrap 5 and FontAwesome icons
- Data persistence with `localStorage`

---

## Files

- `index.html` — Main markup and Bootstrap integration
- `styles.css` — Custom styles complementing Bootstrap
- `script.js` — TaskManager class with full application logic and persistence

---

## Quick Start

Open `index.html` directly in your browser, or serve the project with a simple HTTP server (recommended for some browsers' module/asset policies):

```bash
# open directly (macOS)
open index.html

# OR serve with Python
python3 -m http.server 8000
# then open http://localhost:8000
```

Once open:

- Click **Add Task** to open the modal and enter task details.
- Use the search box to filter tasks by title/description/category.
- Use the dropdowns to filter by Status, Priority, or Category.
- Click the checkbox on a card to toggle Completed state.
- Use the edit (pencil) icon to modify a task, or the trash icon to delete it.
- Click **Clear All Completed** to remove completed tasks in bulk.

All data is saved to your browser's `localStorage` and will persist between page reloads.

---

## Accessibility & UX

- Semantic HTML sections and ARIA attributes are used for screen-reader accessibility.
- Form validation uses Bootstrap's validation styles and provides feedback for required fields.
- Animations respect `prefers-reduced-motion`.

---

## Development

To modify the app, edit `index.html`, `styles.css`, and `script.js`. The `TaskManager` class in `script.js` is modular and easy to extend (export/import can be added if you convert to a bundler-based setup).

Suggested next improvements:

- Add JSON import/export for tasks
- Add sorting by due date or priority
- Add user preferences (dark mode toggle, default sort)

---

## License

This project is provided as-is for demonstration and learning purposes. Feel free to reuse and adapt the code.
