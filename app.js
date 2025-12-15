 // File: js/app.js
// Student: ahmad abdalhaq (12441881)

/*
  API ENDPOINTS (already implemented on the server):
  Base URL:
    http://portal.almasar101.com/assignment/api
  1) Add task  (POST)
     add.php?stdid=STUDENT_ID&key=API_KEY
     Body (JSON): { "title": "Task title" }
     Returns JSON with the added task.
  2) Get tasks (GET)
     get.php?stdid=STUDENT_ID&key=API_KEY
     - If "id" is omitted: returns all tasks for this student.
     - If "id=NUMBER" is provided: returns one task.
  3) Delete task (GET or DELETE)
     delete.php?stdid=STUDENT_ID&key=API_KEY&id=TASK_ID
     Deletes the task with that ID for the given student.
*/

// Configuration for this student (do not change STUDENT_ID value)
const STUDENT_ID = "12441881";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// Grab elements from the DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

/**
 * Helper to update status message.
 * You can use this in your code.
 */
function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

/**
 * Load all tasks when the page loads
 */
document.addEventListener("DOMContentLoaded", async function () {
  setStatus("Loading tasks...");
  
  try {
    const url = `${API_BASE}/get.php?stdid=${encodeURIComponent(STUDENT_ID)}&key=${encodeURIComponent(API_KEY)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.tasks && Array.isArray(data.tasks)) {
      // Clear existing tasks
      list.innerHTML = "";
      
      // Render each task
      data.tasks.forEach(task => {
        appendTaskToList(task);
      });
      
      setStatus(`${data.tasks.length} task(s) loaded`);
    } else {
      setStatus("No tasks found");
    }
  } catch (error) {
    console.error("Error loading tasks:", error);
    setStatus("Error loading tasks: " + error.message, true);
  }
});

/**
 * Handle form submission to add a new task
 */
if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const title = input.value.trim();
    
    if (!title) {
      setStatus("Please enter a task title", true);
      return;
    }
    
    setStatus("Adding task...");
    
    try {
      const url = `${API_BASE}/add.php?stdid=${encodeURIComponent(STUDENT_ID)}&key=${encodeURIComponent(API_KEY)}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: title })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.task) {
        // Add the new task to the list
        appendTaskToList(data.task);
        
        // Clear the input field
        input.value = "";
        
        setStatus("Task added successfully");
      } else {
        throw new Error(data.message || "Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setStatus("Error adding task: " + error.message, true);
    }
  });
}

/**
 * Append a task to the task list
 */
function appendTaskToList(task) {
  // Create list item
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.taskId = task.id;
  
  // Create title span
  const titleSpan = document.createElement("span");
  titleSpan.className = "task-title";
  titleSpan.textContent = task.title;
  
  // Create actions container
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";
  
  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-delete";
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = function() {
    deleteTask(task.id, li);
  };
  
  // Assemble the elements
  actionsDiv.appendChild(deleteBtn);
  li.appendChild(titleSpan);
  li.appendChild(actionsDiv);
  
  // Add to the list
  list.appendChild(li);
}

/**
 * Delete a task
 */
async function deleteTask(id, liElement) {
  if (!confirm("Delete this task?")) {
    return;
  }
  
  setStatus("Deleting task...");
  
  try {
    const url = `${API_BASE}/delete.php?stdid=${encodeURIComponent(STUDENT_ID)}&key=${encodeURIComponent(API_KEY)}&id=${encodeURIComponent(id)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      // Remove the task from the DOM
      liElement.remove();
      setStatus("Task deleted successfully");
    } else {
      throw new Error(data.message || "Failed to delete task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    setStatus("Error deleting task: " + error.message, true);
  }
}

/**
 * Helper function to render a task (alternative approach)
 */
function renderTask(task) {
  appendTaskToList(task);
}