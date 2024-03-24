import { useCallback } from "react";
import Swal from "sweetalert2";
import "../styles/sweetalert2.css";

export function useDeleteFolder(taskFolders, updateFolders) {
  const handleDeleteFolder = useCallback(
    folderName => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        imageUrl: "/EstudioIcono64x64.png",
        imageWidth: 58, // Asegúrate de ajustar estas dimensiones al tamaño de tu imagen
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
          const updatedFolders = taskFolders.filter(
            folder => folder.name !== folderName
          );
          updateFolders(updatedFolders);

          // Mensaje de confirmación con el mismo icono
          Swal.fire({
            title: "¡Eliminada!",
            text: "La carpeta ha sido eliminada.",
            imageUrl: "/EstudioIcono64x64.png",
            imageWidth: 58, // Ajusta estas dimensiones si es necesario
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
    [taskFolders, updateFolders]
  );

  return handleDeleteFolder;
}
