import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import "../styles/TaskFolderManager.css";
import "../styles/BotonesEstudio.css";
import "../styles/Contenedores.css";
import { useDeleteTask } from "../customHooks/useDeleteTask";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";

export function TaskListManager({
  selectedFolderName,
  taskFolders,
  updateFolders,
}) {
  const [newTask, setNewTask] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const editTextareaRef = useRef(null);
  const [filter, setFilter] = useState("pending");
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

  const deleteTask = useDeleteTask(selectedFolder.tasks, updateTasks, selectedFolderName);

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

  useEffect(() => {
    setFilter("pending");
  }, [selectedFolderName]);

  const showTotal = () => setFilter("total");
  const showPending = () => setFilter("pending");
  const showCompleted = () => setFilter("completed");

  const filteredTasks = selectedFolder.tasks.filter(task => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      const currentDate = new Date();
      const formattedDate = `${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${currentDate.getFullYear()}`;
      const taskWithDateAndId = {
        task: `${formattedDate} - ${newTask}`,
        completed: false,
        dueDate: newTaskDueDate,
      };

      // Añadir la tarea y obtener el ID autogenerado
      const taskDocRef = await addDoc(collection(db, "taskFolders", selectedFolderName, "tasks"), taskWithDateAndId);

      const updatedFolder = {
        ...selectedFolder,
        tasks: [...selectedFolder.tasks, { ...taskWithDateAndId, id: taskDocRef.id }],
      };

      const updatedFolders = [...taskFolders];
      if (selectedFolderIndex !== -1) {
        updatedFolders[selectedFolderIndex] = updatedFolder;
      }

      updateFolders(updatedFolders);
      setNewTask("");
      setNewTaskDueDate("");
    }
  };

  const handleEditTask = taskId => {
    const task = selectedFolder.tasks.find(task => task.id === taskId);
    setEditingTaskId(taskId);
    setEditText(task.task);
    setEditDueDate(task.dueDate || "");
  };

  const handleSaveEdit = async () => {
    const taskDocRef = doc(db, "taskFolders", selectedFolderName, "tasks", editingTaskId);
    const taskDoc = await getDoc(taskDocRef);

    if (taskDoc.exists()) {
      await updateDoc(taskDocRef, {
        task: editText,
        dueDate: editDueDate,
      });

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
    } else {
      console.error("No se encontró el documento para actualizar");
      // Puedes manejar el error de manera más visible aquí si lo necesitas.
    }
  };

  const toggleTaskCompletion = async taskId => {
    const taskDocRef = doc(db, "taskFolders", selectedFolderName, "tasks", taskId);
    const taskDoc = await getDoc(taskDocRef);

    if (taskDoc.exists()) {
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
            const taskParts = task.task.split(" (Completada el ");
            if (taskParts.length > 1) {
              taskUpdate.task = taskParts[0];
            }
          }
          return taskUpdate;
        }
        return task;
      });

      await updateDoc(taskDocRef, {
        completed: updatedTasks.find(task => task.id === taskId).completed,
        task: updatedTasks.find(task => task.id === taskId).task,
      });

      const updatedFolders = [...taskFolders];
      updatedFolders[selectedFolderIndex] = {
        ...selectedFolder,
        tasks: updatedTasks,
      };

      updateFolders(updatedFolders);
    } else {
      console.error("No se encontró el documento para actualizar");
      // Manejar el error según sea necesario
    }
  };

  function formatDate(isoDateString) {
    if (!isoDateString) return "";
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
                  <div>Vence el</div>
                  <input
                    className="fech-venc-input"
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
                  {task.dueDate && (
                    <div className="fech-venc">
                      Vence el {formatDate(task.dueDate)}
                    </div>
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
                    onClick={() => deleteTask(task.id)}
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
