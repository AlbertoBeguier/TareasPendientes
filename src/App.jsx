import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/TaskFolderManager.css";
import { useState, useCallback, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NavBar } from "./components/NavBar";
import { TaskFolderManager } from "./components/TaskFolderManager";
import { TaskListManager } from "./components/TaskListManager";
import { Footer } from "./components/Footer";
import { collection, getDocs, setDoc, doc, query } from "firebase/firestore";
import { db } from "./firebase";
import { Login } from "./components/Login";

export function App() {
  const [taskFolders, setTaskFolders] = useState([]);
  const [selectedFolderName, setSelectedFolderName] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      const fetchTaskFolders = async () => {
        try {
          const foldersRef = collection(db, "taskFolders");
          const q = query(foldersRef);  // No filtro por usuario para que se vean todas las carpetas
          const querySnapshot = await getDocs(q);
          const folders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTaskFolders(folders);
        } catch (error) {
          console.error("Error al recuperar las carpetas de tareas:", error);
        }
      };

      fetchTaskFolders();
    }
  }, [user]);

  const updateFolders = useCallback(async newFolders => {
    for (const folder of newFolders) {
      await setDoc(doc(db, "taskFolders", folder.id || folder.name), folder);
    }
    setTaskFolders(newFolders);
  }, []);

  const handleFolderSelect = useCallback(folderName => {
    setSelectedFolderName(folderName);
  }, []);

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div className="app">
      <NavBar user={user} />
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
