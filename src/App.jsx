import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/TaskFolderManager.css";
import { useState, useCallback, useEffect } from "react";
import { NavBar } from "./components/NavBar";
import { TaskFolderManager } from "./components/TaskFolderManager";
import { TaskListManager } from "./components/TaskListManager";
import { Footer } from "./components/Footer";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export function App() {
  const [taskFolders, setTaskFolders] = useState([]);
  const [selectedFolderName, setSelectedFolderName] = useState("");

  useEffect(() => {
    const fetchTaskFolders = async () => {
      const querySnapshot = await getDocs(collection(db, "taskFolders"));
      const folders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTaskFolders(folders);
    };

    fetchTaskFolders();
  }, []);

  const updateFolders = useCallback(async newFolders => {
    // Actualiza cada carpeta en Firestore
    for (const folder of newFolders) {
      await setDoc(doc(db, "taskFolders", folder.id || folder.name), folder);
    }
    setTaskFolders(newFolders);
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

