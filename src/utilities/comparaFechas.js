import "../styles/comparaFechas.css";

export function comparaFechas(dueDate) {
  if (!dueDate) return { message: "", className: "" }; // Si no hay fecha, no hay mensaje

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Establecer la hora al inicio del día para comparar solo fechas
  const due = new Date(dueDate);
  const difference = due - today; // Diferencia en milisegundos

  // Convertir la diferencia a días
  const daysDifference = difference / (1000 * 60 * 60 * 24);

  if (daysDifference < -1) {
    return { message: "Tareas vencidas", className: "tareas-vencidas" };
  } else if (daysDifference < 0) {
    return { message: "Vencimientos hoy", className: "tareas-vencen-hoy" };
  } else if (daysDifference < 1) {
    return {
      message: "Vencimientos mañana",
      className: "tareas-vencen-mañana",
    };
  } else {
    return { message: "", className: "" }; // Para fechas futuras sin acción específica
  }
}
