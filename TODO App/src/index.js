import "./styles.scss";
import Sortable from "sortablejs";

const themeToggler = document.getElementById("themeToggler");
const taskList = document.getElementById("todoList");
const addTodoBtn = document.getElementById("addTodoBtn");
const addTodoInput = document.getElementById("addTodoInput");
const storedTodosStr = localStorage.getItem("todos");

let todos = [];
let currentFilter = "all";

if (storedTodosStr && storedTodosStr.length) {
  todos = JSON.parse(storedTodosStr);
}

const getTodoObj = (todoEl) => {
  const name = todoEl.getAttribute("data-name");
  const index = todos.findIndex((t) => t.name === name);

  return [index, todos[index]];
};

const renderToto = ({ name, isCompleted }) => {
  const container = document.createElement("div");
  container.innerHTML = `
    <li data-name="${name}" class="todo-item ${
    isCompleted ? "is-completed" : ""
  }">
      <div class="todo-item__checkbox">
        <ion-icon name="checkmark"></ion-icon>
      </div>
      <small>${name}</small>
      <ion-icon name="close-outline"></ion-icon>
    </li>
  `.trim();

  const todoEl = container.firstElementChild;
  const checkNameAndDo = (func) => {
    const [index] = getTodoObj(todoEl);
    if (index >= 0) func(index);
  };

  container
    .querySelector("[name='close-outline']")
    .addEventListener("click", () => {
      checkNameAndDo((index) => {
        todos.splice(index, 1);
        taskList.removeChild(todoEl);
        setTodoInfo();
      });
    });

  container
    .querySelector(".todo-item__checkbox")
    .addEventListener("click", () => {
      checkNameAndDo((index) => {
        todos[index].isCompleted = !todos[index].isCompleted;
        todoEl.classList.toggle("is-completed");
        filterTodos();
      });
    });

  return container.firstElementChild;
};

const addTodo = () => {
  const name = addTodoInput.value;

  if (!name || !name.length) return;
  if (todos.find((t) => t.name === name)) return;

  const newTodo = { name, isCompleted: false };
  todos.unshift(newTodo);
  taskList.prepend(renderToto(newTodo));
  addTodoInput.value = "";
  setTodoInfo();
  filterTodos();
};

const setTodoInfo = (count) => {
  const todoLeftText = document.getElementById("todoLeftText");
  todoLeftText.innerHTML = `${count == null ? todos.length : count} items left`;
};

const filterTodos = () => {
  const todoEls = taskList.querySelectorAll(".todo-item");
  todoEls.forEach((el) => el.classList.add("is-hidden"));

  const filterCompleted = (isCompleted) => {
    const res = [];

    todoEls.forEach((el) => {
      const [_, todo] = getTodoObj(el);
      if (todo.isCompleted === isCompleted) res.push(el);
    });

    return res;
  };

  let shownTodos = [];
  switch (currentFilter) {
    case "active":
      shownTodos = filterCompleted(false);
      break;
    case "completed":
      shownTodos = filterCompleted(true);
      break;
    default:
      shownTodos = todoEls;
      break;
  }
  shownTodos.forEach((el) => el.classList.remove("is-hidden"));
  setTodoInfo(shownTodos.length);
};

const clearCompleted = () => {
  const todoEls = taskList.querySelectorAll(".todo-item");
  todoEls.forEach((el) => {
    const [index, todo] = getTodoObj(el);
    if (index >= 0 && todo.isCompleted) {
      taskList.removeChild(el);
      todos.splice(index, 1);
    }
  });

  filterTodos();
};

const mountTodoInfo = () => {
  const container = document.createElement("div");
  container.innerHTML = `
    <li class="todo-info">
      <small id="todoLeftText">${todos.length} items left</small>
      <div class="todo-filter">
        <input
          id="filterAll"
          type="radio"
          name="filterOpt"
          value="all"
          checked
        />
        <label for="filterAll">All</label><br />
        <input 
          id="filterActive" 
          type="radio" 
          name="filterOpt" 
          value="active"
         />
        <label for="filterActive">Active</label><br />
        <input
          id="filterCompleted"
          type="radio"
          name="filterOpt"
          value="completed"
        />
        <label for="filterCompleted">Completed</label>
      </div>
      <small id="clearCompletedTrigger">Clear completed</small>
    </li>
  `.trim();

  const filterOtps = container.querySelectorAll("input");
  filterOtps.forEach((el) => {
    el.addEventListener("change", () => {
      currentFilter = el.value;
      filterTodos();
    });
  });

  const clearCompletedTrigger = container.querySelector(
    "#clearCompletedTrigger"
  );
  clearCompletedTrigger.addEventListener("click", () => {
    clearCompleted();
  });

  return container.firstElementChild;
};

const mountTodos = () => {
  taskList.innerHTML = "";

  todos.forEach((todo) => {
    taskList.appendChild(renderToto(todo));
  });
  taskList.appendChild(mountTodoInfo());

  Sortable.create(taskList, {
    draggable: ".todo-item",
    ghostClass: "is-dragging",
    onEnd: ({ item, oldIndex, newIndex }) => {
      const todo = todos[oldIndex];
      todos.splice(oldIndex, 1);
      todos.splice(newIndex, 0, todo);
    }
  });
};

themeToggler.addEventListener("click", () => {
  const isDark = document.body.classList.contains("is-dark");

  themeToggler.setAttribute("name", isDark ? "moon-sharp" : "sunny-sharp");
  document.body.classList.toggle("is-dark");
});

addTodoInput.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    addTodo();
  }
});

addTodoBtn.addEventListener("click", () => {
  addTodo();
});

window.addEventListener("beforeunload", () => {
  localStorage.setItem("todos", JSON.stringify(todos));
});

mountTodos();
filterTodos();
