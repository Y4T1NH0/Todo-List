// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
                        //save salva o dado no localstorage
                        //done = 0 para supor que as tarefas n começam prontas
const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  //utilizando dados da localstorage
  if(done){
    todo.classList.add("done")
  }
  
  if(save){
    saveTodoLocalStorage({text, done})
  }
  todoList.appendChild(todo);

  todoInput.value = "";
  todoInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide"); // Se estiver exibido, esconde, caso contrário exibe
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    // Verifica se o texto atual é o mesmo do valor antigo
    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text; // Atualiza o título da tarefa
      
      updateTodoLocalStorage(oldInputValue ,text)
    }
  });
};

getSearchTodos = (search) =>{

  const todos = document.querySelectorAll(".todo")
  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    const normalizedSearch = search.toLocaleLowerCase()

    todo.style.display = "flex"

    if(!todoTitle.includes(normalizedSearch)){

      
    todo.style.display = "none"
    }

  
  });
}

const filterTodos = (filterValue) =>{

      const todos = document.querySelectorAll(".todo")

      switch(filterValue){
        
        case "all":
          todos.forEach((todo) => todo.style.display = "flex")
          break;
        
        case "done":
           todos.forEach((todo) => todo.classList.contains("done") ? (todo.style.display ="flex") : 
           (todo.style.display = "none"))

          break;
        
        case "todo":
          todos.forEach((todo) => !todo.classList.contains("done")
        ?(todo.style.display = "flex") :
          (todo.style.display = "none"))

          break;

          default:
            break;


      }
}
// EVENTOS

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    // Função de atualizar o status do localStorage (presumindo que você tenha isso)
    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    removeTodoLocalStorage(todoTitle)
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();

  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    // Atualiza a tarefa
    updateTodo(editInputValue);
  }

  toggleForms();
});


searchInput.addEventListener("keyup", (e) =>{

    const search = e.target.value

    getSearchTodos(search)

})


eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) =>{

   const filterValue = e.target.value

   filterTodos(filterValue)
})


// Local Storage

const getTodoLocalStorage = () =>{

  const todos = Json.parse(localStorage.getItem("todos")) || [] 
  
  return todos;
}

const loadTodos = () =>{

  const todos = getTodoLocalStorage ()

  todos.forEach((todo) =>{
    saveTodo(todo.text, todo.done, 0) //0 pra salvar

  })

}


const saveTodoLocalStorage = (todo) =>{

  //todos os Todos da local storage
    const todos = getTodoLocalStorage()
  //add novo array(estrutura de dados q armazenam varios valores
  // em uma uica variavel)
    todos.push(todo)

  //salva tudo na localstorage
    localStorage.setItem("todos", JSON.stringify(todos)) //json.stringify é pra transformar em string

    //get é pra pegar, set pra substituir, alterar e salvar
}

const removeTodoLocalStorage = (todoText) => {

    const todos = getTodoLocalStorage()

    const filterTodos = todos.filter((todo) => todo.text !== todoText)

    localStorage.setItem("todos", JSON.stringify(filterTodos))
}

const updateTodoStatusLocalStorage = (todoText) =>{
  
  const todos = getTodoLocalStorage()

  todos.map((todo) => todo.text === todoText ? (todo.done = !todo.done) : null)

  localStorage.setItem("todos", JSON.stringify(todos))

}

const updateTodoLocalStorage = (todoOldText, todoNewText) =>{
  
  const todos = getTodoLocalStorage()

  todos.map((todo) => todo.text === todoOldText ? (todo.done = todoNewText) : null)

  localStorage.setItem("todos", JSON.stringify(todos))

}


loadTodos()