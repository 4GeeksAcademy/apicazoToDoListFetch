import { useEffect, useState } from "react";

export const Home = () => {
  const baseURL = "https://playground.4geeks.com/todo";
  const user = "AlexPicazo";

  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleNewTask = (event) => setNewTask(event.target.value);
  const handleEditCompleted = (event) => setEditCompleted(event.target.checked);

  // Al hacer click en editar guardo la tarea completa y abro el formulario
  const handleEdit = (todo) => {
    setEditTodo(todo);
    setEditTask(todo.label ?? "");
    setEditCompleted(Boolean(todo.is_done));
    setIsEdit(true);
  };

  const handleReset = () => {
    setEditTask("");
    setEditCompleted(false);
    setEditTodo(null);
    setIsEdit(false);
  };

  // PUT para actualizar la tarea seleccionada
  const handleUpdateTask = async (event) => {
    event.preventDefault();
    if (!editTodo || !editTodo.id) {
      console.log("No hay tarea seleccionada para editar");
      return;
    }

    const uri = `${baseURL}/todos/${editTodo.id}`;
    const body = {
      label: editTask,
      is_done: editCompleted,
    };

    const response = await fetch(uri, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.log("Error al actualizar", response.status);
      return;
    }

    // refresco lista y limpio estado de edición
    await getTodos();
    setIsEdit(false);
    setEditTodo(null);
    setEditTask("");
    setEditCompleted(false);
  };

  const handleDelete = async (param) => {
    const uri = `${baseURL}/todos/${param}`;
    const options = {
      method: "DELETE",
    };
    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log("error", response.status, response.statusText);
      return;
    }
    console.log("Tarea eliminada");
    await getTodos();
  };

  const createUser = async () => {
    const uri = `${baseURL}/users/${user}`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([]),
    };
    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log("error", response.status, response.statusText);
      return;
    }
    const data = await response.json();
    console.log("Usuario creado", data);
    getTodos();
  };

  const handleSubmitAdd = async (event) => {
    event.preventDefault();
    if (!newTask.trim()) return;

    const dataToSend = {
      label: newTask,
      is_done: false,
    };
    const uri = `${baseURL}/todos/${user}`;
    const options = {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log("error", response.status, response.statusText);
      if (response.status === 404) {
        console.log("Por favor crea el usuario", user);
      }
      return;
    }
    await response.json();
    setNewTask("");
    getTodos();
  };

  const getTodos = async () => {
    const uri = `${baseURL}/users/${user}`;
    const options = {
      method: "GET",
    };
    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log("error", response.status, response.statusText);
      if (response.status === 404) {
        console.log("Por favor crea el usuario", user);
      }
      return;
    }
    const data = await response.json();
    setTodos(data.todos || []);
  };

  const deleteAllTasks = async () => {
    const uri = `${baseURL}/users/${user}`;
    const options = {
      method: "DELETE",
    };
    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log("error", response.status, response.statusText);
      return;
    }
    console.log("Tareas eliminadas");
    await getTodos();
    await createUser();
  };

  useEffect(() => {
    getTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-success">Todo List with Fetch</h1>

      {isEdit ? (
        <form onSubmit={handleUpdateTask}>
          <div className="text-start mb-3">
            <label className="form-label">Edit Task</label>
            <input
              type="text"
              className="form-control"
              id="editTask"
              value={editTask}
              onChange={(e) => setEditTask(e.target.value)}
            />
          </div>
          <div className="text-start mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
              checked={editCompleted}
              onChange={handleEditCompleted}
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Completed
            </label>
          </div>
          <button type="submit" className="btn btn-primary me-2">
            Submit
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmitAdd}>
          <div className="text-start mb-3">
            <label htmlFor="exampleTask" className="form-label">
              Add Task
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleTask"
              value={newTask}
              onChange={handleNewTask}
            />
          </div>
          <button type="submit" className="btn btn-success">
            Add
          </button>
        </form>
      )}

      <hr className="my-3" />
      <h2 className="text-primary mt-5">List</h2>

      <ul className="list-group">
        {todos.map((item) => {
          return (
            <li
              key={item.id}
              className="hidden-icon list-group-item d-flex justify-content-between"
            >
              <span>
                {item.label}
                <div>
                  {item.is_done ? (
                    <i className="far fa-thumbs-up text-success me-2"></i>
                  ) : (
                    <i className="fas fa-times-circle text-danger me-2 justify-content-start"></i>
                  )}
                </div>
              </span>
              <div>
                <span
                  onClick={() => handleEdit(item)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fas fa-edit text-primary me-2"></i>
                </span>

                <span
                  onClick={() => handleDelete(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fas fa-trash text-danger"></i>
                </span>
              </div>
            </li>
          );
        })}
        <li className="list-group-item text-end bg-body-tertiary">
          {todos.length === 0 ? "No tienes" : todos.length} tareas pendientes
        </li>
      </ul>

      <div className="text-center mb-4">
        <button className="btn btn-danger btn-sm" onClick={deleteAllTasks}>
          Eliminar Todas las Tareas
        </button>
      </div>
      <div className="text-center mb-4">
        <button className="btn btn-success btn-sm" onClick={createUser}>
          Crea el usuario
        </button>
      </div>
    </div>
  );
};
