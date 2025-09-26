import React, { useState } from "react";
import { createProject } from "../api";

interface Props {
  onCreated: () => void;
}

const ProjectForm: React.FC<Props> = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject(name, description);
    setName("");
    setDescription("");
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded shadow mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project Name"
        required
        className="border p-2 w-full mb-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Project Description"
        className="border p-2 w-full mb-2"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Create Project
      </button>
    </form>
  );
};

export default ProjectForm;
