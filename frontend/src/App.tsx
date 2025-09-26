import React, { useState } from "react";
import ProjectList from "./components/ProjectList";
import ProjectForm from "./components/ProjectForm";
import TaskList from "./components/TaskList";

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Project Dashboard</h1>

      <ProjectForm onCreated={() => setRefresh(!refresh)} />
      <ProjectList
        onSelectProject={setSelectedProject}
        key={refresh ? 1 : 0}
      />
      {selectedProject && <TaskList projectId={selectedProject} />}
    </div>
  );
};

export default App;
