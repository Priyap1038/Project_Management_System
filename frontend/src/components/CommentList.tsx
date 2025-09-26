import React, { useEffect, useState } from "react";
import { getComments, deleteComment } from "../api";
import { Comment } from "../types";
import CommentForm from "./CommentForm";

interface Props {
  taskId: string;
}

const CommentList: React.FC<Props> = ({ taskId }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const loadComments = () => getComments(taskId).then(setComments);

  useEffect(() => {
    loadComments();
  }, [taskId]);

  const handleDelete = async (id: string) => {
    await deleteComment(id);
    loadComments();
  };

  return (
    <div className="ml-4 mt-2">
      <h4 className="font-bold">Comments</h4>
      <CommentForm taskId={taskId} onAdded={loadComments} />
      {comments.map((c) => (
        <div key={c.id} className="border p-2 rounded mb-1">
          <p>{c.content}</p>
          <p className="text-sm text-gray-500">
            By: {c.author_email} |{" "}
            <button
              className="text-red-500 hover:underline"
              onClick={() => handleDelete(c.id)}
            >
              Delete
            </button>
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
