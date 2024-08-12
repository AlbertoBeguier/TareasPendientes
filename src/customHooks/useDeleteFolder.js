import { useCallback } from "react";
import Swal from "sweetalert2";
import { deleteDoc, doc, collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";

export function useDeleteFolder(taskFolders, updateFolders) {
  const handleDeleteFolder = useCallback(
    async folderName => {
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
        const folderRef = doc(db, "taskFolders", folderName);
        
        // Eliminar todas las tareas asociadas a la carpeta
        const tasksQuery = query(collection(db, "taskFolders", folderName, "tasks"));
        const tasksSnapshot = await getDocs(tasksQuery);
        tasksSnapshot.forEach(async (taskDoc) => {
          await deleteDoc(taskDoc.ref);
        });

        // Luego elimina la carpeta
        await deleteDoc(folderRef);
        const updatedFolders = taskFolders.filter(
          folder => folder.name !== folderName
        );
        updateFolders(updatedFolders);

        Swal.fire({
          title: "¡Eliminada!",
          text: "La carpeta ha sido eliminada.",
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
    [taskFolders, updateFolders]
  );

  return handleDeleteFolder;
}
