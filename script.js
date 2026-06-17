const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const weekdaySelect = document.getElementById("weekdaySelect");

const dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
// If tasks was previously stored as a simple array (legacy format), migrate into Monday
if (Array.isArray(tasks)) {
  const legacy = tasks;
  tasks = {};
  dayNames.forEach(d => tasks[d] = []);
  tasks['Monday'] = legacy.map(t => (typeof t === 'string') ? { text: t, done: false } : (t && typeof t === 'object') ? (t.text ? { text: t.text, done: !!t.done } : { text: String(t), done: false }) : { text: String(t), done: false });
}
// ensure all days exist and migrate string entries to objects {text, done}
dayNames.forEach(d => {
  if (!Array.isArray(tasks[d])) tasks[d] = [];
  tasks[d] = tasks[d].map(t => (typeof t === 'string') ? { text: t, done: false } : t);
});

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderDay(day) {
  const ul = document.getElementById(`${day}List`);
  if (!ul) return;
  ul.innerHTML = '';
  tasks[day].forEach((taskObj, index) => {
    const li = document.createElement('li');
    li.textContent = taskObj.text;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'remove-btn toggle-btn';
    toggleBtn.setAttribute('aria-label', 'toggle done');
    toggleBtn.textContent = taskObj.done ? '✔' : '○';
    toggleBtn.classList.toggle('checked', taskObj.done);
    toggleBtn.addEventListener('click', () => {
      taskObj.done = !taskObj.done;
      saveTasks();
      renderDay(day);
    });

    // delete button next to the toggle
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', 'delete task');
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => {
      tasks[day].splice(index, 1);
      saveTasks();
      renderDay(day);
    });

    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
  });
}

function renderAll() {
  dayNames.forEach(renderDay);
}

addBtn.addEventListener('click', () => {
  const taskText = input.value.trim();
  const day = weekdaySelect.value || 'Monday';
  if (!taskText) return;
  tasks[day].push({ text: taskText, done: false });
  saveTasks();
  renderDay(day);
  input.value = '';
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

renderAll();