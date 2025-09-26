import React, { useEffect, useState } from "react";
import { Task } from "../types";
import { getTasks, deleteTask, updateTask } from "../api";
import TaskForm from "./TaskForm";
import CommentList from "./CommentList";
import ProjectList from "./ProjectList";

interface Props {
  projectId: string;
}

const TaskList: React.FC<Props> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = () => getTasks(projectId).then(setTasks);
  console.log(loadTasks)
  // console.log(ProjectList[projectId]) // Removed: ProjectList is a component, not an object to index

  useEffect(() => {
    loadTasks();
    console.log(projectId)
  }, [projectId]);

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    loadTasks();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateTask(id, { status });
    loadTasks();
  };

  return (
    <div className="mt-4">

      {/* <h1>task list</h1> */}
      <h3 className="font-bold mb-2">Tasks</h3>
      <TaskForm projectId={projectId} onCreated={loadTasks} />

      {tasks.map((t) => (
        <div key={t.id} className="border p-2 mb-2 rounded">
          <h4 className="font-semibold">{t.title}</h4>
          <p>{t.description}</p>
          <p>Status:
            <select
              value={t.status}
              onChange={(e) => handleStatusChange(t.id, e.target.value)}
              className="ml-2 border rounded px-1"
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </p>
          <p>Assignee: {t.assignee_email}</p>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded mt-2 hover:bg-red-600"
            onClick={() => handleDelete(t.id)}
          >
            Delete Task
          </button>
          <CommentList taskId={t.id} />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
