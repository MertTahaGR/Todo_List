// Tüm Elementleri Seçiyoruz
const editBtn = document.createElement("button");
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function isTodoExist(newTodo) {
  let todos = getTodosFromStorage();
  return todos.includes(newTodo);
}

function eventListeners() {
  //Tüm event Listenerlar
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
}
function clearAllTodos(e) {
  if (confirm("Tümünü silmek istediğinize emin misiniz")) {
    //Arayüzden todoları temizleme
    // todoList.innerHTML = ""; //Yavaş Yöntem
    while (todoList.firstElementChild != null) {
      todoList.removeChild(todoList.firstElementChild);
    }
    localStorage.removeItem("todos");
  }
}
function filterTodos(e) {
  const filterValue = e.target.value.toLowerCase();
  const listItem = document.querySelectorAll(".list-group-item");
  listItem.forEach(function (listItem) {
    const text = listItem.textContent.toLowerCase();
    if (text.indexOf(filterValue) === -1) {
      //Bulamadı
      listItem.setAttribute("style", "display : none !important");
    } else {
      listItem.setAttribute("style", "display :block");
    }
  });
}
function deleteTodo(e) {
  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "Todo Başarıyla Silindi...");
  }
}
function deleteTodoFromStorage(deletetodo) {
  let todos = getTodosFromStorage();
  todos.forEach(function (todo, index) {
    if (todo === deletetodo) {
      todos.splice(index, 1); //Arrayden değeri silebiliriz
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}
function loadAllTodosToUI() {
  let todos = getTodosFromStorage();
  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}
function addTodo(e) {
  const newTodo = todoInput.value.trim();
  if (newTodo === "") {
    showAlert("danger", "Lütfen Bir Todo Giriniz");
  } else if (isTodoExist(newTodo)) {
    showAlert("warning", "Bu todo zaten listede mevcut");
  } else {
    addTodoToStorage(newTodo);
    addTodoToUI(newTodo);
    showAlert("success", "Todo Başarıyla Eklendi...");
  }

  e.preventDefault();
}
function getTodosFromStorage() {
  //Storagedan Todoları Alma
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}
function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function showAlert(type, message) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  firstCardBody.appendChild(alert);

  //setTimeout

  setTimeout(function () {
    alert.remove();
  }, 1000);
}

function addTodoToUI(newTodo) {
  //String Değerini List İtem olarak UI ya Ekleyecek

  //List İtem oluşturma
  const listItem = document.createElement("li");

  //Link Oluşturma
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class='fa fa-remove'></i>";

  listItem.className = "list-group-item d-flex justify-content-between";
  // Text Node Ekleme
  listItem.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(link);

  //   Todo Liste List Item ı Ekleme
  todoList.appendChild(listItem);
  //   Yazıyı Yazıp Ekledikten Sonra yazma kısmı temizlenecek
  todoInput.value = "";
}
