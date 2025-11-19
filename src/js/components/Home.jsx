import { useEffect, useState } from "react";

export const Home = () => {
  const baseURL = "https://playground.4geeks.com/todo";
  const user = "AlexPicazo";

  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState("");
  const [editCompleted, setEditCompleted] = useState();
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const handleNewTask = (event) => setNewTask(event.target.value);
  const handleEditTask = (event) => setEditTask(event.target.value);
  const handleEditCompleted = (event) => setEditCompleted(event.target.checked);

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  const handleDelete = () => {
    console.log("click to delete");
  };

  const handleSubmitAdd = async (event) => {
    event.preventDefault();
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
      if (response.status == "404") {
        console.log("Por favor crea el usuario", user);
      }
      return;
    }
    const data = await response.json();
    console.log(data);
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
      if (response.status == "404") {
        console.log("Por favor crea el usuario", user);
      }
      return;
    }
    const data = await response.json();
    console.log(data);
    //logica de la aplicación
    setTodos(data.todos);
  };

  const deleteAllTasks = async () => {
    const uri = `${baseURL}/users/${user}`;
    const options = {
      method: "DELETE",
    };
    const response = await fetch(uri, options);
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-success">Todo List with Fetch</h1>
      {isEdit ? (
        <form>
          <div className="text-start mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Edit Task
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              value={editTask}
              onChange={handleEditTask}
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
          <button type="reset" className="btn btn-secondary">
            Submit
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
        </form>
      )}
      <div className="text-center mb-4">
        <button className="btn btn-danger btn-sm" onClick={deleteAllTasks}>
          Eliminar Todas las Tareas
        </button>
      </div>
      <hr className="my-3" />
      <h2 className="text-primary mt-5">List</h2>
      {/* UL con listados */}
      <ul className="list-group">
        {todos.map((item) => {
          return (
            <li
              key={item.id}
              className="hidden-icon list-group-item d-flex justify-content-between"
            >
              {item.label}
              <div>
                {item.is_done ? (
                  <i className="far fa-thumbs-up text-success me-2"></i>
                ) : (
                  <i className="fas fa-times-circle text-danger me-2"></i>
                )}
                {item.id}
              </div>
              <div>
                <span onClick={handleEdit}>
                  <i className="fas fa-edit text-primary me-2"></i>
                </span>

                <span onClick={handleDelete}>
                  <i className="fas fa-trash text-danger"></i>
                </span>
              </div>
            </li>
          );
        })}
        <li className="list-group-item text-end bg-body-tertiary">
          {todos.length == 0 ? "No tienes" : todos.length} tareas pendientes
        </li>
      </ul>
    </div>
  );
};
