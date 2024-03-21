import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import "../styles/TaskFolderManager.css";
import "../styles/BotonesEstudio.css";
import "../styles/Contenedores.css";

export function TaskListManager({
  selectedFolderName,
  taskFolders,
  updateFolders,
}) {
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editText, setEditText] = useState("");
  const editTextareaRef = useRef(null);
  const [filter, setFilter] = useState("total");
  const [isPendingButtonFlashing, setIsPendingButtonFlashing] = useState(false);
  const selectedFolderIndex = taskFolders.findIndex(
    folder => folder.name === selectedFolderName
  );
  const selectedFolder =
    selectedFolderIndex !== -1
      ? taskFolders[selectedFolderIndex]
      : { tasks: [] };

  useEffect(() => {
    if (editTextareaRef.current) {
      editTextareaRef.current.style.height = "0px";
      const scrollHeight = editTextareaRef.current.scrollHeight;
      editTextareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [editText]);

  //! TAREAS PENDIENTES - CAMBIO DE COLOR
  useEffect(() => {
    const pendingTasks = selectedFolder.tasks.filter(
      task => !task.completed
    ).length;
    // Activa el efecto de cambio de color si hay tareas pendientes.
    setIsPendingButtonFlashing(pendingTasks > 0);
  }, [selectedFolder.tasks]); // Se ejecuta cada vez que cambia la lista de tareas

  const showTotal = () => setFilter("total");
  const showPending = () => setFilter("pending");
  const showCompleted = () => setFilter("completed");

  const filteredTasks = selectedFolder.tasks.filter(task => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const currentDate = new Date();
      const formattedDate = `${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${currentDate.getFullYear()}`;
      const taskWithDate = `${formattedDate} - ${newTask}`;

      const updatedFolder = {
        ...selectedFolder,
        tasks: [
          ...selectedFolder.tasks,
          { task: taskWithDate, completed: false },
        ],
      };

      const updatedFolders = [...taskFolders];
      if (selectedFolderIndex !== -1) {
        updatedFolders[selectedFolderIndex] = updatedFolder;
      }

      updateFolders(updatedFolders);
      setNewTask("");
    }
  };

  const handleEditTask = index => {
    const task = selectedFolder.tasks[index];
    setEditingIndex(index);
    setEditText(task.task);
  };

  const handleSaveEdit = () => {
    const updatedTasks = selectedFolder.tasks.map((task, index) => {
      if (index === editingIndex) {
        return { ...task, task: editText };
      }
      return task;
    });

    const updatedFolders = [...taskFolders];
    updatedFolders[selectedFolderIndex] = {
      ...selectedFolder,
      tasks: updatedTasks,
    };

    updateFolders(updatedFolders);
    setEditingIndex(-1);
    setEditText("");
  };

  const handleDeleteTask = taskIndex => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar esta tarea?"
    );
    if (isConfirmed) {
      const updatedTasks = selectedFolder.tasks.filter(
        (_, index) => index !== taskIndex
      );
      const updatedFolders = [...taskFolders];
      updatedFolders[selectedFolderIndex] = {
        ...selectedFolder,
        tasks: updatedTasks,
      };

      updateFolders(updatedFolders);
    }
  };

  const toggleTaskCompletion = taskIndex => {
    const updatedTasks = selectedFolder.tasks.map((task, index) => {
      if (index === taskIndex) {
        const currentDate = new Date();
        const formattedDate = `${currentDate
          .getDate()
          .toString()
          .padStart(2, "0")}/${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${currentDate.getFullYear()}`;

        return {
          ...task,
          completed: !task.completed,
          task: task.completed
            ? task.task.split(" (Completada el ")[0]
            : `${task.task} (Completada el ${formattedDate})`,
        };
      }
      return task;
    });

    const updatedFolders = [...taskFolders];
    updatedFolders[selectedFolderIndex] = {
      ...selectedFolder,
      tasks: updatedTasks,
    };

    updateFolders(updatedFolders);
  };

  return (
    <>
      <hr />
      <div className="contenedor-carpetas">
        <h5 className="titulos">TAREAS EN {selectedFolderName}</h5>
        <br />
        <div className="flex-container">
          <textarea
            value={newTask}
            onChange={e => setNewTask(e.target.value.toUpperCase())}
            placeholder="Agregar nueva tarea"
            className="task-input"
          ></textarea>
          <button onClick={handleAddTask} className="delete-icon-btn">
            <img src="/anadir.png" alt="Agregar" className="delete-icon" />
          </button>
        </div>
        <hr />
        <ol>
          <hr />
          {filteredTasks.map((task, index) => (
            <li
              key={index}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              {editingIndex === index ? (
                <>
                  <div className="flex-container">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="task-input"
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="delete-icon-btn"
                    >
                      <img
                        src="/disquete.png"
                        alt="Guardar"
                        className="delete-icon"
                      />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="task-text"
                    style={{ wordWrap: "break-word", maxWidth: "100%" }}
                  >
                    {task.task}
                  </div>
                  <span
                    className={`completion-icon ${
                      task.completed ? "completed" : ""
                    }`}
                    onClick={() => toggleTaskCompletion(index)}
                  >
                    {task.completed ? "✔" : "⭕"}
                  </span>
                  <button
                    onClick={() => handleEditTask(index)}
                    className="delete-icon-btn"
                  >
                    <img
                      src="/editar.png"
                      alt="Editar"
                      className="delete-icon"
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(index)}
                    className="delete-icon-btn"
                  >
                    <img
                      src="/contenedor-de-basura.png"
                      alt="Eliminar"
                      className="delete-icon"
                    />
                  </button>
                  <hr />
                </>
              )}
            </li>
          ))}
        </ol>
        <div className="contenedor-tareas">
          <div className="titulo-tareas">FILTRO TAREAS</div>
          <div className="task-filters">
            <button
              className={`boton-conteo-carpetas ${
                filter === "pending" ? "filtro-activo" : ""
              } ${isPendingButtonFlashing ? "cambiar-color" : ""}`}
              onClick={showPending}
            >
              PENDIENTES:{" "}
              {selectedFolder.tasks.filter(task => !task.completed).length}
            </button>

            <button
              className={`boton-conteo-carpetas ${
                filter === "completed" ? "filtro-activo" : ""
              }`}
              onClick={showCompleted}
            >
              COMPLETADAS:{" "}
              {selectedFolder.tasks.filter(task => task.completed).length}
            </button>
            <button
              className={`boton-conteo-carpetas ${
                filter === "total" ? "filtro-activo" : ""
              }`}
              onClick={showTotal}
            >
              TOTALES: {selectedFolder.tasks.length}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

TaskListManager.propTypes = {
  selectedFolderName: PropTypes.string.isRequired,
  taskFolders: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      tasks: PropTypes.arrayOf(
        PropTypes.shape({
          task: PropTypes.string.isRequired,
          completed: PropTypes.bool.isRequired,
        })
      ),
    })
  ).isRequired,
  updateFolders: PropTypes.func.isRequired,
};
