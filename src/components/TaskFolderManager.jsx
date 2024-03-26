import PropTypes from "prop-types";
import "../styles/TaskFolderManager.css";
import "../styles/Contenedores.css";
import { useState, useEffect, useMemo } from "react";
import { useDeleteFolder } from "../customHooks/useDeleteFolder"; // Importa el hook personalizado para mensaje al eliminar carpeta
import { comparaFechas } from "../utilities/comparaFechas"; // Importa la función para comparar fechas

export function TaskFolderManager({
  taskFolders,
  updateFolders,
  onFolderSelect,
}) {
  // Hook para manejar el estado del nombre de la nueva carpeta de tareas
  const [newFolderName, setNewFolderName] = useState("");

  // Nuevo estado para manejar el color de la nueva carpeta de tareas
  const [folderColor, setFolderColor] = useState("#3e499c");

  // Estado para el color de la leyenda de tareas pendientes
  const [pendingColor, setPendingColor] = useState("#3e499c");
  // Índice para controlar el color actual de la leyenda de tareas pendientes
  const [colorIndex, setColorIndex] = useState(0);
  // Array de colores para la leyenda de tareas pendientes
  const colors = useMemo(
    () => [
      "#3e499c",
      "#554999",
      "#6e4996",
      "#883d8a",
      "#a2317e",
      "#bb2552",
      "#d41726",
    ],
    []
  );
  // Usar el hook personalizado para manejar la eliminación de carpetas
  const handleDeleteFolder = useDeleteFolder(taskFolders, updateFolders);
  // Actualiza el color de la leyenda de tareas pendientes cuando el índice cambia
  useEffect(() => {
    const interval = setInterval(() => {
      // Cambiamos el índice solo si hay tareas pendientes
      const hasPendingTasks = taskFolders.some(folder =>
        folder.tasks.some(task => !task.completed)
      );
      if (hasPendingTasks) {
        setColorIndex(prevIndex => (prevIndex + 1) % colors.length);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [taskFolders, colors.length]);
  useEffect(() => {
    setPendingColor(colors[colorIndex]);
  }, [colorIndex, colors]);

  // Modificaciones aquí para gestionar el placeholder
  const [placeholderText, setPlaceholderText] = useState("Nombrar carpeta"); // Estado para manejar el texto del placeholder

  // Actualiza el placeholder al enfocar
  const handleFocus = () => {
    setPlaceholderText(""); // Vacía el texto del placeholder al enfocar
  };

  // Restaura el placeholder al perder el foco
  const handleBlur = () => {
    setPlaceholderText("Nombrar carpeta"); // Restaura el texto original del placeholder
  };

  // Función para simular el clic en el input de color
  const triggerColorPicker = () => {
    document.getElementById("folder-color-picker").click();
  };
  // Función para crear una nueva carpeta
  const handleCreateFolder = () => {
    const newNameUpper = newFolderName.toUpperCase();
    if (
      newFolderName.trim() !== "" &&
      !taskFolders.some(folder => folder.name === newNameUpper)
    ) {
      const updatedFolders = [
        ...taskFolders,
        { name: newNameUpper, color: folderColor, tasks: [] },
      ];
      updateFolders(updatedFolders);
      setNewFolderName("");
      setFolderColor("#3e499c"); // Resetea el color a azul después de crear una carpeta
    }
  };

  // Comprueba si el nombre de la carpeta ya existe
  const folderExists = taskFolders.some(
    folder => folder.name === newFolderName.toUpperCase()
  );

  return (
    <>
      <hr />
      <div className="contenedor-carpetas">
        <h5 className="titulos">CREAR CARPETA</h5>
        <div className="flex-row">
          <span className="color-picker-container">
            <input
              id="folder-color-picker"
              name="folderColor"
              type="color"
              value={folderColor}
              onChange={e => setFolderColor(e.target.value)}
              style={{ display: "none" }} // Input oculto
            />
            <img
              className="imagen-selector-color"
              src="/selector-color.png"
              alt="Seleccionar color"
              onClick={triggerColorPicker}
              onTouchEnd={triggerColorPicker}
              style={{ cursor: "pointer" }}
            />
          </span>
          <span>
            <input
              id="new-folder-name"
              name="newFolderName"
              type="text"
              placeholder={placeholderText}
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={{ backgroundColor: folderColor }}
            />
            <button
              className="delete-icon-btn delete-icon-1"
              onClick={handleCreateFolder}
            >
              <img
                src="/disquete.png"
                alt="Guardar"
                className="delete-icon-1"
              />
            </button>
            {folderExists && (
              <span className="advertencia-carpeta">La carpeta ya existe.</span>
            )}
          </span>
        </div>
      </div>
      <hr />
      <div className="contenedor-carpetas">
        <h5 className="titulos">TODAS LAS CARPETAS</h5>
        <br />
        <div>
          {taskFolders.map((folder, index) => {
            const totalTasks = folder.tasks.length;
            const completedTasks = folder.tasks.filter(
              task => task.completed
            ).length;
            const pendingTasks = totalTasks - completedTasks;
            const taskStatus = folder.tasks
              .filter(task => !task.completed) // Asegura que solo tareas no completadas sean consideradas
              .map(task => comparaFechas(task.dueDate))
              .find(status => status.message !== "");
            return (
              <div
                key={index}
                className="folder-container"
                style={{ display: "flex", alignItems: "center" }}
              >
                <button
                  className="boton-carpetas"
                  style={{ backgroundColor: folder.color }}
                  onClick={() => onFolderSelect(folder.name)}
                >
                  {folder.name}
                </button>

                <button
                  className="delete-icon-btn"
                  onClick={() => handleDeleteFolder(folder.name)}
                  style={{ marginLeft: "10px" }}
                >
                  <img
                    src="/contenedor-de-basura.png"
                    alt="Eliminar"
                    className="delete-icon"
                  />
                </button>

                <div className="container-tareas-y-vencimientos">
                  <span
                    className="tareas-pend-comp-tot"
                    style={{
                      color: pendingTasks !== 0 ? pendingColor : "#000000",
                    }}
                  >
                    Pendientes: {pendingTasks} -
                  </span>
                  <span className="tareas-pend-comp-tot">
                    Completadas: {completedTasks} -
                  </span>
                  <span className="tareas-pend-comp-tot">
                    Totales: {totalTasks}
                  </span>
                  {taskStatus && (
                    <div
                      className={`folder-due-status ${taskStatus.className}`}
                      style={{ marginLeft: "10px" }}
                    >
                      {taskStatus.message}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

TaskFolderManager.propTypes = {
  taskFolders: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
      tasks: PropTypes.arrayOf(
        PropTypes.shape({
          task: PropTypes.string,
          completed: PropTypes.bool,
        })
      ),
    })
  ).isRequired,
  updateFolders: PropTypes.func.isRequired,
  onFolderSelect: PropTypes.func.isRequired,
};
