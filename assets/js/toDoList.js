document.addEventListener('DOMContentLoaded', function() {
    loadTasks(); // Get tasks from local storage
  
    // Update close buttons
    updateCloseButtons();
  
    // "Checked" 
    var list = document.querySelector('ul');
    list.addEventListener('click', function(ev) {
      if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
        saveTasks();
      }
    }, false);
  });
  
  // Get tasks from local storage
  function loadTasks() {
    var storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      var tasksArray = JSON.parse(storedTasks);
      tasksArray.forEach(function(task) {
        createTaskItem(task.text, task.checked);
      });
    }
  }
  
  // add new task
  function newTask() {
    var inputValue = document.getElementById("toDoInput").value.trim();
    if (!inputValue) {
      alert("You must write something!");
      return;
    }
    createTaskItem(inputValue, false);
    saveTasks();
    document.getElementById("toDoInput").value = "";
  }
  
  // create list item for task
  function createTaskItem(text, checked) {
    var li = document.createElement("li");
    var t = document.createTextNode(text);
    li.appendChild(t);
  
    
    if (checked) {
      li.classList.add('checked');
    }
  
    document.getElementById("toDoList").appendChild(li);
  
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
  
    updateCloseButtons();
  }
  
  // Save the tasks to LS
  function saveTasks() {
    var listItems = document.querySelectorAll("#toDoList li");
    var tasksArray = [];
    listItems.forEach(function(item) {
      if (item.style.display !== "none") {
        tasksArray.push({
          text: item.firstChild.textContent,
          checked: item.classList.contains('checked')
        });
      }
    });
    localStorage.setItem('tasks', JSON.stringify(tasksArray));
  }
  
  
  function updateCloseButtons() {
    var close = document.getElementsByClassName("close");
    for (var i = 0; i < close.length; i++) {
      close[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
        saveTasks();
      };
    }
  }