# Task Manager

A modern, accessible web application for managing your daily tasks with a beautiful user interface and seamless user experience.

![Task Manager](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

- ✅ **Add Tasks** - Quickly add new tasks with validation
- ✅ **Mark Complete** - Toggle tasks between pending and completed states
- ✅ **Delete Tasks** - Remove individual tasks or clear all completed tasks at once
- ✅ **Filter System** - View all tasks, only active tasks, or only completed tasks
- ✅ **Task Statistics** - Real-time dashboard showing total, completed, and pending tasks
- ✅ **Dark Mode** - Toggle between light and dark themes with system preference detection
- ✅ **Persistent Storage** - All tasks and preferences are automatically saved to browser storage
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Accessible** - Full keyboard navigation and screen reader support
- ✅ **Modern UI** - Clean, professional design with smooth animations

## 🚀 Quick Start

### Installation

No installation required! This is a pure client-side application.

1. Clone or download the project
2. Open `index.html` in your web browser
3. Start managing your tasks!

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile, Firefox Mobile)

## 📂 Project Structure

```
Task Manager/
├── index.html          # HTML structure and semantic markup
├── styles.css          # Complete styling and responsive design
├── script.js           # Application logic and functionality
└── README.md           # Documentation
```

## 🎨 Design Features

### Modern UI/UX
- Clean, minimalist design with professional color scheme
- Gradient accents on stat cards
- Smooth transitions and animations
- Intuitive empty states with helpful messaging

### Responsive Design
- Desktop: Full-featured layout with side-by-side elements
- Tablet: Optimized spacing and touch-friendly buttons
- Mobile: Stacked layout with full-width inputs

### Color System
- **Light Mode**: Clean, bright interface with slate accents
- **Dark Mode**: Eye-friendly dark theme that respects system preferences

## ♿ Accessibility

This application is built with accessibility as a core principle:

### WCAG 2.1 Compliance
- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`)
- Proper heading hierarchy
- ARIA labels and roles for interactive elements
- Live regions for dynamic content announcements

### Keyboard Navigation
- Full keyboard support for all interactive elements
- Clear focus indicators on all buttons and inputs
- Proper tab order throughout the application
- Enter key support for form submission

### Screen Reader Support
- Descriptive ARIA labels on all buttons and controls
- Live region announcements for task actions
- Form error messages with alert role
- Status updates for filter changes
- Hidden headings for screen reader navigation

### Motion & Preference Respect
- Respects `prefers-reduced-motion` media query
- Automatic dark mode based on system preference
- Customizable via dark mode toggle button

## 💾 Data Storage

All data is stored locally in your browser's localStorage:

- **tasks**: Array of task objects with ID, text, completion status, and creation timestamp
- **darkMode**: Boolean preference for theme selection

Data persists even after closing and reopening the browser. No cloud synchronization or account required.

## 🎯 How to Use

### Adding a Task
1. Type your task in the input field at the top
2. Click "Add Task" or press Enter
3. Task appears in the list below with creation timestamp

### Completing a Task
1. Click the checkbox next to a task
2. Task moves to completed state with strikethrough text
3. Statistics update automatically
4. Completed tasks show with a light green background

### Deleting a Task
1. Click the "Delete" button on any task
2. Task is removed immediately
3. Click "Clear Completed" to remove all completed tasks at once

### Filtering Tasks
- **All**: View all tasks regardless of status
- **Active**: See only pending tasks
- **Completed**: View only finished tasks

### Dark Mode
- Click the sun/moon icon in the top-right corner
- Your preference is saved automatically
- App respects your system color scheme preference on first visit

## 🛠️ Technology Stack

### Frontend Technologies
- **HTML5**: Semantic markup with accessibility best practices
- **CSS3**: Modern styling with CSS custom properties and media queries
- **JavaScript (ES6+)**: Object-oriented design with the TaskManager class

### Key Features Used
- CSS Grid and Flexbox for responsive layouts
- CSS Custom Properties (CSS Variables) for theming
- LocalStorage API for data persistence
- Media Queries for responsive design
- DOM Manipulation for dynamic rendering
- Event delegation patterns for efficiency

## 📋 Code Organization

### HTML Structure
- Semantic elements for better accessibility and SEO
- ARIA attributes for enhanced screen reader support
- Form with proper validation and error handling
- Statistics dashboard with real-time updates
- Task list with filter controls

### CSS Architecture
- Reset styles for consistency across browsers
- CSS custom properties for maintainable theming
- Mobile-first responsive design approach
- Organized sections with clear comments
- Print-friendly styles for task list

### JavaScript Design
- `TaskManager` class encapsulates all functionality
- Clear method organization: DOM management, event handling, rendering, storage
- Comprehensive error handling with try-catch blocks
- XSS prevention through HTML escaping
- JSDoc comments for complex methods

## 🔒 Security

### XSS Prevention
- User input is escaped before rendering to the DOM
- Uses `textContent` instead of `innerHTML` where possible

### Data Validation
- Task text is trimmed and length-validated (max 200 characters)
- Empty tasks are rejected with user-friendly error messages
- LocalStorage errors are caught and logged

## 🎓 Learning Resources

This project demonstrates several important web development concepts:

1. **Object-Oriented JavaScript**: Class-based architecture with clear responsibilities
2. **DOM Manipulation**: Creating, updating, and removing elements dynamically
3. **Event Handling**: Multiple event listeners and delegated event handling patterns
4. **State Management**: Managing application state with localStorage persistence
5. **Responsive Design**: Mobile-first approach with media queries
6. **Web Accessibility**: WCAG 2.1 compliance with ARIA attributes
7. **CSS Architecture**: Custom properties and organized structure

## 🚀 Performance

- Lightweight: ~15KB total (unminified)
- No external dependencies or frameworks
- Efficient DOM updates with focused re-renders
- CSS transitions optimized for 60fps animations
- LocalStorage for instant data persistence

## 📱 Future Enhancements

Potential features for future versions:

- [ ] Task editing capability
- [ ] Due dates and reminders
- [ ] Task categories or tags
- [ ] Priority levels
- [ ] Search/filter by text
- [ ] Drag-and-drop to reorder
- [ ] Export tasks as JSON/CSV
- [ ] Cloud synchronization
- [ ] Recurring tasks
- [ ] Task history/undo

## 🤝 Contributing

Found a bug or have a suggestion? Feel free to:

1. Report issues with clear descriptions
2. Suggest improvements or new features
3. Share your feedback on usability and design

## 📄 License

This project is open source and available under the MIT License. Feel free to use it for personal or commercial projects.

## ✨ Credits

- **Design Inspiration**: Modern productivity apps like Todoist and Microsoft To Do
- **Icons**: Simple SVG icons for excellent performance and accessibility
- **Fonts**: System font stack for better performance and native feel

---

## 🎉 Getting Started

Simply open `index.html` in your browser and start organizing your tasks! No setup, no installation, no complications—just a beautiful task manager ready to use.

**Happy organizing!** 📝✨
