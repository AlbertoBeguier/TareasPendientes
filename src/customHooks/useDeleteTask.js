import { useCallback } from "react";
import Swal from "sweetalert2";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export const useDeleteTask = (tasks, updateTasks, folderName) => {
  const handleDeleteTask = useCallback(
    async taskId => {
      const result = await Swal.fire({
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
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "taskFolders", folderName, "tasks", taskId));
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        updateTasks(updatedTasks);

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
    },
    [tasks, updateTasks, folderName]
  );

  return handleDeleteTask;
};

