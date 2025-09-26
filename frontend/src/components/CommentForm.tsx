import React, { useState } from "react";
import { addComment } from "../api";

interface Props {
  taskId: string;
  onAdded: () => void;
}

const CommentForm: React.FC<Props> = ({ taskId, onAdded }) => {
  const [content, setContent] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addComment(taskId, content, authorEmail);
    setContent("");
    setAuthorEmail("");
    onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="border p-2 rounded mb-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Comment"
        className="border p-2 w-full mb-2"
        required
      />
      <input
        value={authorEmail}
        onChange={(e) => setAuthorEmail(e.target.value)}
        placeholder="Your Email"
        className="border p-2 w-full mb-2"
        required
      />
      <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
        Add Comment
      </button>
    </form>
  );
};

export default CommentForm;
