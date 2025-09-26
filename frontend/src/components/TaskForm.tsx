import React, { useState } from "react";
import { createTask } from "../api";

interface Props {
  projectId: string;
  onCreated: () => void;
}

const TaskForm: React.FC<Props> = ({ projectId, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeEmail, setAssigneeEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask(projectId, title, description);
    setTitle("");
    setDescription("");
    setAssigneeEmail("");
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded shadow mb-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        required
        className="border p-2 w-full mb-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        className="border p-2 w-full mb-2"
      />
      <input
        value={assigneeEmail}
        onChange={(e) => setAssigneeEmail(e.target.value)}
        placeholder="Assignee Email"
        className="border p-2 w-full mb-2"
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;
