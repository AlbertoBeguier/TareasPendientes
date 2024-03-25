import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import "../styles/TaskFolderManager.css";
import "../styles/BotonesEstudio.css";
import "../styles/Contenedores.css";
import { useDeleteTask } from "../customHooks/useDeleteTask";

export function TaskListManager({
  selectedFolderName,
  taskFolders,
  updateFolders,
}) {
  const [newTask, setNewTask] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState(""); // Estado para la fecha de vencimiento de la nueva tarea
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState(""); // Estado para editar la fecha de vencimiento
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
  const updateTasks = updatedTasks => {
    const updatedFolders = taskFolders.map((folder, index) => {
      if (index === selectedFolderIndex) {
        return { ...folder, tasks: updatedTasks };
      }
      return folder;
    });
    updateFolders(updatedFolders);
  };

  // Usar el hook useDeleteTask con las tareas de la carpeta seleccionada y la función updateTasks
  const deleteTask = useDeleteTask(selectedFolder.tasks, updateTasks);

  useEffect(() => {
    if (editTextareaRef.current) {
      editTextareaRef.current.style.height = "0px";
      const scrollHeight = editTextareaRef.current.scrollHeight;
      editTextareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [editText]);

  useEffect(() => {
    const pendingTasks = selectedFolder.tasks.filter(
      task => !task.completed
    ).length;
    setIsPendingButtonFlashing(pendingTasks > 0);
  }, [selectedFolder.tasks]);

  const showTotal = () => setFilter("total");
  const showPending = () => setFilter("pending");
  const showCompleted = () => setFilter("completed");

  const filteredTasks = selectedFolder.tasks.filter(task => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const uniqueId = generateUniqueId();
      const currentDate = new Date();
      const formattedDate = `${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${currentDate.getFullYear()}`;
      const taskWithDateAndId = {
        id: uniqueId,
        task: `${formattedDate} - ${newTask}`,
        completed: false,
        dueDate: newTaskDueDate,
      };

      const updatedFolder = {
        ...selectedFolder,
        tasks: [...selectedFolder.tasks, taskWithDateAndId],
      };

      const updatedFolders = [...taskFolders];
      if (selectedFolderIndex !== -1) {
        updatedFolders[selectedFolderIndex] = updatedFolder;
      }

      updateFolders(updatedFolders);
      setNewTask("");
      setNewTaskDueDate(""); // Restablece la fecha de vencimiento de la nueva tarea
    }
  };

  const handleEditTask = taskId => {
    const task = selectedFolder.tasks.find(task => task.id === taskId);
    setEditingTaskId(taskId);
    setEditText(task.task);
    setEditDueDate(task.dueDate || ""); // Establece la fecha de vencimiento para la edición
  };

  const handleSaveEdit = () => {
    const updatedTasks = selectedFolder.tasks.map(task => {
      if (task.id === editingTaskId) {
        return { ...task, task: editText, dueDate: editDueDate };
      }
      return task;
    });

    const updatedFolders = [...taskFolders];
    updatedFolders[selectedFolderIndex] = {
      ...selectedFolder,
      tasks: updatedTasks,
    };

    updateFolders(updatedFolders);
    setEditingTaskId(null);
    setEditText("");
    setEditDueDate("");
  };

  const handleDeleteTask = taskId => {
    // Simplemente llama a deleteTask con el ID de la tarea
    deleteTask(taskId);
  };

  const toggleTaskCompletion = taskId => {
    const updatedTasks = selectedFolder.tasks.map(task => {
      if (task.id === taskId) {
        const completed = !task.completed;
        let taskUpdate = { ...task, completed };
        if (completed) {
          const currentDate = new Date();
          const formattedDate = `${currentDate
            .getDate()
            .toString()
            .padStart(2, "0")}/${(currentDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${currentDate.getFullYear()}`;
          taskUpdate.task = `${task.task} (Completada el ${formattedDate})`;
        } else {
          // Si la tarea se está marcando como no completada, elimina la fecha de finalización
          const taskParts = task.task.split(" (Completada el ");
          if (taskParts.length > 1) {
            taskUpdate.task = taskParts[0];
          }
        }
        return taskUpdate;
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
  function formatDate(isoDateString) {
    if (!isoDateString) return ""; // Retorna una cadena vacía si no hay fecha

    const [year, month, day] = isoDateString.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <>
      <hr />
      <div className="contenedor-carpetas">
        <h5 className="titulos">
          TAREAS EN {selectedFolderName.toUpperCase()}
        </h5>
        <br />
        <div className="flex-container">
          <textarea
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="Agregar nueva tarea"
            className="task-input"
          ></textarea>
          <button onClick={handleAddTask} className="delete-icon-btn">
            <img src="/anadir.png" alt="Agregar" className="delete-icon" />
          </button>
        </div>
        <hr />
        <ol>
          {filteredTasks.map(task => (
            <li
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              {editingTaskId === task.id ? (
                <div className="flex-container">
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="task-input"
                  />
                  {/* Input para editar la fecha de vencimiento de una tarea existente */}
                  <div>Vencimiento:</div>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={e => setEditDueDate(e.target.value)}
                  />
                  <button onClick={handleSaveEdit} className="delete-icon-btn">
                    <img
                      src="/disquete.png"
                      alt="Guardar"
                      className="delete-icon"
                    />
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className="task-text"
                    style={{ wordWrap: "break-word", maxWidth: "100%" }}
                  >
                    {task.task}
                  </div>
                  {/* Solo muestra la fecha de vencimiento si existe */}
                  {task.dueDate && (
                    <div>Vence el {formatDate(task.dueDate)}</div>
                  )}
                  <span
                    className={`completion-icon ${
                      task.completed ? "completed" : ""
                    }`}
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    {task.completed ? "✔" : "⭕"}
                  </span>
                  <button
                    onClick={() => handleEditTask(task.id)}
                    className="delete-icon-btn"
                  >
                    <img
                      src="/editar.png"
                      alt="Editar"
                      className="delete-icon"
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="delete-icon-btn"
                  >
                    <img
                      src="/contenedor-de-basura.png"
                      alt="Eliminar"
                      className="delete-icon"
                    />
                  </button>
                </>
              )}
              <hr />
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
