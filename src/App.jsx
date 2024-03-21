import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import "./styles/TaskFolderManager.css";
import { useState, useCallback } from "react";

import { NavBar } from "./components/NavBar";
import { TaskFolderManager } from "./components/TaskFolderManager";
import { TaskListManager } from "./components/TaskListManager";
import { Footer } from "./components/Footer";

export function App() {
  const [taskFolders, setTaskFolders] = useState(() => {
    const savedFolders = localStorage.getItem("taskFolders");
    return savedFolders ? JSON.parse(savedFolders) : [];
  });
  const [selectedFolderName, setSelectedFolderName] = useState("");

  const updateFolders = useCallback(newFolders => {
    setTaskFolders(newFolders);
    localStorage.setItem("taskFolders", JSON.stringify(newFolders));
  }, []);

  const handleFolderSelect = useCallback(folderName => {
    setSelectedFolderName(folderName);
  }, []);

  return (
    <div className="app">
      <NavBar />
      <TaskFolderManager
        taskFolders={taskFolders}
        updateFolders={updateFolders}
        onFolderSelect={handleFolderSelect}
      />
      {selectedFolderName && (
        <TaskListManager
          selectedFolderName={selectedFolderName}
          taskFolders={taskFolders}
          updateFolders={updateFolders}
        />
      )}
      <Footer />
    </div>
  );
}
