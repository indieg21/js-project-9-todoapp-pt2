//Summary
// Making an api call & the recieved data is stored in todos variable. This happens in else section
//Api aplication programing interface
// Api is considered requesting data from url (jsonplaceholder url).  The Axios is the program which handles asyn jobs (the requst from api call)
//Axios libaray is used to pull the data from the (jsonplaceholder url)call
// line 23-27 if the data is present in local storage then we get that data & save to todos varible (if)
// In-place of saving empty array I am getting data from api call (else)
// The only difference in App 9 is now we are adding the api call to reterive data from JsonP. which allows me to add
// random information list from jsonplaceholder. The purpose of this api is to act as a filler Todo list
// This api runs if my local storage is empty

// Adding all the logic in one function for getting the data from localStorage & the api. The only thing changing from 8 to 9 is the If/Esle statement. If there is is no data in localStorage. The else condition will run through api & that data from the api will be stored in the local storage. After that the data will render (run). The render fucntion will run(display the data (todos from the api))

let todos = []; // Basically acts as a channel, ready to store todos as they come in. The empty array is used to store the object (todos) from the api call or input field (id, title)

function getInfo() {
  // this fucntion will tie all the logic getting the data.

  const getData = JSON.parse(localStorage.getItem("todos-pt2")); // getting data from local storage

  //if (Array.isArray(getData) && getData.length !== 0)
  if (getData !== null) {
    // if there is data in localStorage then that will be saved to todos varaibles.

    todos = getData; //getting data from localStoarge
    render(); // displaying the todos to the page
  } else {
    // if getData is empty basically when localStorage is empty then fetch data from jsonplaceholder API using axios method
    window.localStorage.removeItem("todos-pt2"); // clear out localStorage. Delete all todo's refresh page
    // Axios is a Javascript library used to make HTTP requests from node.js or XMLHttpRequests from the browser that also supports the ES6 Promise API.
    axios
      .get("https://jsonplaceholder.typicode.com/todos?_limit=6") // get will recieve (request) the data from the url link. Which is jsonplaceholder
      .then((res) => {
        // res (is response) in then method we pass the call back function. it gets response from Promise which is our data we can return.
        //console.log(res)
        const apiData = res.data; // this is all data from the api call (array of todos)
        apiData.map((apiTodo) => {
          // map loops through & receives the todo objects
          const { title, id } = apiTodo; //save title & id
          saveData(title, id); // calling the save data function (before I saving whole data instead of just title & id)
          // I made seperate function to save title & id in line 34.
          // we save the data to local storage.
        });
        localStore(todos); // the local storage will run & save the todo list (tasks) a save to the local storage
        todos = JSON.parse(localStorage.getItem("todos-pt2")); //retrive data from local storage and assign to todos.
        render(); // run the render function to display the data from the api
      })
      .catch((err) => console.error(err)); // if data is not recieved from the Api call (request for the link) then error will be displayed.
  }
}
window.addEventListener("load", getInfo); // on page load we are calling getinfo function. Now all our logic for geting the data is in the function

function saveData(title, id) {
  todos.push({ title: title, id: id }); // pushing to the todo array (basically saving)
}

const submitBtn = document.getElementById("add-todo"); //adding todo function.
submitBtn.addEventListener("click", addTodo);

function addTodo() {
  const title = document.getElementById("todo-title").value; // reading the value from the input
  const id = new Date().getTime(); // creating a new id everytime we add a new task

  saveData(title, id);
  //console.log(todos);
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
  const targetId = parseInt(e.target.id);
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
  const targetIndex = parseInt(e.target.id); // everything needs to be updated so that the new edit shows properly
  const saveIndex = document.getElementById("saveIndex");
  const saveEdit = document.getElementById("saveEdit");
  const addTodo = document.getElementById("add-todo");
  const title = document.getElementById("todo-title");
  todos.forEach((todo) => {
    if (targetIndex === todo.id) {
      saveIndex.value = targetIndex;
      title.value = todo.title;
    }
    saveEdit.style.display = "inline-block";
    addTodo.style.display = "none";
  });
}

const saveEdit = document.getElementById("saveEdit");

saveEdit.addEventListener("click", saveUpdate);

function saveUpdate(e) {
  e.preventDefault();

  const saveIndex = document.getElementById("saveIndex").value;
  const title = document.getElementById("todo-title");

  todos.map((todo, idx) => {
    if (parseInt(saveIndex) === todo.id) {
      todos[idx] = { title: title.value, id: saveIndex };
    }
  });
  const saveEdit = document.getElementById("saveEdit");
  const addTodo = document.getElementById("add-todo");
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
    const element = document.createElement("p"); // creating the Paragraph
    element.innerText = todo.title;
    const btn = document.createElement("button");
    btn.innerText = "Update";
    btn.id = todo.id;
    btn.style = "margin-left:10px";
    btn.onclick = updateTodo; // line 95 to 99 is the update button
    const btnDelete = document.createElement("button"); // line 100 to 104 is the update button
    btnDelete.innerText = "Delete";
    btnDelete.id = todo.id;
    btnDelete.style = "margin-left:10px";
    btnDelete.onclick = deleteTodo;
    element.appendChild(btn); // adding both buttons as a child to paragraph (element)
    element.appendChild(btnDelete);
    const display = document.getElementById("display-todo");
    display.appendChild(element); // Appending paragraph as child to the div
  }); // this block of code will run for every element in the array
}

render();
