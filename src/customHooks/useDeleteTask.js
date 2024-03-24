import { useCallback } from "react";
import Swal from "sweetalert2";

export const useDeleteTask = (tasks, updateTasks) => {
  const handleDeleteTask = useCallback(
    taskId => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        imageUrl: "/EstudioIcono64x64.png",
        imageWidth: 58,
        imageHeight: 58,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3e499c",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        customClass: {
          title: "swal2-title",
          text: "swal2-content",
        },
      }).then(result => {
        if (result.isConfirmed) {
          const updatedTasks = tasks.filter(task => task.id !== taskId);
          updateTasks(updatedTasks); // Esta función necesitará ser implementada en el componente

          Swal.fire({
            title: "¡Eliminada!",
            text: "La tarea ha sido eliminada.",
            imageUrl: "/EstudioIcono64x64.png",
            imageWidth: 58,
            imageHeight: 58,
            confirmButtonColor: "#3e499c",
            customClass: {
              title: "swal2-title",
              text: "swal2-content",
            },
          });
        }
      });
    },
    [tasks, updateTasks]
  );

  return handleDeleteTask;
};
