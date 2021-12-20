// 1. function to dipslay todos
// 2. function to add todos.
// 3. function to store todos to localstorage.

let todos = [];
let getData = JSON.parse(localStorage.getItem("todos-pt2")); // getting data from local storage
if (Array.isArray(getData) && getData.length !== 0) {
  // If getData is array and not empty then assing to the todos varaible.
  todos = getData;
} else {
  // if getData is empty basically when localStorage is empty then fetch data from jsonplaceholder API using axios method
  window.localStorage.removeItem("todos-pt2");
 // Axios is a Javascript library used to make HTTP requests from node.js or XMLHttpRequests from the browser that also supports the ES6 Promise API.
    axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5") 
    .then((res) => {
      // res (is response) in then method we pass the call back function. it gets response from Promise which is our data we can return.
      res.data.map(list =>{

        localStore({title:list.title, id:list.id}); // we save the data to local storage.
      })
      
      todos = JSON.parse(localStorage.getItem("todos-pt2")); //retrive data from local storage and assign to todos.
      render(); // run the render function to display the data
    })
    .catch((err) => console.error(err));
}

let submitBtn = document.getElementById("add-todo"); //adding todo function.
submitBtn.addEventListener("click", addTodo);

function addTodo() {
  let title = document.getElementById("todo-title").value; // reading the value from the input
  let id = new Date().getTime(); // creating a new id everytime we add a new task

  todos.push({ title: title, id: id }); // pushing to the todo array (basically saving)
  console.log(todos);
  localStore(todos); // the local storage will run & save the todo list (tasks) a save to the local storage
  render(); // displaying the list from the local storage
}

//  local storage fucntion
function localStore(todos) {
  // everytime you update the todos. It will be receieved and updated to the localStorage
  localStorage.setItem("todos-pt2", JSON.stringify(todos));
}

function deleteTodo(e) {
  // deleting tasks from the todo list
  let targetId = parseInt(e.target.id);
  todos = todos.filter((todo) => {
    if (todo.id === targetId) {
      return false;
    } else {
      return true;
    }
  });
  localStore(todos); // saving the new list and
  render(); // now displaying the new list.
}

function updateTodo(e) {
  // updating the list
  let targetIndex = parseInt(e.target.id); // everything needs to be updated so that the new edit shows properly
  let saveIndex = document.getElementById("saveIndex");
  let saveEdit = document.getElementById("saveEdit");
  let addTodo = document.getElementById("add-todo");
  let title = document.getElementById("todo-title");
  todos.forEach((todo) => {
    if (targetIndex === todo.id) {
      saveIndex.value = targetIndex;
      title.value = todo.title;
    }
    saveEdit.style.display = "inline-block";
    addTodo.style.display = "none";
  });
}

let saveEdit = document.getElementById("saveEdit");

saveEdit.addEventListener("click", saveUpdate);

function saveUpdate(e) {
  e.preventDefault();

  let saveIndex = document.getElementById("saveIndex").value;
  let title = document.getElementById("todo-title");

  todos.map((todo, idx) => {
    if (parseInt(saveIndex) === todo.id) {
      todos[idx] = { title: title.value, id: saveIndex };
    }
  });
  let saveEdit = document.getElementById("saveEdit");
  let addTodo = document.getElementById("add-todo");
  saveEdit.style.display = "none";
  addTodo.style.display = "inline-block";
  title.value = "";
  localStore(todos);
  render();
}

function render() {
  // creating buttons (update, delete) also displaying the task list.
  document.getElementById("display-todo").innerHTML = "";
  todos.map((todo) => {
    // todos variable holds all data from localStorage
    let element = document.createElement("p"); // creating the Paragraph
    element.innerText = todo.title;
    let btn = document.createElement("button");
    btn.innerText = "Update";
    btn.id = todo.id;
    btn.style = "margin-left:10px";
    btn.onclick = updateTodo; // line 95 to 99 is the update button
    let btnDelete = document.createElement("button"); // line 100 to 104 is the update button
    btnDelete.innerText = "Delete";
    btnDelete.id = todo.id;
    btnDelete.style = "margin-left:10px";
    btnDelete.onclick = deleteTodo;
    element.appendChild(btn); // adding both buttons as a child to paragraph (element)
    element.appendChild(btnDelete);
    let display = document.getElementById("display-todo");
    display.appendChild(element); // Appending paragraph as child to the div
  }); // this block of code will run for every element in the array
}

render();
