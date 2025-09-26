const GRAPHQL_URL = "http://127.0.0.1:8000/graphql/";
const ORG_SLUG = "test-org";

async function fetchGraphQL(query: string, variables?: any) {
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ORG-SLUG": "python-backend-1" // must match DB
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      console.error("GraphQL request failed:", res.status, await res.text());
      throw new Error(`Request failed: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error("GraphQL errors:", json.errors);
      throw new Error(json.errors.map((e: any) => e.message).join(", "));
    }

    return json.data;  // ✅ unwrap 'data'
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}


// Projects
export async function getProjects() {
  const query = `
    query {
      projectsForOrg{
        id
        name
        description
        status
        dueDate
        createdAt
        taskCount
        completedTasks
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data.projectsForOrg;
}

// export async function createProject(name: string, description?: string) {
//   const query = `
//     mutation($name: String!, $description: String) {
//       createProject(name: $name, description: $description) {
//         project { id name description status dueDate }
//       }
//     }
//   `;
//   const data = await fetchGraphQL(query, { name, description });

//   console.log("GraphQL response:", data);

//   return data.createProject.project;
// }

export async function createProject(name: string, description?: string) {
  const query = `
    mutation($name: String!, $description: String) {
      createProject(name: $name, description: $description) {
        project { id name description status dueDate }
      }
    }
  `;

  const variables = { name, description: description ?? null };

  const res = await fetch("http://127.0.0.1:8000/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-ORG-SLUG": "python-backend-1", // <--- required header
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error(json.errors[0].message);
  }

  console.log("GraphQL response:", json.data);
  return json.data.createProject.project;
}


export async function updateProject(id: string, fields: any) {
  const mutation = `
    mutation($id: ID!, $name: String, $description: String, $status: String, $dueDate: Date) {
      updateProject(id: $id, name: $name, description: $description, status: $status, dueDate: $dueDate) {
        project { id name description status dueDate }
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { id, ...fields });
  return data.updateProject.project;
}

export async function deleteProject(id: string) {
  const mutation = `
    mutation($id: ID!) {
      deleteProject(id: $id) { ok }
    }
  `;
  const data = await fetchGraphQL(mutation, { id });
  return data.deleteProject.ok;
}

// Tasks
export async function getTasks(projectId: string) {
  const query = `
    query($projectId: ID!) {
      tasksForProjects(projectId: $projectId) {
        id title description status assigneeEmail dueDate
      }
    }
  `;
  const data = await fetchGraphQL(query, { projectId });
  return data.tasksForProjects;
}

export async function createTask(projectId: string, title: string, description?: string) {
  const mutation = `
    mutation($projectId: ID!, $title: String!, $description: String) {
      createTask(projectId: $projectId, title: $title, description: $description) {
        task { id title description status assigneeEmail dueDate }
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { projectId, title, description });
  return data.createTask.task;
}

export async function updateTask(id: string, fields: any) {
  const mutation = `
    mutation($id: ID!, $title: String, $description: String, $status: String, $assigneeEmail: String) {
      updateTask(id: $id, title: $title, description: $description, status: $status, assigneeEmail: $assigneeEmail) {
        task { id title description status assigneeEmail dueDate }
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { id, ...fields });
  return data.updateTask.task;
}

export async function deleteTask(id: string) {
  const mutation = `
    mutation($id: ID!) {
      deleteTask(id: $id) { ok }
    }
  `;
  const data = await fetchGraphQL(mutation, { id });
  return data.deleteTask.ok;
}

// Comments
export async function getComments(taskId: string) {
  const query = `
    query($taskId: ID!) {
      taskComments: tasksForProjects(projectId: $taskId) {
        comments {
          id content authorEmail timestamp
        }
      }
    }
  `;
  const data = await fetchGraphQL(query, { taskId });
  return data.taskComments?.[0]?.comments || [];
}

export async function addComment(taskId: string, content: string, authorEmail: string) {
  const mutation = `
    mutation($taskId: ID!, $content: String!, $authorEmail: String!) {
      addTaskComment(taskId: $taskId, content: $content, authorEmail: $authorEmail) {
        comment { id content authorEmail timestamp }
      }
    }
  `;
  const data = await fetchGraphQL(mutation, { taskId, content, authorEmail });
  return data.addTaskComment.comment;
}

export async function deleteComment(id: string) {
  const mutation = `
    mutation($id: ID!) {
      deleteTaskComment(id: $id) { ok }
    }
  `;
  const data = await fetchGraphQL(mutation, { id });
  return data.deleteTaskComment.ok;
}
