import React, { useEffect, useState } from "react";
import { Project } from "../types";
import { getProjects, deleteProject, updateProject } from "../api";

interface Props {
  onSelectProject: (projectId: string) => void;
}

const ProjectList: React.FC<Props> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  // const loadProjects = () => getProjects().then(setProjects);

  const loadProjects = async ()=>{
    try {
        let data = await getProjects();
    setProjects(data)
    } catch (error) {
      console.error("Failed to fetch the project",error)
    }
  
  }
  
  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    loadProjects();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateProject(id, { status });
    loadProjects();
  };

  console.log(projects)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((p) => (
        <div key={p.id} className="border p-4 rounded shadow hover:shadow-lg">
          <h2 className="font-bold">{p.name}</h2>
          <p>{p.description}</p>
          <p>Status: 
            <select
              value={p.status}
              onChange={(e) => handleStatusChange(p.id, e.target.value)}
              className="ml-2 border rounded px-1"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="ON-HOLD">ON-HOLD</option>
            </select>
          </p>
          <p>Tasks: {p.completedTasks}/{p.taskCount}</p>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded mt-2 hover:bg-red-600"
            onClick={() => handleDelete(p.id)}
          >
            Delete
          </button>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded mt-2 ml-2 hover:bg-blue-600"
            onClick={() => onSelectProject(p.id)}
          >
            View Tasks
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
